// fcm-manager.js
// Responsible for registering the service worker, requesting permission, obtaining FCM token,
// saving it to Firestore and handling foreground messages.
//
// Key fixes:
//  - Do NOT aggressively/unnecessarily unregister existing SWs (avoids race conditions).
//  - Wait for registration activation and for navigator.serviceWorker.ready (page-controlled).
//  - Ensure the service worker claims clients on activation.
//  - Add missing Firestore imports (setDoc) used by saveToken.
//  - Export setupFCM alias so control.js's import continues to work.

import { auth, messaging } from './firebase-config.js';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  where,
  getDoc,
  getDocs,
  setDoc // <-- added, required by saveToken
} from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import { messagingConfig } from './messaging-config.js';
import roleManager, { ROLES, ROLE_CONFIG, OWNER_EMAILS } from './role-manager.js';

const db = getFirestore();
let swRegistration = null;

/**
 * Register service worker in a robust way:
 *  - register()
 *  - wait until the worker reaches 'activated' state (listen to updatefound/statechange)
 *  - then wait for navigator.serviceWorker.ready (ensures the SW controls the page)
 *  - finally send CLIENTS_CLAIM to the active worker so it can call clients.claim()
 */
async function registerServiceWorker() {
  try {
    const swPath = '/firebase-messaging-sw.js';
    console.log('[FCM] Registering service worker at:', swPath);

    // Register the SW (do NOT unregister all existing SWs here — causes races)
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('[FCM] registration returned, waiting for worker activation...');

    // If an installing/waiting worker exists, wait for it to become activated
    if (registration.installing) {
      await new Promise((resolve, reject) => {
        const installing = registration.installing;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'activated') resolve();
          else if (installing.state === 'redundant') reject(new Error('Service worker became redundant'));
        });
      });
    } else if (registration.waiting) {
      // waiting -> may soon become active after skipWaiting in SW or page reload
      console.log('[FCM] worker is waiting — proceed to navigator.serviceWorker.ready');
    } else if (registration.active) {
      // already active
      console.log('[FCM] worker is already active');
    }

    // Wait until a service worker *controls* the page (guarantees clients.claim())
    await navigator.serviceWorker.ready;
    console.log('[FCM] navigator.serviceWorker.ready — SW is controlling the page');

    // Try to message the active worker to claim clients (optional, defensive)
    try {
      if (registration.active) {
        registration.active.postMessage({ type: 'CLIENTS_CLAIM' });
      }
    } catch (e) {
      console.warn('[FCM] Could not postMessage to active SW:', e);
    }

    swRegistration = registration;
    console.log('[FCM] Service Worker registration complete & stored locally');
    return registration;
  } catch (error) {
    console.error('[FCM] Error registering service worker:', error);
    throw error;
  }
}

/**
 * Main setup function for notifications.
 * - checks support
 * - verifies secure context (https or localhost)
 * - ensures user is authenticated
 * - registers service worker (robustly)
 * - requests Notification permission
 * - calls getToken with serviceWorkerRegistration
 */
async function setupNotifications() {
  try {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('[FCM] Notifications or Service Workers not supported in this environment');
      return;
    }

    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

    if (!isLocalhost && window.location.protocol !== 'https:') {
      console.log('[FCM] FCM requires HTTPS (except on localhost)');
      return;
    }

    if (!auth.currentUser) {
      console.log('[FCM] User not authenticated; skipping notifications setup');
      return;
    }

    // Register SW if not already done
    if (!swRegistration) {
      swRegistration = await registerServiceWorker();
    }

    // Request permission for notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[FCM] Notification permission not granted:', permission);
      return;
    }

    // Now request token from Firebase Messaging with the SW registration
    console.log('[FCM] Requesting FCM token...');
    try {
      // Diagnostics: surface helpful info for debugging VAPID/push issues.
      try {
        console.log('[FCM][diagnostics] vapidKeyPresent:', !!messagingConfig.vapidKey, 'vapidKeyLen:', messagingConfig.vapidKey?.length || 0);
        console.log('[FCM][diagnostics] userAgent:', navigator.userAgent);
        console.log('[FCM][diagnostics] swRegistration.scope:', swRegistration?.scope);
        console.log('[FCM][diagnostics] pushManager available:', !!(swRegistration && swRegistration.pushManager));
        if (swRegistration && swRegistration.pushManager) {
          try {
            const existingSub = await swRegistration.pushManager.getSubscription();
            console.log('[FCM][diagnostics] existing push subscription:', existingSub);
          } catch (subErr) {
            console.warn('[FCM][diagnostics] error checking existing push subscription:', subErr);
          }
        }
      } catch (diagErr) {
        console.warn('[FCM][diagnostics] diagnostics failed:', diagErr);
      }

      const maxRetries = 3;
      let lastError = null;

      for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
        try {
          // Double-check SW is ready and controlling before each attempt
          const swReady = await navigator.serviceWorker.ready;
          if (!swReady.active) {
            throw new Error('Service worker not yet active');
          }

          // Ensure the service worker actually controls this page. There are cases where
          // registration.active is present but the controller is not yet set until a
          // navigation or client.claim(). We listen for controllerchange for a short
          // window before failing to give the SW time to claim clients.
          if (!navigator.serviceWorker.controller) {
            await new Promise((resolve) => {
              let settled = false;
              const onChange = () => {
                if (settled) return;
                settled = true;
                navigator.serviceWorker.removeEventListener('controllerchange', onChange);
                resolve();
              };
              navigator.serviceWorker.addEventListener('controllerchange', onChange);

              // fallback timeout: 3s
              setTimeout(() => {
                if (settled) return;
                settled = true;
                navigator.serviceWorker.removeEventListener('controllerchange', onChange);
                resolve();
              }, 3000);
            });
          }

          if (!navigator.serviceWorker.controller) {
            throw new Error('Service worker not controlling the page');
          }

          const currentToken = await getToken(messaging, {
            vapidKey: messagingConfig.vapidKey,
            serviceWorkerRegistration: swRegistration
          });

          if (currentToken) {
            await saveToken(currentToken);
            setupForegroundHandler();
            console.log('[FCM] FCM token obtained and saved');
            return;
          }
          console.log('[FCM] No registration token available');
          return;
        } catch (error) {
          lastError = error;
          // If the browser reports a push service registration error (AbortError)
          // it often means push service is unavailable, VAPID key misconfigured,
          // or the page isn't served from a secure context. Provide clearer logs
          // and stop retrying faster for AbortError.
          console.error(`[FCM] Attempt ${retryCount + 1}/${maxRetries} failed:`, error);

          if (error && (error.name === 'AbortError' || /push service/i.test(error.message || ''))) {
            console.warn('[FCM] Push registration failed (AbortError). This usually indicates a VAPID/config or secure-context issue.');
            console.warn('[FCM] Check that your VAPID key is correct in messaging-config.js, that firebase-config has the correct messagingSenderId, and that the Service Worker file is served from the site root over HTTPS or localhost.');

            // Add a small non-blocking admin-visible banner with guidance so it's obvious in the app UI
            try {
              if (typeof document !== 'undefined' && document.body) {
                const id = 'fcm-diagnostic-banner';
                if (!document.getElementById(id)) {
                  const banner = document.createElement('div');
                  banner.id = id;
                  banner.style.position = 'fixed';
                  banner.style.left = '12px';
                  banner.style.bottom = '12px';
                  banner.style.zIndex = 99999;
                  banner.style.padding = '10px 14px';
                  banner.style.background = '#f8d7da';
                  banner.style.color = '#721c24';
                  banner.style.border = '1px solid #f5c6cb';
                  banner.style.borderRadius = '6px';
                  banner.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                  banner.style.fontSize = '13px';
                  banner.textContent = 'FCM registration failed. Check VAPID key, messagingSenderId, and SW scope (see console for details).';
                  document.body.appendChild(banner);
                }
              }
            } catch (bannerErr) {
              console.warn('[FCM] Unable to show UI diagnostic banner:', bannerErr);
            }

            // don't keep aggressively retrying AbortError; break out early
            break;
          }

          if (retryCount < maxRetries - 1) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
            console.log(`[FCM] Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw error; // Last retry failed
        }
      }
      throw lastError || new Error('Failed to obtain FCM token after retries');
    } catch (error) {
      console.error('[FCM] Error getting FCM token:', error);
      if (error?.code === 'messaging/failed-service-worker-registration') {
        window.location.reload();
      }
      throw error;
    }
  } catch (error) {
    console.error('[FCM] setupNotifications error:', error);
    // Don't rethrow here - we want to continue even if notifications fail
  }
}

/**
 * Save the FCM token into Firestore under adminTokens/<uid>.
 * Note: we must use setDoc (imported above). Security rules should protect this.
 */
async function saveToken(token) {
  try {
    if (!auth.currentUser) {
      console.warn('[FCM] No auth.currentUser while trying to save FCM token');
      return;
    }
    const tokenDocRef = doc(db, 'adminTokens', auth.currentUser.uid);
    await setDoc(tokenDocRef, {
      token,
      email: auth.currentUser.email,
      lastUpdated: new Date(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    }, { merge: true });
    console.log('[FCM] FCM token saved to Firestore');
  } catch (error) {
    console.error('[FCM] Error saving token:', error);
  }
}

/**
 * Foreground message handler — uses the service worker registration to display a notification
 * if possible. We keep this simple: logs and tries to show a notification via the SW registration.
 */
function setupForegroundHandler() {
  try {
    messaging.onMessage((payload) => {
      console.log('[FCM] Received foreground message:', payload);
      if (swRegistration?.showNotification) {
        const title = payload.notification?.title || 'Notification';
        const options = {
          body: payload.notification?.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'ag-notification',
          data: payload.data,
          requireInteraction: true
        };
        // Try to show via registration (if supported)
        try {
          swRegistration.showNotification(title, options);
        } catch (e) {
          console.warn('[FCM] swRegistration.showNotification failed:', e);
        }
      }
    });
  } catch (error) {
    console.error('[FCM] Error setting up foreground handler:', error);
  }
}

/**
 * Optional initializeApp wrapper invoked on DOMContentLoaded. If you have different app lifecycle,
 * call setupNotifications() when auth.currentUser is available.
 */
async function initializeApp() {
  try {
    await setupNotifications();
    // ensure owners exist (your roleManager usage in original file)
    await roleManager.assignRole(auth.currentUser, 'ag.aliengamerz@gmail.com', ROLES.OWNER);
    await roleManager.assignRole(auth.currentUser, 'hamza.datashare@gmail.com', ROLES.OWNER);
  } catch (error) {
    console.error('[FCM] initializeApp error:', error);
  }
}

// Export functions. Note: we export a setupFCM alias because control.js imports setupFCM.
export {
  registerServiceWorker,
  setupNotifications,
  initializeApp
};
export const setupFCM = setupNotifications; // alias for backwards compatibility

/**
 * Low-level push diagnostics: attempts to subscribe via PushManager using the VAPID key
 * and logs detailed errors. This is intended for debugging VAPID/messaging issues
 * when getToken() returns AbortError. It does not persist the subscription in Firestore
 * and will unsubscribe after a successful subscribe to avoid leaving stray subscriptions.
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function runPushDiagnostics() {
  try {
    if (!('serviceWorker' in navigator)) {
      console.warn('[FCM][diag] Service Worker not supported in this environment');
      return;
    }

    const reg = swRegistration || (await navigator.serviceWorker.ready);
    console.log('[FCM][diag] Using SW registration:', reg && reg.scope);

    if (!reg) {
      console.warn('[FCM][diag] No service worker registration available');
      return;
    }

    try {
      const existing = await reg.pushManager.getSubscription();
      console.log('[FCM][diag] existing subscription:', existing);
    } catch (e) {
      console.warn('[FCM][diag] getSubscription failed:', e);
    }

    if (!messagingConfig.vapidKey) {
      console.warn('[FCM][diag] No VAPID key present in messagingConfig');
      return;
    }

    console.log('[FCM][diag] Attempting PushManager.subscribe using VAPID key (will auto-unsubscribe)');
    try {
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(messagingConfig.vapidKey)
      });
      console.log('[FCM][diag] subscribe() succeeded:', sub);
      try {
        await sub.unsubscribe();
        console.log('[FCM][diag] unsubscribed test subscription');
      } catch (unsubErr) {
        console.warn('[FCM][diag] unsubscribe failed:', unsubErr);
      }
      return sub;
    } catch (err) {
      console.error('[FCM][diag] subscribe() failed:', err);
      console.error('[FCM][diag] If this is an AbortError or push-service error, verify the VAPID key in the Firebase Console (Cloud Messaging -> Web Push certificates) matches messaging-config.js and that the page runs on HTTPS or localhost.');
      throw err;
    }
  } catch (err) {
    console.error('[FCM][diag] runPushDiagnostics failed:', err);
    throw err;
  }
}

// Expose the diagnostic helper on window for quick manual invocation in the console
try {
  if (typeof window !== 'undefined') {
    window.runPushDiagnostics = runPushDiagnostics;
  }
} catch (e) {
  // ignore non-browser contexts
}
