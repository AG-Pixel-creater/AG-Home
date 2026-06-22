// Firebase Cloud Messaging configuration
export const messagingConfig = {
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerPath: import.meta.env.VITE_FIREBASE_SERVICE_WORKER_PATH,
    scope: "/",
    permissions: {
        userVisibleOnly: true
    }
};