import { auth, messaging } from './firebase-config.js';
import { getFirestore, collection, query, orderBy, onSnapshot, deleteDoc, doc, setDoc, getDoc, updateDoc, getDocs, addDoc, where } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';

const db = getFirestore();
const messagesList = document.getElementById('messagesList');

// Cache the auth state to prevent redirect flicker
let isAdmin = false;

// Request notification permission and save token
async function setupNotifications() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: 'BOanVJq4Mf-4H8MXPLg-5GnuUwORDbxsvFxjXOEQEYJSIIu2sJCh85L-69I-GRPcwgALivkh_k2XH1eQfKu-bTo' // Your VAPID key
            });
            
            // Save token to Firestore
            await setDoc(doc(db, 'adminTokens', auth.currentUser.uid), {
                token,
                email: auth.currentUser.email,
                lastUpdated: new Date()
            });
        }
    } catch (error) {
        console.error('Error setting up notifications:', error);
    }
}

// Update isUserAdmin function to be more permissive
async function isUserAdmin(user) {
    if (!user) return false;
    
    // Super admin check
    if (user.email === 'ag.aliengamerz@gmail.com') return true;
    
    try {
        // Add hamza.datashare@gmail.com as a trusted admin
        if (user.email === 'hamza.datashare@gmail.com') return true;
        
        // Check regular admin status
        const adminQuery = query(
            collection(db, 'admins'), 
            where('email', '==', user.email.toLowerCase())
        );
        const adminSnapshot = await getDocs(adminQuery);
        return !adminSnapshot.empty;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Update loadMessages function
function loadMessages() {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const messagesList = document.getElementById('messagesList');
    
    if (!messagesList) {
        console.error('Messages list element not found');
        return;
    }

    try {
        const unsubscribe = onSnapshot(q, (snapshot) => {
            messagesList.innerHTML = '';
            
            if (snapshot.empty) {
                messagesList.innerHTML = '<p class="no-messages">No messages yet</p>';
                return;
            }

            snapshot.forEach((doc) => {
                const message = doc.data();
                const date = message.timestamp?.toDate?.() 
                    ? message.timestamp.toDate().toLocaleString() 
                    : 'No date';
                
                messagesList.innerHTML += `
                    <div class="message-card" id="${doc.id}">
                        <div class="message-header">
                            <h3>${message.name || 'Anonymous'}</h3>
                            <span class="message-date">${date}</span>
                        </div>
                        <div class="message-email">
                            <a href="mailto:${message.email}">${message.email}</a>
                        </div>
                        <p class="message-content">${message.message}</p>
                        <div class="message-actions">
                            <button onclick="deleteMessage('${doc.id}')" class="delete-btn">
                                Delete
                            </button>
                            <button onclick="replyToEmail('${message.email}')" class="reply-btn">
                                Reply
                            </button>
                        </div>
                    </div>
                `;
            });
        }, (error) => {
            console.error('Error loading messages:', error);
            messagesList.innerHTML = '<p class="error-message">Error loading messages. Please refresh the page.</p>';
        });

        // Cleanup listener on page change
        window.addEventListener('unload', () => unsubscribe());

    } catch (error) {
        console.error('Error setting up message listener:', error);
    }
}

// Add navigation handling
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
        }
    });
});

// Update showSection to refresh admin lists when switching sections
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionId}-section`);
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (targetSection) {
        targetSection.classList.add('active');
        // Refresh admin lists when switching to admin sections
        if (sectionId === 'admin-management' || sectionId === 'admins') {
            loadAdmins();
            loadAdminList();
        }
    }
    
    if (targetLink) {
        targetLink.classList.add('active');
    }
}

// Update loadAdmins function to handle errors better
async function loadAdmins() {
    const adminList = document.getElementById('adminList');
    if (!adminList) {
        console.error('Admin list element not found');
        return;
    }

    try {
        // Query admins collection
        const adminsQuery = query(collection(db, 'admins'));
        const querySnapshot = await getDocs(adminsQuery);
        
        console.log('Found admins:', querySnapshot.size); // Debug log

        adminList.innerHTML = ''; // Clear existing list
        
        if (querySnapshot.empty) {
            adminList.innerHTML = '<p>No admins found</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const admin = doc.data();
            console.log('Admin:', admin); // Debug log
            
            const isSuperAdmin = admin.email === 'ag.aliengamerz@gmail.com' || admin.isSuperAdmin;
            const isOriginalSuperAdmin = auth.currentUser?.email === 'ag.aliengamerz@gmail.com';

            adminList.innerHTML += `
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${admin.email}</div>
                        <div class="admin-meta">
                            <span class="admin-type ${isSuperAdmin ? 'super' : 'regular'}">
                                ${isSuperAdmin ? 'Super Admin' : 'Admin'}
                            </span>
                            <span class="admin-date">
                                Added: ${admin.addedAt?.toDate().toLocaleDateString() || 'N/A'}
                            </span>
                        </div>
                    </div>
                    ${isOriginalSuperAdmin && admin.email !== 'ag.aliengamerz@gmail.com' ? `
                        <div class="admin-actions">
                            <button onclick="toggleAdminRole('${admin.email}')" class="role-btn">
                                ${admin.isSuperAdmin ? 'Make Admin' : 'Make Super Admin'}
                            </button>
                            <button onclick="removeAdmin('${admin.email}')" class="delete-btn">
                                Remove
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading admins:', error);
        adminList.innerHTML = '<p class="error">Error loading admins. Please try again.</p>';
    }
}

// Load and display admin list
async function loadAdminList() {
    const adminsList = document.getElementById('adminsList');
    console.log('Loading admin list... Element found:', !!adminsList);
    
    if (!adminsList) return;  // Guard clause if element doesn't exist

    const q = query(collection(db, 'admins'));
    
    try {
        console.log('Fetching admin list data...');
        const snapshot = await getDocs(q);
        console.log('Admin list entries found:', snapshot.size);
        
        adminsList.innerHTML = '';
        snapshot.forEach((doc) => {
            const admin = doc.data();
            console.log('Admin list entry:', admin);
            const isSuperAdmin = admin.isSuperAdmin || admin.email === 'ag.aliengamerz@gmail.com';
            const isOriginalSuperAdmin = auth.currentUser?.email === 'ag.aliengamerz@gmail.com';
            
            adminsList.innerHTML += `
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${admin.email}</div>
                        <div class="admin-meta">
                            <span class="admin-type ${isSuperAdmin ? 'super' : 'regular'}">
                                ${isSuperAdmin ? 'Super Admin' : 'Admin'}
                            </span>
                            <span class="admin-date">
                                Added: ${admin.addedAt.toDate().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    ${(isOriginalSuperAdmin && admin.email !== 'ag.aliengamerz@gmail.com') ? `
                        <div class="admin-actions">
                            <button onclick="toggleAdminRole('${doc.id}')" 
                                class="role-btn" title="Toggle Role">
                                ${admin.isSuperAdmin ? 'Make Admin' : 'Make Super Admin'}
                            </button>
                            <button onclick="removeAdmin('${doc.id}')" 
                                class="delete-btn" title="Remove Admin">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } catch (error) {
        console.error('Error in loadAdminList:', error);
    }
}

// Add modal control functions
function openAdminModal() {
    document.getElementById('adminModal').classList.remove('hidden');
    loadAdminList();
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

// Add new modal control functions
window.openAddAdminModal = function() {
    document.getElementById('addAdminModal').classList.remove('hidden');
    document.getElementById('adminEmail').focus();
};

window.closeAddAdminModal = function() {
    document.getElementById('addAdminModal').classList.add('hidden');
    document.getElementById('addAdminForm').reset();
};

// Add role change function
window.changeAdminRole = async (adminId) => {
    try {
        const adminDoc = await getDoc(doc(db, 'admins', adminId));
        const admin = adminDoc.data();
        const newRole = admin.isSuperAdmin ? 'admin' : 'super admin';
        
        if (confirm(`Change ${admin.email}'s role to ${newRole}?`)) {
            await updateDoc(doc(db, 'admins', adminId), {
                isSuperAdmin: !admin.isSuperAdmin,
                roleChangedBy: auth.currentUser.email,
                roleChangedAt: new Date()
            });
            
            alert('Admin role updated successfully');
        }
    } catch (error) {
        console.error('Error changing admin role:', error);
        alert('Failed to change admin role');
    }
};

// Update addAdmin function
window.addAdmin = async () => {
    try {
        if (auth.currentUser?.email !== 'ag.aliengamerz@gmail.com') {
            throw new Error('Only super admin can add new admins');
        }

        const email = prompt('Enter new admin email:')?.toLowerCase().trim();
        if (!email) return;

        // Use email as the document ID
        const adminRef = doc(db, 'admins', email);
        const adminDoc = await getDoc(adminRef);

        if (adminDoc.exists()) {
            throw new Error('This email is already an admin');
        }

        await setDoc(adminRef, {
            email: email,
            addedBy: auth.currentUser.email,
            addedAt: new Date(),
            isSuperAdmin: false
        });

        alert('Admin added successfully');
        await loadAdmins(); // Refresh the list
    } catch (error) {
        console.error('Error adding admin:', error);
        alert(error.message);
    }
};

// Update form submission handler
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeAdminModal').addEventListener('click', closeAdminModal);
    
    // Close modal when clicking outside
    document.getElementById('adminModal').addEventListener('click', (e) => {
        if (e.target.id === 'adminModal') closeAdminModal();
    });

    // Close modal on outside click
    document.getElementById('addAdminModal').addEventListener('click', (e) => {
        if (e.target.id === 'addAdminModal') closeAddAdminModal();
    });

    const addAdminForm = document.getElementById('addAdminForm');
    if (addAdminForm) {
        addAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('adminEmail');
            const isSuperAdminInput = document.getElementById('isSuperAdmin');
            
            if (!emailInput) return;
            
            const email = emailInput.value.trim().toLowerCase();
            const isSuperAdmin = isSuperAdminInput?.checked || false;
            
            try {
                if (auth.currentUser?.email !== 'ag.aliengamerz@gmail.com') {
                    throw new Error('Only super admin can add new admins');
                }

                // Use email as document ID
                const adminRef = doc(db, 'admins', email);
                const adminDoc = await getDoc(adminRef);
                
                if (adminDoc.exists()) {
                    throw new Error('This email is already an admin');
                }

                await setDoc(adminRef, {
                    email,
                    isSuperAdmin,
                    addedBy: auth.currentUser.email,
                    addedAt: new Date()
                });

                closeAddAdminModal();
                alert('Admin added successfully');
                loadAdminList();
                loadAdmins();
            } catch (error) {
                console.error('Error adding admin:', error);
                alert(error.message);
            }
        });
    }
});

// Remove admin
window.removeAdmin = async (adminId) => {
    try {
        const currentUser = auth.currentUser;
        if (currentUser.email !== 'ag.aliengamerz@gmail.com') {
            throw new Error('Only super admin can remove admins');
        }

        if (confirm('Are you sure you want to remove this admin?')) {
            await deleteDoc(doc(db, 'admins', adminId));
            alert('Admin removed successfully');
        }
    } catch (error) {
        console.error('Error removing admin:', error);
        alert(error.message);
    }
};

// Add super admin promotion functionality
window.promoteToSuperAdmin = async () => {
    const email = prompt('Enter email of admin to promote to super admin:');
    if (!email) return;

    try {
        const currentUser = auth.currentUser;
        if (currentUser.email !== 'ag.aliengamerz@gmail.com') {
            throw new Error('Only the original super admin can promote others');
        }

        const adminDoc = await getDocs(query(collection(db, 'admins'), where('email', '==', email)));
        if (adminDoc.empty) {
            throw new Error('User is not an admin');
        }

        await updateDoc(adminDoc.docs[0].ref, {
            isSuperAdmin: true,
            promotedBy: currentUser.email,
            promotedAt: new Date()
        });

        alert('Admin promoted to super admin successfully');
    } catch (error) {
        console.error('Error promoting admin:', error);
        alert(error.message);
    }
};

// Update auth state check to fix race condition
let authInitialized = false;

auth.onAuthStateChanged(async (user) => {
    if (!authInitialized) {
        authInitialized = true;
        
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const isAdmin = await isUserAdmin(user);
            if (!isAdmin) {
                window.location.href = 'index.html';
                return;
            }

            const isSuperAdmin = user.email === 'ag.aliengamerz@gmail.com';
            await setupUI(user, isSuperAdmin);

        } catch (error) {
            console.error('Error checking admin status:', error);
            window.location.href = 'index.html';
        }
    }
});

// Update setupUI to handle both super admins and trusted admins
async function setupUI(user, isSuperAdmin) {
    try {
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = user.email;
        }
        
        // Show admin controls for both super admin and trusted admin
        if (isSuperAdmin || user.email === 'hamza.datashare@gmail.com') {
            const superAdminLinks = document.getElementById('superAdminLinks');
            if (superAdminLinks) {
                superAdminLinks.classList.remove('hidden');
            }
            document.querySelectorAll('.admin-controls')?.forEach(el => 
                el.classList.remove('hidden')
            );
        }

        // Initialize features
        await setupNotifications();
        loadMessages();
        await loadAdmins();
        await loadAdminList();

    } catch (error) {
        console.error('Error setting up UI:', error);
    }
}

// Delete message
window.deleteMessage = async (messageId) => {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            await deleteDoc(doc(db, 'messages', messageId));
            console.log('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    }
};

// Reply to email
window.replyToEmail = (email) => {
    window.location.href = `mailto:${email}`;
};
