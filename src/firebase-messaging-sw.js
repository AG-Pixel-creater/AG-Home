importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

console.log('[firebase-messaging-sw.js] Initializing...');

try {
    const firebaseApp = firebase.initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });

    const messaging = firebase.messaging(firebaseApp);

    self.addEventListener('install', (event) => {
        console.log('[firebase-messaging-sw.js] Service Worker installed');
        self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
        console.log('[firebase-messaging-sw.js] Service Worker activated');
        event.waitUntil(clients.claim());
    });

    // Handle messages from the main thread
    self.addEventListener('message', (event) => {
        console.log('[Service Worker] Received message:', event.data);

        // Handle CLIENTS_CLAIM message from fcm-manager.js
        if (event.data && event.data.type === 'CLIENTS_CLAIM') {
            event.waitUntil(clients.claim());
        }
    });

    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message:', payload);

        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions = {
            body: payload.notification?.body || '',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            data: payload.data || {},
            requireInteraction: true,
            tag: 'ag-notification'
        };

        return self.registration.showNotification(notificationTitle, notificationOptions);
    });

    self.addEventListener('notificationclick', (event) => {
        console.log('[firebase-messaging-sw.js] Notification clicked');
        event.notification.close();

        const clickedNotification = event.notification;
        const notificationData = clickedNotification.data || {};

        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    if (clientList.length > 0) {
                        return clientList[0].focus();
                    }
                    return clients.openWindow('/');
                })
        );
    });

    console.log('[firebase-messaging-sw.js] Initialized successfully');
} catch (error) {
    console.error('[firebase-messaging-sw.js] Initialization failed:', error);
    console.error('Error details:', error.message);
}