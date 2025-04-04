// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfu4YI21vaAPeW6WbElRL56PHbxl6knb0",
    authDomain: "ag-home-3db3f.firebaseapp.com",
    projectId: "ag-home-3db3f",
    storageBucket: "ag-home-3db3f.firebasestorage.app",
    messagingSenderId: "384219186370",
    appId: "1:384219186370:web:b6b69a39d6cc5affa8e75b",
    measurementId: "G-5W214BQMNJ"
};
  
  console.log("Firebase config:", firebaseConfig);
  
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