// Import Firebase services
import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.js';

console.log("App.js loaded");

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Get DOM elements
const loginForm = document.getElementById('login');
const googleLoginBtn = document.getElementById('googleLogin');
const githubLoginBtn = document.getElementById('githubLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Get additional DOM elements
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');
const signupForm = document.getElementById('signup');

// Settings handlers
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const themeButtons = document.querySelectorAll('.theme-btn');

// Theme handling
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateActiveTheme(theme);
}

function updateActiveTheme(theme) {
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Settings event listeners
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    updateActiveTheme(document.body.getAttribute('data-theme'));
});

closeSettings.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        setTheme(theme);
    });
});

// Close modal when clicking outside
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.add('hidden');
    }
});

// Navigation between login and signup with transitions
function switchToSignup() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.add('slide-out-left');
    signupForm.classList.remove('hidden');
    
    // Small delay to trigger transition
    setTimeout(() => {
        signupForm.classList.remove('slide-out-right');
    }, 10);
    
    // Hide login form after animation
    setTimeout(() => {
        loginForm.classList.add('hidden');
    }, 500);
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    signupForm.classList.add('slide-out-right');
    loginForm.classList.remove('hidden');
    
    // Small delay to trigger transition
    setTimeout(() => {
        loginForm.classList.remove('slide-out-left');
    }, 10);
    
    // Hide signup form after animation
    setTimeout(() => {
        signupForm.classList.add('hidden');
    }, 500);
}

// Update event listeners
showSignupBtn.addEventListener('click', switchToSignup);
showLoginBtn.addEventListener('click', switchToLogin);

// Add redirect function
function redirectToHome() {
    window.location.href = '/home.html';
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        redirectToHome();
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
});

// Handle signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        redirectToHome();
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
});

// Handle Google login
googleLoginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        redirectToHome();
    } catch (error) {
        console.error('Google login error:', error);
        alert('Google login failed: ' + error.message);
    }
});

// Handle GitHub login
githubLoginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, githubProvider);
        redirectToHome();
    } catch (error) {
        console.error('GitHub login error:', error);
        alert('GitHub login failed: ' + error.message);
    }
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        // Show login form after logout
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('userDisplay').textContent = '';
        document.getElementById('logoutBtn').classList.add('hidden');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
});

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('userDisplay').textContent = user.email;
        document.getElementById('logoutBtn').classList.remove('hidden');
    } else {
        // User is signed out
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('userDisplay').textContent = '';
        document.getElementById('logoutBtn').classList.add('hidden');
    }
});