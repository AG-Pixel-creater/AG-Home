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

console.log("Firebase config loaded from .env:", firebaseConfig);
console.log("App config loaded from .env:", appConfig);
  
  // Import Firebase modules from npm package
  import { initializeApp } from "firebase/app";
  import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signInAnonymously,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOut 
  } from "firebase/auth";
  import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    getDocs 
  } from "firebase/firestore";
  import { getAnalytics } from "firebase/analytics";
  
  console.log("Firebase modules imported");
  
  // Initialize Firebase services
  let auth = null;
  let db = null;
  let googleProvider = null;
  let githubProvider = null;
  let facebookProvider = null;
  let yahooProvider = null;
  let recaptchaVerifier = null;
  
  // Initialize Firebase app
  try {
    console.log("Initializing Firebase app");
    const app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized:", app);
  
    auth = getAuth(app);
    db = getFirestore(app);
    
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
    githubProvider.addScope('user:email');
    
    // Facebook authentication provider
    facebookProvider = new FacebookAuthProvider();
    facebookProvider.addScope('email');
    
    // Yahoo authentication provider
    yahooProvider = new OAuthProvider('yahoo.com');
    yahooProvider.addScope('profile');
    yahooProvider.addScope('email');
    
    console.log("Firebase initialization complete");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
  
  // Export everything needed by other modules
  export { 
    auth, 
    db,
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    googleProvider,
    GithubAuthProvider,
    githubProvider,
    FacebookAuthProvider,
    facebookProvider,
    OAuthProvider,
    yahooProvider,
    signInAnonymously,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOut,
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs
  };