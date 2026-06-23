// Firebase Cloud Messaging configuration
export const messagingConfig = {
    messagingSenderId: "384219186370",
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerPath: import.meta.env.VITE_FIREBASE_SERVICE_WORKER_PATH,
    scope: "/",
    permissions: {
        userVisibleOnly: true
    }
};