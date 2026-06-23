import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - Load from .env file
const firebaseConfig = {
    apiKey: "AIzaSyBfu4YI21vaAPeW6WbElRL56PHbxl6knb0",
    authDomain: "ag-home-3db3f.firebaseapp.com",
    projectId: "ag-home-3db3f",
    storageBucket: "ag-home-3db3f.firebasestorage.app",
    messagingSenderId: "384219186370",
    appId: "1:384219186370:web:b6b69a39d6cc5affa8e75b",
    measurementId: "G-5W214BQMNJ" 
};

// App configuration - Load from .env file
export const appConfig = {
    adminEmail: import.meta.env.VITE_ADMIN_EMAIL,
    environment: import.meta.env.VITE_ENVIRONMENT,
    functionsRegion: import.meta.env.VITE_FUNCTIONS_REGION || 'us-central1',
    functionsEmulatorHost: import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST,
    functionsEmulatorPort: import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT
};

// Log which source the config came from
console.log('[firebase-config] Using Firebase configuration from:', 
    import.meta.env.VITE_FIREBASE_API_KEY ? 'environment variables (.env)' : 'fallback/hardcoded values'
);

console.log('[firebase-config] App configuration loaded from .env:', appConfig);

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('[firebase-config] Invalid Firebase configuration - missing required fields');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
// Use the region from environment variables
export const functions = getFunctions(app, import.meta.env.VITE_FUNCTIONS_REGION || 'us-central1');

// If running on localhost, connect the Functions emulator to avoid CORS and deployed function issues.
try {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        const emulatorHost = import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST || 'localhost';
        const emulatorPort = parseInt(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT || '5001');
        connectFunctionsEmulator(functions, emulatorHost, emulatorPort);
        console.log(`[firebase-config] Connected Functions emulator at http://${emulatorHost}:${emulatorPort}`);
    }
} catch (e) {
    console.warn('[firebase-config] Could not connect functions emulator:', e);
}
// Export the raw config for diagnostics (safe read-only use)
export { firebaseConfig };