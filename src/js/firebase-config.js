import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyBfu4YI21vaAPeW6WbElRL56PHbxl6knb0",
    authDomain: "ag-home-3db3f.firebaseapp.com",
    projectId: "ag-home-3db3f",
    storageBucket: "ag-home-3db3f.firebasestorage.app",
    messagingSenderId: "384219186370",
    appId: "1:384219186370:web:b6b69a39d6cc5affa8e75b",
    measurementId: "G-5W214BQMNJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const functions = getFunctions(app);