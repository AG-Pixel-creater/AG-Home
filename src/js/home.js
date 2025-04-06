import { auth } from './firebase-config.js';
import { signOut } from 'firebase/auth';

// Auth state management
auth.onAuthStateChanged((user) => {
    if (!user) window.location.href = '/index.html';
    
    // Show admin link if admin user
    if (user.email === 'ag.aliengamerz@gmail.com') {
        // Add admin link to navigation
        const nav = document.querySelector('nav ul');
        const adminLi = document.createElement('li');
        adminLi.innerHTML = '<a href="admin.html">Admin Panel</a>';
        nav.appendChild(adminLi);
    }
    
    document.getElementById('userDisplay').textContent = user.email;
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
});

// DOM elements
const settingsModal = document.getElementById('settingsModal');
const themeButtons = document.querySelectorAll('.theme-btn');

// Theme management
const setTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeButtons.forEach(btn => 
        btn.classList.toggle('active', btn.dataset.theme === theme)
    );
    updateFogColor(theme);
    
    // Update header transition
    const header = document.querySelector('header');
    if (header) {
        header.style.transition = 'all 0.3s ease';
    }

    // Update dynamic text color transition
    const dynamicText = document.getElementById('dynamicText');
    if (dynamicText) {
        dynamicText.style.transition = 'color 0.3s ease';
    }
};

const updateFogColor = (theme) => {
    const fogElements = document.querySelectorAll('.fog');
    fogElements.forEach(fog => {
        fog.style.background = `linear-gradient(90deg, 
            rgba(0, 255, 255, 0) 0%,
            var(--fog-color) 50%,
            rgba(0, 255, 255, 0) 100%)`;
    });
};

// Event listeners
document.getElementById('settingsBtn').addEventListener('click', () => {
    const loader = document.querySelector('.loader-container');
    // Only show settings if loader is not present
    if (!loader) {
        settingsModal.classList.remove('hidden');
        updateActiveTheme(document.body.dataset.theme);
    }
});

document.getElementById('closeSettings').addEventListener('click', () => 
    settingsModal.classList.add('hidden')
);

themeButtons.forEach(btn => btn.addEventListener('click', () => 
    setTheme(btn.dataset.theme)
));

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
});

// Initialize theme
setTheme(localStorage.getItem('theme') || 'dark');

// Enhanced fog animation system
const createFogEffect = () => {
    const fogContainer = document.querySelector('.fog-effect');
    const fogLayers = 5;
    
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
    
    // Initially hide background content
    backgroundContent.classList.add('hidden');
    settingsBtn.style.display = 'none';
    
    setTimeout(() => {
        // Hide loader with animation
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        // Show background content
        backgroundContent.classList.remove('hidden');
        settingsBtn.style.display = 'flex';
        
        // Remove loader from DOM after animation
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 10000);
    
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
