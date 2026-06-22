import { auth } from './firebase-config.js';
import { signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import roleManager, { OWNER_EMAILS } from './role-manager.js';
import { initTheme, setTheme, updateActiveTheme, setViewMode, updateActiveViewMode, setLanguage, updateActiveLanguage } from './theme.js';
import { initLocalization } from './localization.js';
// Note: DOM-dependent auth UI wiring is attached inside DOMContentLoaded to avoid
// errors on pages that don't include the expected elements.

// DOM elements (queried inside DOMContentLoaded where available)

// Theme management is handled by src/js/theme.js

// Initialize theme and attach DOM event listeners after DOM is ready

// Enhanced fog animation system
const createFogEffect = () => {
    const fogContainer = document.querySelector('.fog-effect');
    const fogLayers = 5;
    if (!fogContainer) return;

    for (let i = 0; i < fogLayers; i++) {
        const fog = document.createElement('div');
        fog.className = `fog fog-layer-${i % 2 ? 'left' : 'right'}`;
        fog.style.animationDuration = `${Math.random() * 2 + 3}s`;
        fog.style.opacity = Math.random() * 0.3 + 0.2;
        fogContainer.appendChild(fog);
    }
};

// Optimized smoke effect
const createSmokeEffect = () => {
    const smokeContainer = document.querySelector('.smoke-container');
    const particleCount = window.innerWidth < 768 ? 5 : 8;
    if (!smokeContainer) return;

    for (let i = 0; i < particleCount; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        smoke.style.cssText = `
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
            transform: scale(${Math.random() * 0.5 + 0.5});
        `;
        smokeContainer.appendChild(smoke);
    }

    smokeContainer.addEventListener('animationend', () => {
        smokeContainer.remove();
    }, { once: true });
};

function createCurvedSmoke(type) {
    const smoke = document.createElement('div');
    smoke.className = `curved-smoke smoke-${type}`;

    // Random starting position from bottom
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight;

    // Get loader position
    const loader = document.querySelector('.logo-loader');
    if (!loader) return;
    const loaderRect = loader.getBoundingClientRect();
    const targetX = loaderRect.left + loaderRect.width / 2;
    const targetY = loaderRect.top + loaderRect.height / 2;

    // Calculate path
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    // Set position and animation
    smoke.style.cssText = `
        left: ${startX}px;
        top: ${startY}px;
        --smoke-x: ${deltaX}px;
        --smoke-y: ${deltaY}px;
        animation: curvedSmoke ${2 + Math.random()}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `;

    document.body.appendChild(smoke);

    // Remove smoke element after animation
    smoke.addEventListener('animationend', () => smoke.remove());
}

function generateSmoke() {
    if (!document.querySelector('.loader-container')) return;

    // Create both types of smoke
    createCurvedSmoke('cyan');
    createCurvedSmoke('dark');

    // Continue generating smoke
    setTimeout(generateSmoke, 200);
}

function createTargetingSmoke() {
    const loader = document.querySelector('.logo-loader');
    if (!loader) return;

    const loaderRect = loader.getBoundingClientRect();
    const targetX = loaderRect.left + loaderRect.width / 2;
    const targetY = loaderRect.top + loaderRect.height / 2;

    // Create two smoke particles
    const createSmoke = (isDark) => {
        const smoke = document.createElement('div');
        smoke.className = `targeting-smoke ${isDark ? 'dark' : ''}`;

        // Random start position
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 300 + 200;
        const startX = targetX + Math.cos(angle) * distance;
        const startY = targetY + Math.sin(angle) * distance;

        smoke.style.cssText = `
            --startX: ${startX}px;
            --startY: ${startY}px;
            --endX: ${targetX}px;
            --endY: ${targetY}px;
            left: 0;
            top: 0;
            animation: targetLogo 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        `;

        document.body.appendChild(smoke);
        smoke.addEventListener('animationend', () => smoke.remove());
    };

    createSmoke(false); // Cyan smoke
    setTimeout(() => createSmoke(true), 200); // Dark smoke
}

function createFireParticle(isLeft) {
    const fire = document.createElement('div');
    fire.className = `fire-particle ${isLeft ? 'fire-cyan' : 'fire-dark'}`;

    const loader = document.querySelector('.logo-loader');
    if (!loader) return;

    const loaderRect = loader.getBoundingClientRect();
    const targetX = loaderRect.left + loaderRect.width / 2;
    const targetY = loaderRect.top + loaderRect.height / 2;

    // Start position based on side
    const startX = isLeft ? -50 : window.innerWidth + 50;
    const startY = window.innerHeight - Math.random() * 200;

    // Random rotation
    const rotate = (Math.random() * 360) * (isLeft ? 1 : -1);

    fire.style.cssText = `
        --startX: ${startX}px;
        --startY: ${startY}px;
        --endX: ${targetX}px;
        --endY: ${targetY}px;
        --rotate: ${rotate}deg;
        left: 0;
        top: 0;
        animation: fireRise ${1.5 + Math.random()}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `;

    document.body.appendChild(fire);
    fire.addEventListener('animationend', () => fire.remove());
}

function generateFire() {
    if (!document.querySelector('.loader-container')) return;

    createFireParticle(true);  // Cyan fire from left
    createFireParticle(false); // Dark fire from right

    setTimeout(generateFire, 100);
}

// Updated initialization sequence
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader-container');
    const backgroundContent = document.querySelector('.background-content');
    const settingsBtn = document.getElementById('settingsBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userDisplay = document.getElementById('userDisplay');

    // Auth state management (attach after DOM ready so UI elements exist)
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            try { window.location.href = '/'; } catch (e) { /* ignore */ }
            return;
        }

        // Show Control Panel link for any non-USER staff (owner/admin/moderator/etc.)
        try {
            const db = getFirestore();
            const email = String(user.email || '').toLowerCase();

            let allowed = false;

            // Owner emails always allowed
            if (OWNER_EMAILS.includes(email)) allowed = true;

            // Check admins collection
            if (!allowed) {
                try {
                    const adminDoc = await getDoc(doc(db, 'admins', email));
                    if (adminDoc.exists()) allowed = true;
                } catch (e) {
                    console.warn('Could not check admins collection:', e);
                }
            }

            // Check moderators collection by email id
            if (!allowed) {
                try {
                    const modDoc = await getDoc(doc(db, 'moderators', email));
                    if (modDoc.exists()) allowed = true;
                } catch (e) {
                    console.warn('Could not check moderators collection:', e);
                }
            }

            // Check users document rank/role
            if (!allowed) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data() || {};
                        const rank = (data.rank || data.role || '').toString();
                        if (rank && rank.toUpperCase() !== 'USER') allowed = true;
                    }
                } catch (e) {
                    console.warn('Could not check users collection:', e);
                }
            }

            if (allowed) {
                const nav = document.querySelector('nav ul');
                if (nav) {
                    const existing = nav.querySelector('a[href="control.html"]');
                    if (!existing) {
                        const adminLi = document.createElement('li');
                        adminLi.innerHTML = '<a href="control.html">Control Panel</a>';
                        nav.appendChild(adminLi);
                    }
                }
            }
        } catch (err) {
            console.warn('Error while deciding to show Control Panel link:', err);
        }

        if (userDisplay) userDisplay.textContent = user.email || '';
    });

    // Logout handler (only if element exists)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = '/';
            } catch (error) {
                console.error('Logout error:', error);
                alert('Logout failed: ' + (error.message || error));
            }
        });
    }
    // Query settings modal and theme buttons now that DOM is ready
    const settingsModal = document.getElementById('settingsModal');
    const themeButtons = document.querySelectorAll('.theme-btn');

    // Settings button
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            const loaderEl = document.querySelector('.loader-container');
            // Only show settings if loader is not present
            if (!loaderEl && settingsModal) {
                settingsModal.classList.remove('hidden');
                if (typeof updateActiveTheme === 'function') updateActiveTheme(document.body.dataset.theme);
            }
        });
    }

    // Close settings
    const closeSettings = document.getElementById('closeSettings');
    if (closeSettings && settingsModal) {
        closeSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    }

    // Theme button handlers
    if (themeButtons && themeButtons.length) {
        themeButtons.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
    }

    // View mode button handlers
    const viewModeButtons = document.querySelectorAll('.view-mode-btn');
    if (viewModeButtons && viewModeButtons.length) {
        viewModeButtons.forEach(btn => btn.addEventListener('click', () => setViewMode(btn.dataset.view)));
    }

    // Language button handlers
    const languageButtons = document.querySelectorAll('.language-btn');
    if (languageButtons && languageButtons.length) {
        languageButtons.forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.language)));
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) settingsModal.classList.add('hidden');
        });
    }

    // Initialize theme after DOM ready
    try { initTheme(); } catch (e) { console.warn('[home] initTheme failed', e); }

    // Initialize localization after DOM ready
    try { initLocalization(); } catch (e) { console.warn('[home] initLocalization failed', e); }

    // Initially hide background content; settings hidden until loader handled
    if (backgroundContent) backgroundContent.classList.add('hidden');
    if (settingsBtn) settingsBtn.style.display = 'none';

    // Show the loader only once immediately after a successful login.
    // We use sessionStorage.showLoader = '1' (set by the login flow) to indicate this.
    const showLoaderOnce = (() => {
        try { return sessionStorage.getItem('showLoader') === '1'; } catch (e) { return false; }
    })();

    const finalizeLoad = () => {
        // Hide loader with animation if present
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            // Remove loader from DOM after animation
            setTimeout(() => {
                if (loader && loader.parentNode) loader.remove();
            }, 500); // near-zero delay
        }

        // Reveal background and settings
        if (backgroundContent) backgroundContent.classList.remove('hidden');
        if (settingsBtn) settingsBtn.style.display = 'flex';
    };

    if (showLoaderOnce) {
        // Clear the flag so loader only shows once
        try { sessionStorage.removeItem('showLoader'); } catch (e) { /* ignore */ }
        // Immediately finalize load with near-zero delay
        setTimeout(finalizeLoad, 0);
    } else {
        // No loader requested: finalize immediately (no visual loader)
        finalizeLoad();
    }

    // Start both smoke and fire effects
    generateSmoke();
    generateFire();

    // Generate targeting smoke every 500ms
    const smokeInterval = setInterval(() => {
        if (!document.querySelector('.loader-container')) {
            clearInterval(smokeInterval);
            return;
        }
        createTargetingSmoke();
    }, 500);
});

// Text animation for dynamic text
const textPhrases = ["Tech Reveal's Here", "Software", "Search Engines", "AI (Artificial Intelligence)", "Future", "Innovative Algorithms", "Machine Learning", "Smart Solutions", "Digital Transformation", "Technology Evolution", "Big Data", "Robotic Process Automation", "Blockchain", "Cybersecurity", "Augmented Reality (AR)", "Virtual Reality (VR)", "Internet of Things (IoT)"];
let currentPhraseIndex = 0;
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
const dynamicText = document.getElementById("dynamicText");

function type() {
    if (!dynamicText) return; // Guard clause

    const currentPhrase = textPhrases[currentPhraseIndex];
    dynamicText.textContent = currentPhrase.slice(0, dynamicText.textContent.length + 1);

    if (dynamicText.textContent.length === currentPhrase.length) {
        setTimeout(erase, newTextDelay);
    } else {
        setTimeout(type, typingDelay);
    }
}

function erase() {
    if (!dynamicText) return; // Guard clause

    dynamicText.textContent = dynamicText.textContent.slice(0, -1);

    if (dynamicText.textContent.length === 0) {
        currentPhraseIndex = (currentPhraseIndex + 1) % textPhrases.length;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, erasingDelay);
    }
}

// Start the typing effect after a delay
if (dynamicText) {
    setTimeout(type, 20000); // Start after 2 seconds
}
