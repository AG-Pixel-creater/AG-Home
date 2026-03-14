// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
    apiKey: "AIzaSyC5TUcYhFPGDWdXBOd0mVFw-TuOjOqh_Jk",
    authDomain: "aliengamerz-gaming-hub.firebaseapp.com",
    projectId: "aliengamerz-gaming-hub",
    storageBucket: "aliengamerz-gaming-hub.appspot.com",
    messagingSenderId: "1047852789242",
    appId: "1:1047852789242:web:81acd34dec9eb53add1752",
    measurementId: "G-JD6L49DBT3"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'ag-notification',
        data: payload.data,
        requireInteraction: true,
        click_action: payload.notification?.click_action || '/'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event);
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // Check if there's already a window/tab open with the target URL
                const hadWindowToFocus = windowClients.some((client) => {
                    if (client.url === (event.notification.data?.click_action || '/')) {
                        client.focus();
                        return true;
                    }
                    return false;
                });

                // Open new window if no existing window/tab found
                if (!hadWindowToFocus) {
                    return clients.openWindow(event.notification.data?.click_action || '/');
                }
            })
    );
});

// Listen for 'push' events
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received:', event);

    if (event.data) {
        try {
            const payload = event.data.json();
            console.log('[Service Worker] Push data:', payload);

            const notificationTitle = payload.notification?.title || 'New Notification';
            const notificationOptions = {
                body: payload.notification?.body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'ag-notification',
                data: payload.data,
                requireInteraction: true,
                click_action: payload.notification?.click_action || '/'
            };

            event.waitUntil(
                self.registration.showNotification(notificationTitle, notificationOptions)
            );
        } catch (error) {
            console.error('[Service Worker] Error handling push:', error);
        }
    }
});

// Listen for 'install' event
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        Promise.all([
            self.skipWaiting(),
            (async () => {
                try {
                    console.log('[Service Worker] Installation complete');
                } catch (err) {
                    console.error('[Service Worker] Installation error:', err);
                }
            })()
        ])
    );
});

// Listen for 'activate' event
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        Promise.all([
            clients.claim(),
            (async () => {
                try {
                    const subscription = await self.registration.pushManager.getSubscription();
                    console.log('[Service Worker] Push subscription status:', !!subscription);
                    if (!subscription) {
                        console.warn('[Service Worker] No push subscription found');
                    }
                } catch (err) {
                    console.error('[Service Worker] Error checking push subscription:', err);
                }
            })(),
            (async () => {
                try {
                    const allClients = await clients.matchAll();
                    console.log('[Service Worker] Claimed', allClients.length, 'clients');
                } catch (err) {
                    console.error('[Service Worker] Error while claiming clients:', err);
                }
            })()
        ])
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Received message:', event.data);
    
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data?.type === 'CLIENTS_CLAIM') {
        clients.claim();
    }
});