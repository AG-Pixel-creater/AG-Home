// Import Firebase services
import { auth } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signInAnonymously,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOut,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import {
    facebookProvider,
    yahooProvider
} from './firebase.js';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.js';
import { initTheme, setTheme, updateActiveTheme, updateActiveLanguage, setLanguage } from './theme.js';
import { initLocalization } from './localization.js';

console.log("App.js loaded");

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Global variable for phone confirmation
let confirmationResult = null;
let recaptchaVerifier = null;

// Get DOM elements
const loginForm = document.getElementById('login');
const googleLoginBtn = document.getElementById('googleLogin');
const githubLoginBtn = document.getElementById('githubLogin');
const facebookLoginBtn = document.getElementById('facebookLogin');
const yahooLoginBtn = document.getElementById('yahooLogin');
const phoneLoginBtn = document.getElementById('phoneLogin');
const guestLoginBtn = document.getElementById('guestLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Signup buttons
const googleSignupBtn = document.getElementById('googleSignup');
const githubSignupBtn = document.getElementById('githubSignup');
const facebookSignupBtn = document.getElementById('facebookSignup');
const yahooSignupBtn = document.getElementById('yahooSignup');
const phoneSignupBtn = document.getElementById('phoneSignup');
const guestSignupBtn = document.getElementById('guestSignup');

// Get additional DOM elements
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');
const signupForm = document.getElementById('signup');

// Phone login modal elements
const phoneLoginModal = document.getElementById('phoneLoginModal');
const closePhoneModal = document.getElementById('closePhoneModal');
const sendPhoneOTPBtn = document.getElementById('sendPhoneOTPBtn');
const verifyPhoneOTPBtn = document.getElementById('verifyPhoneOTPBtn');
const backToPhoneBtn = document.getElementById('backToPhoneBtn');
const phoneLoginStep1 = document.getElementById('phoneLoginStep1');
const phoneLoginStep2 = document.getElementById('phoneLoginStep2');
const phoneNumberInput = document.getElementById('phoneNumber');
const otpCodeInput = document.getElementById('otpCode');

// Settings handlers
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const themeButtons = document.querySelectorAll('.theme-btn');
const languageButtons = document.querySelectorAll('.language-btn');

// Initialize shared theme behavior
try { initTheme(); } catch (e) { console.warn('[app] initTheme failed', e); }
try { initLocalization(); } catch (e) { console.warn('[app] initLocalization failed', e); }

// Settings event listeners
if (settingsBtn) settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    try { updateActiveTheme(document.body.getAttribute('data-theme')); } catch (e) { console.warn(e); }
    try { 
        const currentLang = localStorage.getItem('language') || 'en';
        updateActiveLanguage(currentLang); 
    } catch (e) { console.warn(e); }
});

if (closeSettings) closeSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

if (themeButtons && themeButtons.forEach) {
    themeButtons.forEach(btn => btn.addEventListener('click', () => {
        try { setTheme(btn.getAttribute('data-theme')); } catch (e) { console.warn(e); }
    }));
}

// Language button listeners
if (languageButtons && languageButtons.forEach) {
    languageButtons.forEach(btn => btn.addEventListener('click', () => {
        try { 
            const lang = btn.getAttribute('data-language');
            setLanguage(lang);
            updateActiveLanguage(lang);
        } catch (e) { console.warn(e); }
    }));
}

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
        // Show loader on next page load once (zero-delay)
        try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
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
        try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
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
        try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
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
        try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
        redirectToHome();
    } catch (error) {
        console.error('GitHub login error:', error);
        alert('GitHub login failed: ' + error.message);
    }
});

// Handle Facebook login
if (facebookLoginBtn) {
    facebookLoginBtn.addEventListener('click', async () => {
        try {
            const facebookAuth = new FacebookAuthProvider();
            facebookAuth.addScope('email');
            facebookAuth.setCustomParameters({ 'display': 'popup' });
            await signInWithPopup(auth, facebookAuth);
            try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
            redirectToHome();
        } catch (error) {
            console.error('Facebook login error:', error);
            alert('Facebook login failed: ' + error.message);
        }
    });
}

// Handle Yahoo login
if (yahooLoginBtn) {
    yahooLoginBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, yahooProvider);
            try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
            redirectToHome();
        } catch (error) {
            console.error('Yahoo login error:', error);
            alert('Yahoo login failed: ' + error.message);
        }
    });
}

// Handle Phone login
if (phoneLoginBtn) {
    phoneLoginBtn.addEventListener('click', () => {
        phoneLoginModal.classList.remove('hidden');
        initRecaptcha();
    });
}

// Handle Guest login
if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', async () => {
        try {
            await signInAnonymously(auth);
            try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
            redirectToHome();
        } catch (error) {
            console.error('Guest login error:', error);
            alert('Guest login failed: ' + error.message);
        }
    });
}

// Signup with new providers
if (facebookSignupBtn) {
    facebookSignupBtn.addEventListener('click', async () => {
        try {
            const facebookAuth = new FacebookAuthProvider();
            facebookAuth.addScope('email');
            facebookAuth.setCustomParameters({ 'display': 'popup' });
            await signInWithPopup(auth, facebookAuth);
            try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
            redirectToHome();
        } catch (error) {
            console.error('Facebook signup error:', error);
            alert('Facebook signup failed: ' + error.message);
        }
    });
}

if (yahooSignupBtn) {
    yahooSignupBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, yahooProvider);
            try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
            redirectToHome();
        } catch (error) {
            console.error('Yahoo signup error:', error);
            alert('Yahoo signup failed: ' + error.message);
        }
    });
}

if (phoneSignupBtn) {
    phoneSignupBtn.addEventListener('click', () => {
        phoneLoginModal.classList.remove('hidden');
        initRecaptcha();
    });
}

if (guestSignupBtn) {
    guestSignupBtn.addEventListener('click', async () => {
        try {
            await signInAnonymously(auth);
            try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
            redirectToHome();
        } catch (error) {
            console.error('Guest signup error:', error);
            alert('Guest signup failed: ' + error.message);
        }
    });
}

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
        document.getElementById('userDisplay').textContent = user.email || user.uid;
        document.getElementById('logoutBtn').classList.remove('hidden');
    } else {
        // User is signed out
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('userDisplay').textContent = '';
        document.getElementById('logoutBtn').classList.add('hidden');
    }
});

// Phone login modal handlers
if (closePhoneModal) {
    closePhoneModal.addEventListener('click', () => {
        phoneLoginModal.classList.add('hidden');
        resetPhoneLoginModal();
    });
}

if (phoneLoginModal) {
    phoneLoginModal.addEventListener('click', (e) => {
        if (e.target === phoneLoginModal) {
            phoneLoginModal.classList.add('hidden');
            resetPhoneLoginModal();
        }
    });
}

// Initialize reCAPTCHA
function initRecaptcha() {
    if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'normal',
            'callback': (token) => {
                console.log('reCAPTCHA verified');
            },
            'expired-callback': () => {
                console.log('reCAPTCHA expired');
            }
        });
    }
}

// Send OTP
if (sendPhoneOTPBtn) {
    sendPhoneOTPBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const phoneNumber = phoneNumberInput.value.trim();

        if (!phoneNumber) {
            alert('Please enter a phone number');
            return;
        }

        try {
            sendPhoneOTPBtn.disabled = true;
            sendPhoneOTPBtn.textContent = 'Sending...';

            // Ensure reCAPTCHA is initialized
            if (!recaptchaVerifier) {
                initRecaptcha();
            }

            confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                recaptchaVerifier
            );

            // Show OTP input step
            phoneLoginStep1.classList.add('hidden');
            phoneLoginStep2.classList.remove('hidden');

            alert('OTP sent to ' + phoneNumber);
        } catch (error) {
            console.error('Error sending OTP:', error);
            if (error.code === 'auth/invalid-phone-number') {
                alert('Invalid phone number. Please include country code (e.g., +1)');
            } else if (error.code === 'auth/too-many-requests') {
                alert('Too many requests. Please try again later.');
            } else {
                alert('Error sending OTP: ' + error.message);
            }
            // Reset reCAPTCHA on error
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
                recaptchaVerifier = null;
            }
        } finally {
            sendPhoneOTPBtn.disabled = false;
            sendPhoneOTPBtn.textContent = 'Send OTP';
        }
    });
}

// Verify OTP
if (verifyPhoneOTPBtn) {
    verifyPhoneOTPBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const otpCode = otpCodeInput.value.trim();

        if (!otpCode || otpCode.length !== 6) {
            alert('Please enter a valid 6-digit code');
            return;
        }

        if (!confirmationResult) {
            alert('OTP not sent. Please try again.');
            return;
        }

        try {
            verifyPhoneOTPBtn.disabled = true;
            verifyPhoneOTPBtn.textContent = 'Verifying...';

            await confirmationResult.confirm(otpCode);

            // Close modal and redirect
            phoneLoginModal.classList.add('hidden');
            resetPhoneLoginModal();
            try { sessionStorage.setItem('showLoader', '1'); } catch (e) { /* ignore */ }
            redirectToHome();
        } catch (error) {
            console.error('Error verifying OTP:', error);
            if (error.code === 'auth/invalid-verification-code') {
                alert('Invalid verification code. Please try again.');
                otpCodeInput.value = '';
            } else {
                alert('Verification failed: ' + error.message);
            }
        } finally {
            verifyPhoneOTPBtn.disabled = false;
            verifyPhoneOTPBtn.textContent = 'Verify & Login';
        }
    });
}

// Back to phone input
if (backToPhoneBtn) {
    backToPhoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetPhoneLoginModal();
    });
}

// Reset phone login modal
function resetPhoneLoginModal() {
    phoneLoginStep1.classList.remove('hidden');
    phoneLoginStep2.classList.add('hidden');
    phoneNumberInput.value = '';
    otpCodeInput.value = '';
    confirmationResult = null;
}