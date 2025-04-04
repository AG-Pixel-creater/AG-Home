import { 
    auth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    googleProvider,
    githubProvider,
    signOut,
    db,
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs
} from './firebase.js';

// We'll import security functions only after login
let securityModule = null;

// Global variables
let masterPassword = '';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    
    // Setup auth state listener
    onAuthStateChanged(auth, user => {
        console.log("Auth state changed:", user ? "logged in" : "logged out");
        if (user) {
            // User is signed in
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('app-container').style.display = 'block';
            
            // Import security module only after login
            import('./security.js').then(module => {
                securityModule = module;
                loadPasswords();
            }).catch(error => {
                console.error("Failed to load security module:", error);
                alert("Error loading security features: " + error.message);
            });
        } else {
            // User is signed out
            document.getElementById('login-container').style.display = 'block';
            document.getElementById('app-container').style.display = 'none';
        }
    });

    // Auth event listeners
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    const signupForm = document.getElementById('signup-form');
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    
    const googleSignin = document.getElementById('google-signin');
    if (googleSignin) googleSignin.addEventListener('click', handleGoogleSignIn);
    
    const githubSignin = document.getElementById('github-signin');
    if (githubSignin) githubSignin.addEventListener('click', handleGithubSignIn);
    
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    
    // Password management event listeners (will only work after login)
    const addPasswordForm = document.getElementById('add-password-form');
    if (addPasswordForm) addPasswordForm.addEventListener('submit', handleAddPassword);
    
    const generatePasswordBtn = document.getElementById('generate-password');
    if (generatePasswordBtn) generatePasswordBtn.addEventListener('click', generatePassword);
    
    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.addEventListener('input', checkPasswordStrength);
});

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    console.log("Login attempt");
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        console.log("Attempting to sign in with email/password");
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign in successful");
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    console.log("Signup attempt");
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
        console.log("Attempting to create user with email/password");
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Sign up successful");
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
}

async function handleGoogleSignIn() {
    console.log("Google sign-in attempt");
    
    try {
        console.log("Opening Google sign-in popup");
        await signInWithPopup(auth, googleProvider);
        console.log("Google sign-in successful");
    } catch (error) {
        console.error('Google sign-in error:', error);
        alert('Google sign-in failed: ' + error.message);
    }
}

async function handleGithubSignIn() {
    console.log("GitHub sign-in attempt");
    
    try {
        console.log("Opening GitHub sign-in popup");
        await signInWithPopup(auth, githubProvider);
        console.log("GitHub sign-in successful");
    } catch (error) {
        console.error('GitHub sign-in error:', error);
        alert('GitHub sign-in failed: ' + error.message);
    }
}

function handleLogout() {
    console.log("Logout attempt");
    
    if (securityModule) {
        securityModule.clearEncryptionKey();
    }
    masterPassword = '';
    
    console.log("Signing out");
    signOut(auth).then(() => {
        console.log("Sign out successful");
    }).catch(error => {
        console.error("Sign out error:", error);
    });
}

// Password management functions
async function handleAddPassword(e) {
    e.preventDefault();
    
    if (!securityModule) {
        alert("Security module not loaded. Please refresh the page.");
        return;
    }
    
    const website = document.getElementById('website').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    await savePassword(website, username, password);
}

async function savePassword(website, username, password) {
    try {
        if (!securityModule) {
            alert("Security module not loaded. Please refresh the page.");
            return;
        }
        
        if (!masterPassword) {
            masterPassword = prompt('Please enter your master password:');
            if (!masterPassword) return;
        }

        // Validate password strength
        const strength = securityModule.validatePasswordStrength(password);
        if (!strength.isValid) {
            alert('Password does not meet security requirements:\n' +
                  Object.entries(strength.requirements)
                    .filter(([key, met]) => !met)
                    .map(([key]) => `- ${key}`)
                    .join('\n'));
            return;
        }

        const encryptedPassword = await securityModule.encryptData(password, masterPassword);
        const passwordData = {
            website,
            username,
            encryptedPassword,
            createdAt: new Date().toISOString()
        };

        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        const passwordsRef = collection(db, 'users', user.uid, 'passwords');
        await setDoc(doc(passwordsRef), passwordData);

        alert('Password saved successfully!');
        loadPasswords();
        
        // Clear the form
        document.getElementById('website').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } catch (error) {
        console.error('Error saving password:', error);
        alert('Failed to save password: ' + error.message);
    }
}

async function loadPasswords() {
    try {
        if (!securityModule) {
            console.log("Security module not loaded yet. Skipping password load.");
            return;
        }
        
        const user = auth.currentUser;
        if (!user) return;

        if (!masterPassword) {
            masterPassword = prompt('Please enter your master password:');
            if (!masterPassword) return;
        }

        const passwordsRef = collection(db, 'users', user.uid, 'passwords');
        const querySnapshot = await getDocs(passwordsRef);
        
        const passwordsList = document.getElementById('passwords-list');
        if (!passwordsList) {
            console.error("Passwords list element not found");
            return;
        }
        
        passwordsList.innerHTML = '';

        if (querySnapshot.empty) {
            passwordsList.innerHTML = '<p>No passwords saved yet.</p>';
            return;
        }

        for (const docSnapshot of querySnapshot.docs) {
            const data = docSnapshot.data();
            try {
                const decryptedPassword = await securityModule.decryptData(data.encryptedPassword, masterPassword);
                
                const passwordItem = document.createElement('div');
                passwordItem.className = 'password-item';
                passwordItem.innerHTML = `
                    <div class="password-info">
                        <strong>${data.website}</strong>
                        <p>Username: ${data.username}</p>
                        <p>Password: <span class="password-hidden">••••••••</span></p>
                    </div>
                    <div class="password-actions">
                        <button class="show-password-btn">Show</button>
                        <button class="copy-password-btn">Copy</button>
                        <button class="delete-password-btn" data-id="${docSnapshot.id}">Delete</button>
                    </div>
                `;
                
                // Add event listeners
                passwordItem.querySelector('.show-password-btn').addEventListener('click', function() {
                    const passwordSpan = passwordItem.querySelector('.password-hidden');
                    if (passwordSpan.classList.contains('password-hidden')) {
                        passwordSpan.textContent = decryptedPassword;
                        passwordSpan.classList.remove('password-hidden');
                        this.textContent = 'Hide';
                    } else {
                        passwordSpan.textContent = '••••••••';
                        passwordSpan.classList.add('password-hidden');
                        this.textContent = 'Show';
                    }
                });
                
                passwordItem.querySelector('.copy-password-btn').addEventListener('click', function() {
                    navigator.clipboard.writeText(decryptedPassword);
                    alert('Password copied to clipboard!');
                });
                
                passwordItem.querySelector('.delete-password-btn').addEventListener('click', function() {
                    deletePassword(this.dataset.id);
                });
                
                passwordsList.appendChild(passwordItem);
            } catch (decryptError) {
                console.error('Error decrypting password:', decryptError);
                const passwordItem = document.createElement('div');
                passwordItem.className = 'password-item error';
                passwordItem.innerHTML = `
                    <div class="password-info">
                        <strong>${data.website}</strong>
                        <p>Username: ${data.username}</p>
                        <p class="error-message">Error decrypting password</p>
                    </div>
                    <div class="password-actions">
                        <button class="delete-password-btn" data-id="${docSnapshot.id}">Delete</button>
                    </div>
                `;
                
                passwordItem.querySelector('.delete-password-btn').addEventListener('click', function() {
                    deletePassword(this.dataset.id);
                });
                
                passwordsList.appendChild(passwordItem);
            }
        }
    } catch (error) {
        console.error('Error loading passwords:', error);
        alert('Failed to load passwords: ' + error.message);
    }
}

async function deletePassword(passwordId) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        if (confirm('Are you sure you want to delete this password?')) {
            const passwordRef = doc(db, 'users', user.uid, 'passwords', passwordId);
            await deleteDoc(passwordRef);
            alert('Password deleted successfully!');
            loadPasswords();
        }
    } catch (error) {
        console.error('Error deleting password:', error);
        alert('Failed to delete password: ' + error.message);
    }
}

function generatePassword() {
    if (!securityModule) {
        alert("Security module not loaded. Please refresh the page.");
        return;
    }
    
    const password = securityModule.generateSecurePassword();
    document.getElementById('password').value = password;
    checkPasswordStrength();
}

function checkPasswordStrength() {
    if (!securityModule) return;
    
    const password = document.getElementById('password').value;
    const strength = securityModule.validatePasswordStrength(password);
    
    const strengthIndicator = document.getElementById('password-strength');
    if (!strengthIndicator) return;
    
    strengthIndicator.innerHTML = '';
    
    const requirements = [
        { name: 'minLength', label: '8+ chars' },
        { name: 'hasUpperCase', label: 'Uppercase' },
        { name: 'hasLowerCase', label: 'Lowercase' },
        { name: 'hasNumbers', label: 'Numbers' },
        { name: 'hasSpecialChar', label: 'Special chars' }
    ];
    
    requirements.forEach(req => {
        const span = document.createElement('span');
        span.className = strength.requirements[req.name] ? 'met' : 'unmet';
        span.textContent = req.label;
        strengthIndicator.appendChild(span);
    });
} 