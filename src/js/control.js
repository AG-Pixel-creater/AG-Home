import { auth, functions } from './firebase-config.js';
import { httpsCallable } from 'firebase/functions';
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, query, where, getDocs, updateDoc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { setupFCM } from './fcm-manager.js';
import { onAuthStateChanged } from 'firebase/auth';
import roleManager, { ROLES, OWNER_EMAILS } from './role-manager.js';

const db = getFirestore();

// Exchange rate: 1 USD = ~278 PKR (you can update this)
const PKR_TO_USD_RATE = 278;

// Helper function to convert PKR to USD
function convertPKRToUSD(priceInPKR) {
    if (!priceInPKR || priceInPKR === 0) return 0;
    return (priceInPKR / PKR_TO_USD_RATE).toFixed(2);
}

// Helper function to format price display
function formatPrice(priceInPKR) {
    // Ensure we have a number
    const price = parseFloat(priceInPKR) || 0;
    
    // If price is 0 or less, show FREE
    if (price <= 0) {
        return 'FREE';
    }
    
    // Otherwise show PKR with USD conversion
    const roundedPrice = Math.round(price);
    const usdPrice = (price / PKR_TO_USD_RATE).toFixed(2);
    return `${roundedPrice} PKR ($ ${usdPrice})`;
}

// ============================================================================
// DATA LOADING FUNCTIONS
// ============================================================================

async function loadModerators() {
    const moderatorsList = document.getElementById('moderatorsList');
    if (!moderatorsList) {
        console.log('Moderators list element not found');
        return;
    }

    try {
        moderatorsList.innerHTML = '<div class="loading">Loading moderators...</div>';

        const q = query(collection(db, 'moderators'));
        const snapshot = await getDocs(q);

        let moderatorsList_data = [];

        snapshot.forEach(docSnap => {
            const mod = docSnap.data();
            moderatorsList_data.push({
                id: docSnap.id,
                ...mod,
                source: 'moderators'
            });
        });

        const users = await loadUsersByRole('MODERATOR');
        users.forEach(user => {
            if (!moderatorsList_data.find(m => m.email === user.email)) {
                moderatorsList_data.push({
                    ...user,
                    source: 'users'
                });
            }
        });

        moderatorsList.innerHTML = '';

        if (moderatorsList_data.length === 0) {
            moderatorsList.innerHTML = '<p class="no-moderators">No moderators found</p>';
            return;
        }

        moderatorsList_data.sort((a, b) => a.email.localeCompare(b.email));

        for (const mod of moderatorsList_data) {
            const canManage = await roleManager.checkPermission(
                auth.currentUser,
                'manage',
                ROLES.MODERATOR
            );

            const addedDate = mod.addedAt?.toDate?.() || mod.createdAt?.toDate?.() || null;
            const dateStr = addedDate ? new Date(addedDate).toLocaleDateString() : 'N/A';

            moderatorsList.innerHTML += `
                <div class="moderator-item">
                    <div class="moderator-info">
                        <div class="moderator-email">${mod.email}</div>
                        <div class="moderator-meta">
                            <span class="admin-type regular">
                                Moderator
                            </span>
                            <span class="moderator-date">Added: ${dateStr}</span>
                            <span class="moderator-by">by: ${mod.addedBy || 'N/A'}
                        </div>
                    </div>
                    ${canManage ? `
                        <div class="moderator-actions">
                            <button onclick="removeModerator('${mod.id || mod.email}')" class="remove-btn">
                                Remove
                            </button>
                            <button onclick="showRolePicker('${mod.id || mod.email}', '${mod.email}', 'MODERATOR', this)" class="promote-btn">
                                Change Role
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading moderators:', error);
        moderatorsList.innerHTML = '<p class="error">Error loading moderators</p>';
    }
}

async function loadAdmins() {
    const adminsList = document.getElementById('adminsList');

    if (!adminsList) {
        console.log('Admin list element not found - this might be normal if section is not active');
        return;
    }

    try {
        console.log('Loading admin list... Element found:', !!adminsList);
        adminsList.innerHTML = '<div class="loading">Loading admins...</div>';

        const snapshot = await getDocs(query(collection(db, 'admins')));
        console.log('Fetching admin list data...');
        adminsList.innerHTML = '';

        if (snapshot.empty) {
            adminsList.innerHTML = '<p class="no-admins">No admins found</p>';
            return;
        }

        snapshot.forEach(docSnap => {
            const admin = docSnap.data();
            console.log('Admin list entry:', admin);

            // Treat the original owner as super admin regardless of stored flag
            const isSuperAdmin = admin.isSuperAdmin || admin.email === 'ag.aliengamerz@gmail.com';

            // Only show regular admins in the Admins management view.
            // Super admins should only be visible in the Super Admin management section.
            if (isSuperAdmin) return; // skip rendering super admins here

            const isOriginalSuperAdmin = auth.currentUser?.email === 'ag.aliengamerz@gmail.com';

            adminsList.innerHTML += `
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${admin.email}</div>
                        <div class="admin-meta">
                            <span class="admin-type regular">
                                Admin
                            </span>
                            <span class="admin-date">Added: ${formatDate(admin.addedAt)}</span>
                            <span class="admin-by">by: ${admin.addedBy || 'N/A'}
                        </div>
                    </div>
                    ${(isOriginalSuperAdmin && admin.email !== 'ag.aliengamerz@gmail.com') ? `
                        <div class="admin-actions">
                            <button onclick="showRolePicker('${docSnap.id}', '${admin.email}', 'ADMIN', this)" class="role-btn">
                                Change Role
                            </button>
                            <button onclick="removeAdmin('${docSnap.id}')" class="remove-btn">
                                Remove
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading admins:', error);
        if (adminsList) {
            adminsList.innerHTML = '<p class="error">Error loading admins</p>';
        }
    }
}

async function loadSuperAdmins() {
    const superAdminsList = document.getElementById('superAdminsList');

    if (!superAdminsList) {
        console.log('Super admins list element not found - this might be normal if section is not active');
        return;
    }

    try {
        superAdminsList.innerHTML = '<div class="loading">Loading super admins...</div>';

        const snapshot = await getDocs(
            query(collection(db, 'admins'), where('isSuperAdmin', '==', true))
        );

        superAdminsList.innerHTML = '';

        if (snapshot.empty) {
            superAdminsList.innerHTML = '<p class="no-super-admins">No super admins found</p>';
            return;
        }

        snapshot.forEach(docSnap => {
            const superAdmin = docSnap.data();
            const isOriginalSuperAdmin = auth.currentUser?.email === 'ag.aliengamerz@gmail.com';
            const canModify = isOriginalSuperAdmin && superAdmin.email !== 'ag.aliengamerz@gmail.com';

            superAdminsList.innerHTML += `
                <div class="super-admin-item">
                    <div class="super-admin-info">
                        <div class="super-admin-email">${superAdmin.email}</div>
                        <div class="super-admin-meta">
                        <span class="admin-type regular">
                            Super Admin
                        </span>
                            <span class="super-admin-date">Added: ${formatDate(superAdmin.addedAt)}</span>
                            
                        </div>
                    </div>
                    ${canModify ? `
                        <div class="super-admin-actions">
                            <button onclick="showRolePicker('${docSnap.id || superAdmin.email}', '${superAdmin.email}', 'SUPER_ADMIN', this)" class="demote-btn">
                                Change Role
                            </button>
                            <button onclick="removeSuperAdmin('${docSnap.id}')" class="remove-btn">
                                Remove
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading super admins:', error);
        superAdminsList.innerHTML = '<p class="error">Error loading super admins</p>';
    }
}

async function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) {
        console.log('Messages list element not found');
        return;
    }

    try {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            messagesList.innerHTML = '';

            if (snapshot.empty) {
                messagesList.innerHTML = '<p class="no-messages">No messages yet</p>';
                return;
            }

            snapshot.forEach((docSnap) => {
                const message = docSnap.data();
                const date = message.timestamp?.toDate?.()
                    ? message.timestamp.toDate().toLocaleString()
                    : 'No date';
                const status = message.status || 'unread';
                const archived = message.archived ? true : false;
                const adminReply = message.adminReply || '';

                messagesList.innerHTML += `
                    <div class="message-card ${archived ? 'archived' : ''} ${status === 'read' ? 'read' : 'unread'}" id="${docSnap.id}">
                        <div class="message-header">
                            <h3>${message.name || 'Anonymous'}</h3>
                            <div class="message-meta">
                                <span class="message-date">${date}</span>
                                <span class="status-badge ${status}">${status.toUpperCase()}</span>
                                ${archived ? '<span class="archived-badge">ARCHIVED</span>' : ''}
                            </div>
                        </div>
                        <div class="message-email">
                            <a href="mailto:${message.email}">${message.email}</a>
                        </div>
                        <p class="message-content">${message.message}</p>
                        ${adminReply ? `<div class="admin-reply"><strong>Admin Reply:</strong><p>${adminReply}</p></div>` : ''}
                        <div class="message-actions">
                            <button onclick="markMessageRead('${docSnap.id}')" class="mark-read-btn">
                                ${status === 'read' ? 'Mark Unread' : 'Mark Read'}
                            </button>
                            <button onclick="replyToEmail('${message.email}')" class="reply-btn">
                                Reply (email)
                            </button>
                            <button onclick="adminReplyPrompt('${docSnap.id}')" class="admin-reply-btn">
                                Add Admin Reply
                            </button>
                            <button onclick="deleteMessage('${docSnap.id}')" class="delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                `;
            });
        }, (error) => {
            console.error('Error loading messages:', error);
            messagesList.innerHTML = '<p class="error-message">Error loading messages. Please refresh the page.</p>';
        });

        window.addEventListener('unload', () => unsubscribe());
    } catch (error) {
        console.error('Error setting up message listener:', error);
    }
}

async function loadUsersByRole(role) {
    const usersQuery = query(collection(db, 'users'), where('rank', '==', role));
    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

// ============================================================================
// USER MANAGEMENT FUNCTIONS
// ============================================================================

async function removeModerator(moderatorId) {
    if (!confirm('Are you sure you want to remove this moderator?')) return;

    try {
        const modRef = doc(db, 'moderators', moderatorId);
        const modDoc = await getDoc(modRef);

        if (modDoc.exists()) {
            await deleteDoc(modRef);
        } else {
            const userRef = doc(db, 'users', moderatorId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                await updateDoc(userRef, {
                    rank: 'USER',
                    updatedAt: new Date(),
                    updatedBy: auth.currentUser?.email || 'system'
                });
            } else {
                throw new Error('Moderator not found');
            }
        }

        alert('Moderator removed successfully');
        await Promise.all([window.loadModerators?.(), window.loadUsers?.()]);
    } catch (error) {
        console.error('Error removing moderator:', error);
        alert(error.message || 'Failed to remove moderator');
    }
}

async function removeAdmin(adminId) {
    if (!confirm('Are you sure you want to remove this admin?')) return;

    try {
        await roleManager.removeRole(auth.currentUser, adminId, ROLES.ADMIN);
        await Promise.all([window.loadAdmins?.(), window.loadUsers?.()]);
        alert('Admin removed successfully');
    } catch (error) {
        console.error('Error removing admin:', error);
        alert(error.message || 'Failed to remove admin');
    }
}

async function removeSuperAdmin(uid) {
    if (!confirm('Are you sure you want to remove this super admin?')) return;

    try {
        await roleManager.removeRole(auth.currentUser, uid, ROLES.SUPER_ADMIN);
        await Promise.all([window.loadSuperAdmins?.(), window.loadUsers?.()]);
        alert('Super admin removed successfully');
    } catch (error) {
        console.error('Error removing super admin:', error);
        alert(error.message || 'Failed to remove super admin');
    }
}

async function toggleAdminRole(adminId, currentIsSuperAdmin) {
    try {
        if (auth.currentUser?.email !== 'ag.aliengamerz@gmail.com') {
            throw new Error('Only the original super admin can change admin roles');
        }

        const adminRef = doc(db, 'admins', adminId);
        const isSuperAdmin = currentIsSuperAdmin === 'true' || currentIsSuperAdmin === true;

        await updateDoc(adminRef, {
            isSuperAdmin: !isSuperAdmin,
            updatedBy: auth.currentUser.email,
            updatedAt: new Date()
        });

        alert(`Admin role updated to ${!isSuperAdmin ? 'Super Admin' : 'Regular Admin'}`);
        await Promise.all([loadAdmins(), loadSuperAdmins()]);
    } catch (error) {
        console.error('Error toggling admin role:', error);
        alert(error.message || 'Failed to toggle admin role');
    }
}

async function promoteModerator(moderatorId) {
    if (!confirm('Are you sure you want to promote this moderator to admin?')) return;

    try {
        const modRef = doc(db, 'moderators', moderatorId);
        const modDoc = await getDoc(modRef);
        let email = null;

        if (modDoc.exists()) {
            email = modDoc.data().email;
            await setDoc(doc(db, 'admins', email), {
                email,
                isSuperAdmin: false,
                addedBy: auth.currentUser?.email || 'system',
                addedAt: new Date()
            });
            await deleteDoc(modRef);
        } else {
            const userRef = doc(db, 'users', moderatorId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                email = userDoc.data().email;
                await setDoc(doc(db, 'admins', email), {
                    email,
                    isSuperAdmin: false,
                    addedBy: auth.currentUser?.email || 'system',
                    addedAt: new Date()
                });
                await updateDoc(userRef, {
                    rank: 'ADMIN',
                    updatedAt: new Date(),
                    updatedBy: auth.currentUser?.email
                });
            } else {
                throw new Error('Moderator not found');
            }
        }

        alert('Moderator promoted to admin successfully');
        await Promise.all([loadModerators(), loadAdmins()]);
    } catch (error) {
        console.error('Error promoting moderator:', error);
        alert(error.message || 'Failed to promote moderator');
    }
}

async function demoteFromSuperAdmin(adminEmail) {
    try {
        if (auth.currentUser?.email !== 'ag.aliengamerz@gmail.com') {
            throw new Error('Only the original super admin can demote others');
        }

        if (adminEmail === 'ag.aliengamerz@gmail.com') {
            throw new Error('Cannot demote the original super admin');
        }

        if (!confirm(`Are you sure you want to demote ${adminEmail} to regular admin?`)) {
            return;
        }

        const adminRef = doc(db, 'admins', adminEmail);
        await updateDoc(adminRef, {
            isSuperAdmin: false,
            demotedBy: auth.currentUser.email,
            demotedAt: new Date()
        });

        await addDoc(collection(db, 'admin_logs'), {
            action: 'DEMOTE_FROM_SUPERADMIN',
            adminEmail,
            performedBy: auth.currentUser.email,
            timestamp: new Date()
        });

        alert('Super admin demoted to regular admin successfully');
        await Promise.all([loadAdmins(), loadSuperAdmins()]);
    } catch (error) {
        console.error('Error demoting super admin:', error);
        alert(error.message);
    }
}

async function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            await deleteDoc(doc(db, 'messages', messageId));
            console.log('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    }
}

function replyToEmail(email) {
    window.location.href = `mailto:${email}`;
}

async function updateMessageMetadata(messageId, updates) {
    // If we've detected the functions endpoint is unavailable, skip retries
    if (window._messageUpdateUnavailable) {
        console.warn('Message update unavailable; skipping attempt');
        return;
    }
    try {
        const updateFn = httpsCallable(functions, 'updateMessage');
        const res = await updateFn({ messageId, updates });
        if (!res.data || !res.data.success) {
            throw new Error(res.data?.error || 'Failed to update message');
        }
        console.log('Message updated (callable)', messageId, updates);
        return;
    } catch (err) {
        console.warn('Callable failed, attempting HTTP fallback:', err?.message || err);
        // Try HTTP fallback to CORS-enabled endpoint
        try {
            if (!auth.currentUser) throw new Error('Not authenticated');
            const idToken = await auth.currentUser.getIdToken();
            const region = 'us-central1';
            const project = 'ag-home-3db3f';
            const url = `https://${region}-${project}.cloudfunctions.net/updateMessageCors`;
            const payload = { messageId, updates };
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) {
                const text = await resp.text().catch(() => '');
                throw new Error(`HTTP fallback failed: ${resp.status} ${resp.statusText} ${text}`);
            }
            const data = await resp.json().catch(() => ({}));
            if (!data.success) throw new Error(data.error || 'HTTP fallback did not return success');
            console.log('Message updated (http fallback)', messageId, updates);
            return;
        } catch (httpErr) {
            console.error('Error updating message metadata:', httpErr);
            // mark unavailable to avoid spamming the console and alerts repeatedly
            window._messageUpdateUnavailable = true;
            // show actionable guidance once
            const guidance = `Failed to call Cloud Functions (CORS or deployment issue).\n
Please deploy the functions and install dependencies in the functions folder:\n
1) cd functions\n+2) npm install\n+3) cd ..\n+4) firebase deploy --only functions:updateMessage,functions:updateMessageCors\n
After deploying, hard-refresh this page (Ctrl+F5) and try again.`;
            // Use alert so it's obvious during development
            alert(guidance);
            // As a temporary developer convenience: if the current user is an Owner,
            // attempt a direct client-side Firestore update (may be blocked by rules in production).
            try {
                const currentEmail = String(auth.currentUser?.email || '').toLowerCase();
                if (auth.currentUser && OWNER_EMAILS.includes(currentEmail)) {
                    await updateDoc(doc(db, 'messages', messageId), {
                        ...updates,
                        handledBy: auth.currentUser.email,
                        handledAt: new Date()
                    });
                    console.log('Message updated (direct client workaround)', messageId, updates);
                    return;
                }
            } catch (directErr) {
                console.error('Direct client update failed:', directErr);
            }
            return;
        }
    }
}

async function markMessageRead(messageId) {
    try {
        // Toggle based on current DOM badge text
        const el = document.getElementById(messageId);
        const statusBadge = el?.querySelector('.status-badge');
        const current = statusBadge ? statusBadge.textContent.toLowerCase() : 'unread';
        const newStatus = current === 'read' ? 'unread' : 'read';
        await updateMessageMetadata(messageId, { status: newStatus });
    } catch (err) {
        console.error(err);
    }
}

async function toggleArchiveMessage(messageId, currentlyArchived) {
    // archive functionality removed from UI; keep function for backwards compatibility if needed
    try {
        await updateMessageMetadata(messageId, { archived: !currentlyArchived });
    } catch (err) {
        console.error(err);
    }
}

async function adminReplyPrompt(messageId) {
    const reply = prompt('Enter admin reply (this will be saved and visible to other admins):');
    if (reply === null) return; // cancelled
    if (reply.trim() === '') {
        alert('Reply cannot be empty');
        return;
    }
    await updateMessageMetadata(messageId, { adminReply: reply.trim() });
}

async function changeUserRole(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }

        const user = userDoc.data();
        const roles = ['USER', 'MODERATOR', 'ADMIN'];
        const currentRoleIndex = roles.indexOf(user.role || 'USER');
        const newRole = roles[(currentRoleIndex + 1) % roles.length];

        if (confirm(`Change ${user.email}'s role to ${newRole}?`)) {
            await updateDoc(doc(db, 'users', userId), {
                role: newRole,
                updatedAt: new Date(),
                updatedBy: auth.currentUser.email
            });

            await addDoc(collection(db, 'admin_logs'), {
                action: 'CHANGE_ROLE',
                targetUser: user.email,
                oldRole: user.role,
                newRole: newRole,
                performedBy: auth.currentUser.email,
                timestamp: new Date()
            });

            alert('User role updated successfully');
            window.loadUsers?.();
        }
    } catch (error) {
        console.error('Error changing user role:', error);
        alert(error.message);
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        await deleteDoc(doc(db, 'users', userId));
        alert('User deleted successfully');
        window.loadUsers?.();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.message || 'Failed to delete user');
    }
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

function openAddModeratorModal() {
    const modal = document.getElementById('addModeratorModal');
    const emailInput = document.getElementById('moderatorEmail');

    if (!modal) {
        console.error('Moderator modal not found');
        alert('Error: Modal not found. Please refresh the page.');
        return;
    }

    modal.classList.remove('hidden');

    if (emailInput) {
        emailInput.focus();
    }
}

// Expose moderator modal functions immediately to window for inline onclick handlers
window.openAddModeratorModal = openAddModeratorModal;
window.closeAddModeratorModal = closeAddModeratorModal;

function closeAddModeratorModal() {
    const modal = document.getElementById('addModeratorModal');
    const form = document.getElementById('addModeratorForm');

    if (modal) {
        modal.classList.add('hidden');
    }

    if (form) {
        form.reset();
    }
}

// Modal open/close handlers for Super Admin
function openAddSuperAdminModal() {
    document.getElementById('addSuperAdminModal').classList.remove('hidden');
}

function closeAddSuperAdminModal() {
    document.getElementById('addSuperAdminModal').classList.add('hidden');
}

// Export modal functions to window object for HTML onclick handlers
window.openAddSuperAdminModal = openAddSuperAdminModal;
window.closeAddSuperAdminModal = closeAddSuperAdminModal;

function openAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.classList.remove('hidden');
        const emailInput = document.getElementById('adminEmail');
        if (emailInput) emailInput.focus();
    }
}

// Expose admin modal functions immediately to window for inline onclick handlers
window.openAddAdminModal = openAddAdminModal;
window.closeAddAdminModal = closeAddAdminModal;

function closeAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.classList.add('hidden');
        const form = document.getElementById('addAdminForm');
        if (form) form.reset();
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(date) {
    if (!date) return 'N/A';
    const dateObj = date?.toDate?.() ? date.toDate() : (date instanceof Date ? date : null);
    if (!dateObj) return 'N/A';
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Expose formatDate to other dynamically imported modules that rely on it
window.formatDate = formatDate;

async function assignRole(email, role) {
    try {
        const userRef = doc(db, 'users', email);
        await setDoc(userRef, {
            email,
            rank: role,
            createdAt: new Date(),
            createdBy: auth.currentUser?.email || 'system'
        }, { merge: true });

        console.log(`Role ${role} assigned to ${email} successfully`);
        return true;
    } catch (error) {
        console.error('Error assigning role:', error);
        throw error;
    }
}

async function isUserAdmin(user) {
    if (!user) return false;

    if (OWNER_EMAILS.includes(user.email.toLowerCase())) {
        return true;
    }

    try {
        const adminDoc = await getDoc(doc(db, 'admins', user.email));
        if (adminDoc.exists()) return true;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.rank === ROLES.ADMIN || userData.rank === ROLES.SUPER_ADMIN || userData.rank === ROLES.OWNER;
        }

        return false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Service Worker & FCM Setup
async function setupNotifications() {
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Workers not supported');
        return;
    }

    if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/',
            updateViaCache: 'none'
        });

        // Wait for service worker to become active
        await new Promise((resolve) => {
            if (registration.active) {
                resolve();
            } else {
                const sw = registration.installing || registration.waiting;
                if (sw) {
                    sw.addEventListener('statechange', () => {
                        if (sw.state === 'activated') {
                            resolve();
                        }
                    });
                } else {
                    // No immediate installing/waiting worker — wait until the global ready promise
                    navigator.serviceWorker.ready.then(() => resolve());
                }
            }
        });

        console.log('[Service Worker] Activated — proceeding to FCM setup');

        // Now safe to request FCM token
        await setupFCM();
    } catch (error) {
        console.error('Error in notification setup:', error);
    }
}

async function setupUI(user, isSuperAdmin) {
    try {
        // First setup sections and UI elements
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = user.email;
        }

        if (isSuperAdmin || user.email === 'hamza.datashare@gmail.com') {
            const superAdminLinks = document.getElementById('superAdminLinks');
            if (superAdminLinks) {
                superAdminLinks.classList.remove('hidden');
            }
            document.querySelectorAll('.admin-controls')?.forEach(el =>
                el.classList.remove('hidden')
            );
        }

        // Show initial section based on hash or default
        const hash = window.location.hash.slice(1) || 'messages';
        showSection(hash);

        // Load data after UI is ready
        await Promise.all([
            loadMessages(),
            loadAdmins(),
            window.loadUsers?.()
        ]);

        // Setup notifications last
        await setupNotifications();
    } catch (error) {
        console.error('Error setting up UI:', error);
    }
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================

// ---------------------------------------------------------------------------
// Utilities for owner to recreate role documents (useful for recovery)
// Exposed on window so owner can call from the browser console.
// Example: recreateModerators(['mod1@example.com','mod2@example.com'])
// Example: recreateSuperAdmin('new-super@example.com')
window.recreateModerators = async function (emails) {
    if (!auth.currentUser) throw new Error('You must be logged in as owner to run this');
    if (!Array.isArray(emails)) throw new Error('Please pass an array of emails');

    const results = { created: [], failed: [] };
    for (const rawEmail of emails) {
        const email = String(rawEmail).trim().toLowerCase();
        try {
            await roleManager.assignRole(auth.currentUser, email, ROLES.MODERATOR);
            results.created.push(email);
        } catch (err) {
            console.error('Failed to create moderator for', email, err);
            results.failed.push({ email, error: err.message || String(err) });
        }
    }
    console.log('recreateModerators result:', results);
    return results;
};

window.recreateSuperAdmin = async function (email) {
    if (!auth.currentUser) throw new Error('You must be logged in as owner to run this');
    if (!email) throw new Error('Please provide an email');
    const e = String(email).trim().toLowerCase();
    try {
        await roleManager.assignRole(auth.currentUser, e, ROLES.SUPER_ADMIN);
        console.log('Super admin created:', e);
        return { email: e, ok: true };
    } catch (err) {
        console.error('Failed to create super admin for', e, err);
        return { email: e, ok: false, error: err.message || String(err) };
    }
};

async function setupOwners() {
    try {
        if (!auth.currentUser) return;
        const email = String(auth.currentUser.email || '').toLowerCase();
        if (!email) return;

        if (OWNER_EMAILS.includes(email)) {
            // Reveal owner-only UI
            const ownerSection = document.getElementById('owner-section');
            if (ownerSection) ownerSection.classList.remove('hidden');

            // Attach any owner helper functions to window for convenience
            // (recreateModerators/recreateSuperAdmin are already exposed)
            console.log('Owner detected, owner UI enabled for', email);
        }
    } catch (err) {
        console.error('Error in setupOwners:', err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Setting up form handlers');

    // Dynamically load UI helpers to avoid circular import timing issues
    try {
        const ui = await import('./ui-handlers.clean.js');
        ui.setupFormHandlers?.();
        ui.setupNavigationHandlers?.();
        // expose showSection and loadUsers from ui module if needed
        if (ui.showSection) window.showSection = ui.showSection;
        if (ui.loadUsers) window.loadUsers = ui.loadUsers;
        // expose message helper functions so inline onclick handlers can call them
        if (typeof markMessageRead === 'function') window.markMessageRead = markMessageRead;
        if (typeof adminReplyPrompt === 'function') window.adminReplyPrompt = adminReplyPrompt;
        if (typeof updateMessageMetadata === 'function') window.updateMessageMetadata = updateMessageMetadata;
        if (typeof deleteMessage === 'function') window.deleteMessage = deleteMessage;
        if (typeof replyToEmail === 'function') window.replyToEmail = replyToEmail;
    } catch (err) {
        console.warn('Could not load ui-handlers.clean.js dynamically:', err);
    }

    await setupOwners();

    // If auth user is present, determine super-admin status and reveal links immediately
    try {
        if (auth.currentUser && auth.currentUser.email) {
            const email = String(auth.currentUser.email).toLowerCase();
            const adminRef = doc(db, 'admins', email);
            const adminDoc = await getDoc(adminRef);
            const isSuperAdmin = (adminDoc.exists() && adminDoc.data().isSuperAdmin) || (email === 'hamza.datashare@gmail.com');
            if (isSuperAdmin) {
                const superAdminLinks = document.getElementById('superAdminLinks');
                if (superAdminLinks) superAdminLinks.classList.remove('hidden');
            }
        }
    } catch (err) {
        console.error('Error checking super admin status:', err);
    }

    // Moderator form handling
    const addModeratorForm = document.getElementById('addModeratorForm');
    if (addModeratorForm) {
        addModeratorForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const emailInput = document.getElementById('moderatorEmail');
                if (!emailInput) {
                    throw new Error('Moderator email input not found');
                }

                const email = emailInput.value.trim().toLowerCase();
                if (!email || !email.includes('@')) {
                    throw new Error('Please enter a valid email address');
                }

                if (!auth.currentUser) {
                    throw new Error('You must be logged in to add moderators');
                }

                await assignRole(email, ROLES.MODERATOR);

                emailInput.value = '';
                closeAddModeratorModal();

                alert('Moderator added successfully');

                await Promise.all([window.loadModerators?.(), window.loadUsers?.()]);
            } catch (error) {
                console.error('Error adding moderator:', error);
                alert(error.message || 'Failed to add moderator');
            }
        });
    }

    // Super Admin form handling
    const addSuperAdminForm = document.getElementById('addSuperAdminForm');
    if (addSuperAdminForm) {
        addSuperAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('superAdminEmail');
            if (!emailInput) return;

            const email = emailInput.value.trim().toLowerCase();

            try {
                if (auth.currentUser?.email !== 'ag.aliengamerz@gmail.com') {
                    throw new Error('Only the original super admin can add new super admins');
                }

                const adminRef = doc(db, 'admins', email);
                const adminDoc = await getDoc(adminRef);

                if (adminDoc.exists() && adminDoc.data().isSuperAdmin) {
                    throw new Error('This email is already a super admin');
                }

                await setDoc(adminRef, {
                    email,
                    isSuperAdmin: true,
                    addedBy: auth.currentUser.email,
                    addedAt: new Date()
                }, { merge: true });

                closeAddSuperAdminModal();
                alert('Super Admin added successfully');
                await loadSuperAdmins();
            } catch (error) {
                console.error('Error adding super admin:', error);
                alert(error.message);
            }
        });
    }

    // Admin form handling
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
                await Promise.all([loadAdmins(), loadSuperAdmins()]);
            } catch (error) {
                console.error('Error adding admin:', error);
                alert(error.message);
            }
        });
    }

    // Close modals when clicking outside
    document.getElementById('addModeratorModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'addModeratorModal') closeAddModeratorModal();
    });

    document.getElementById('addSuperAdminModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'addSuperAdminModal') closeAddSuperAdminModal();
    });

    document.getElementById('addAdminModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'addAdminModal') closeAddAdminModal();
    });

    document.getElementById('addProductModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'addProductModal') closeAddProductModal();
    });

    // Navigation handlers are now managed by ui-handlers.js (dynamically loaded above)
    window.setupNavigationHandlers?.();
});
// ============================================================================
// EXPORT FUNCTIONS TO WINDOW OBJECT (IMMEDIATE)
// ============================================================================

// Export functions in a way that ensures they're available immediately
const exportedFunctions = {
    openAddModeratorModal,
    closeAddModeratorModal,
    openAddSuperAdminModal,
    closeAddSuperAdminModal,
    openAddAdminModal,
    closeAddAdminModal,
    removeModerator,
    removeAdmin,
    removeSuperAdmin,
    toggleAdminRole,
    promoteModerator,
    demoteFromSuperAdmin,
    deleteMessage,
    replyToEmail,
    changeUserRole,
    deleteUser,
    // Expose data loaders for ui-handlers to call
    loadModerators,
    loadAdmins,
    loadSuperAdmins,
    loadMessages,
    // Product management functions
    openAddProductModal,
    closeAddProductModal,
    closeProductDetailsModal,
    openEditProductModal,
    closeEditProductModal,
    addProduct,
    updateProduct,
    loadControlPanelProducts,
    deleteProduct,
    editProduct,
    showProductDetails,
    clearImagePreview,
    // alias for compatibility
    loadModeratorList: loadModerators
};

// Assign to window immediately and log for verification
Object.assign(window, exportedFunctions);
// Expose setupUI and setupOwners so external auth listeners can call them
window.setupUI = setupUI;
window.setupOwners = setupOwners;

// Allow setting a user's role to a specific rank (used by the UI role picker)
async function setUserRole(userId, userEmail, role) {
    try {
        if (!auth.currentUser) throw new Error('You must be signed in to perform this action');
        if (!userEmail) throw new Error('User email is required to set role');

        // Protect owners from being changed client-side
        const normalized = String(userEmail).toLowerCase();
        if (OWNER_EMAILS.includes(normalized)) throw new Error('Owner accounts cannot be modified');

        await roleManager.assignRole(auth.currentUser, normalized, role);

        // Refresh relevant lists
        await Promise.all([window.loadUsers?.(), window.loadAdmins?.(), window.loadModerators?.(), window.loadSuperAdmins?.()]);

        alert(`Role updated to ${role} for ${userEmail}`);
        return true;
    } catch (err) {
        console.error('Error setting user role:', err);
        alert(err.message || 'Failed to set role');
        throw err;
    }
}

window.setUserRole = setUserRole;

// Listen for auth state changes and initialize the UI when a user signs in.
onAuthStateChanged(auth, async (user) => {
    try {
        if (!user) {
            // Clear UI state for signed-out users
            const userDisplayEl = document.getElementById('userDisplay');
            if (userDisplayEl) userDisplayEl.textContent = '';
            return;
        }

        const email = String(user.email || '').toLowerCase();

        // Restrict access: only staff (owner/admin/superadmin/moderator) may use control panel.
        try {
            let rank = '';
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const d = userDoc.data() || {};
                    rank = (d.rank || d.role || '').toString();
                }
            } catch (e) {
                console.warn('Could not read users document for role check:', e);
            }

            // If no rank found, check admins/moderators collections
            if (!rank) {
                try {
                    const adminDoc = await getDoc(doc(db, 'admins', email));
                    if (adminDoc.exists()) rank = 'ADMIN';
                } catch (e) {
                    console.warn('Could not check admins collection for role check:', e);
                }
            }

            if (!rank) {
                try {
                    const modDoc = await getDoc(doc(db, 'moderators', email));
                    if (modDoc.exists()) rank = 'MODERATOR';
                } catch (e) {
                    console.warn('Could not check moderators collection for role check:', e);
                }
            }

            const isOwner = OWNER_EMAILS.includes(email);
            if (!isOwner && (!rank || rank.toUpperCase() === 'USER')) {
                alert('Access denied: Control Panel is for staff only.');
                try { window.location.href = '/'; } catch (e) { /* ignore */ }
                return;
            }
        } catch (err) {
            console.warn('Role check failed, denying access as a safety measure:', err);
            alert('Access denied: could not verify permissions.');
            try { window.location.href = '/'; } catch (e) { /* ignore */ }
            return;
        }

        // Determine super-admin status from admins collection or owner emails
        let isSuperAdmin = false;
        try {
            const adminRef = doc(db, 'admins', email);
            const adminDoc = await getDoc(adminRef);
            isSuperAdmin = (adminDoc.exists() && adminDoc.data().isSuperAdmin) || OWNER_EMAILS.includes(email) || (email === 'hamza.datashare@gmail.com');
        } catch (err) {
            console.warn('Could not determine admin status on auth change:', err);
        }

        // Reveal super-admin links if applicable
        if (isSuperAdmin) {
            document.getElementById('superAdminLinks')?.classList.remove('hidden');
        }

        // Call setupUI to finish initializing the control panel UI
        try {
            await setupUI(user, isSuperAdmin);
        } catch (err) {
            console.error('Error running setupUI on auth change:', err);
        }
    } catch (e) {
        console.error('Unexpected error in auth listener:', e);
    }
});

// ============================================================================
// PRODUCT MANAGEMENT FUNCTIONS
// ============================================================================

let uploadedImageUrl = null;

// Open/Close Product Modal
function openAddProductModal() {
    document.getElementById('addProductModal').classList.remove('hidden');
    document.getElementById('addProductForm').reset();
    uploadedImageUrl = null;
    clearImagePreview();
}

function closeAddProductModal() {
    document.getElementById('addProductModal').classList.add('hidden');
    document.getElementById('addProductForm').reset();
    uploadedImageUrl = null;
    clearImagePreview();
}

function closeProductDetailsModal() {
    console.log('Closing product details modal');
    const modal = document.getElementById('productDetailsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.setProperty('display', 'none', 'important');
    }
}

// Open Edit Product Modal
function openEditProductModal() {
    closeProductDetailsModal();
    
    const product = window.currentProduct;
    const productId = window.currentProductId;
    
    if (!product || !productId) {
        alert('Error: Product data not found');
        return;
    }
    
    // Populate translation fields
    document.getElementById('editProductNameEn').value = product.name_en || product.name || '';
    document.getElementById('editProductNameUr').value = product.name_ur || '';
    document.getElementById('editProductCategoryEn').value = product.category_en || product.category || '';
    document.getElementById('editProductCategoryUr').value = product.category_ur || '';
    document.getElementById('editProductDescriptionEn').value = product.description_en || product.description || '';
    document.getElementById('editProductDescriptionUr').value = product.description_ur || '';
    
    // Populate other form fields
    document.getElementById('editProductPrice').value = product.price || '';
    document.getElementById('editProductSubCategory').value = product.subCategory || '';
    document.getElementById('editProductSKU').value = product.sku || '';
    document.getElementById('editProductBrand').value = product.brand || '';
    document.getElementById('editProductRating').value = product.rating || '';
    document.getElementById('editProductLink').value = product.productLink || '';
    document.getElementById('editDownloadLink').value = product.downloadLink || '';
    document.getElementById('editDownloadLabel').value = product.downloadLabel || '';
    
    // Handle tags
    if (product.tags && Array.isArray(product.tags)) {
        document.getElementById('editProductTags').value = product.tags.join(', ');
    }
    
    // Handle specifications
    if (product.specifications && typeof product.specifications === 'object') {
        document.getElementById('editProductSpecs').value = JSON.stringify(product.specifications, null, 2);
    }
    
    // Handle stock (select or custom)
    const stockSelect = document.getElementById('editProductStock');
    if (product.stock === -1) {
        stockSelect.value = '-1';
        document.getElementById('editProductStockCustom').style.display = 'none';
    } else if ([0, 1, 5, 10, 25, 50, 100].includes(product.stock)) {
        stockSelect.value = String(product.stock);
        document.getElementById('editProductStockCustom').style.display = 'none';
    } else {
        stockSelect.value = 'custom';
        document.getElementById('editProductStockCustom').value = product.stock || '';
        document.getElementById('editProductStockCustom').style.display = 'block';
    }
    
    // Handle image (URL vs File)
    if (product.image && product.image.startsWith('data:')) {
        // Binary data, can't easily show in file input
        document.querySelector('input[name="editImageType"][value="url"]').checked = true;
        document.getElementById('editProductImageUrl').value = '';
        document.getElementById('editImageUrlGroup').style.display = 'block';
        document.getElementById('editImageFileGroup').style.display = 'none';
    } else {
        document.querySelector('input[name="editImageType"][value="url"]').checked = true;
        document.getElementById('editProductImageUrl').value = product.image || '';
        document.getElementById('editImageUrlGroup').style.display = 'block';
        document.getElementById('editImageFileGroup').style.display = 'none';
    }
    
    // Show preview of current image
    if (product.image) {
        const preview = document.getElementById('editImagePreview');
        const previewImg = document.getElementById('editPreviewImage');
        previewImg.src = product.image;
        preview.classList.remove('hidden');
    }
    
    // Show edit modal
    const modal = document.getElementById('editProductModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
    }
}

// Close Edit Product Modal
function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.setProperty('display', 'none', 'important');
    }
}

// Handle Image Type Toggle for Edit Form
document.addEventListener('DOMContentLoaded', () => {
    const editImageTypeRadios = document.querySelectorAll('input[name="editImageType"]');
    editImageTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const imageUrlInput = document.getElementById('editProductImageUrl');
            const imageFileInput = document.getElementById('editProductImageFile');
            const imageUrlGroup = document.getElementById('editImageUrlGroup');
            const imageFileGroup = document.getElementById('editImageFileGroup');
            
            if (e.target.value === 'url') {
                imageUrlGroup.style.display = 'block';
                imageFileGroup.style.display = 'none';
                imageFileInput.value = '';
            } else {
                imageUrlGroup.style.display = 'none';
                imageFileGroup.style.display = 'block';
                imageUrlInput.value = '';
            }
        });
    });

    // Stock select change handler for edit form
    const editStockSelect = document.getElementById('editProductStock');
    if (editStockSelect) {
        editStockSelect.addEventListener('change', (e) => {
            const customInput = document.getElementById('editProductStockCustom');
            if (e.target.value === 'custom') {
                customInput.style.display = 'block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
            }
        });
    }

    // Edit image file change handler
    const editImageFileInput = document.getElementById('editProductImageFile');
    if (editImageFileInput) {
        editImageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size exceeds 5MB limit');
                    e.target.value = '';
                    return;
                }

                // Preview image
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('editImagePreview');
                    const previewImg = document.getElementById('editPreviewImage');
                    previewImg.src = event.target.result;
                    preview.classList.remove('hidden');
                    uploadedImageUrl = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Stock select change handler for add form
    const addFormStockSelect = document.getElementById('productStock');
    if (addFormStockSelect) {
        addFormStockSelect.addEventListener('change', (e) => {
            const customInput = document.getElementById('productStockCustom');
            if (e.target.value === 'custom') {
                customInput.style.display = 'block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
            }
        });
    }

    // Edit form submission
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateProduct();
        });
    }

    // Add product form handling
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addProduct();
        });
    }

    // Image type toggle for add form
    const imageTypeRadios = document.querySelectorAll('input[name="imageType"]');
    imageTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const imageUrlInput = document.getElementById('productImageUrl');
            const imageFileInput = document.getElementById('productImageFile');
            
            if (e.target.value === 'url') {
                imageUrlInput.disabled = false;
                imageFileInput.disabled = true;
                imageFileInput.value = '';
            } else {
                imageUrlInput.disabled = true;
                imageUrlInput.value = '';
                imageFileInput.disabled = false;
            }
        });
    });

    // Image file change handler
    const imageFileInput = document.getElementById('productImageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size exceeds 5MB limit');
                    e.target.value = '';
                    return;
                }

                // Preview image
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('imagePreview');
                    const previewImg = document.getElementById('previewImg');
                    previewImg.src = event.target.result;
                    preview.classList.remove('hidden');
                    uploadedImageUrl = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Clear Image Preview
function clearImagePreview() {
    // Clear add form image preview
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const productImageFile = document.getElementById('productImageFile');
    
    if (imagePreview) imagePreview.classList.add('hidden');
    if (previewImg) previewImg.src = '';
    if (productImageFile) productImageFile.value = '';
    
    // Clear edit form image preview
    const editImagePreview = document.getElementById('editImagePreview');
    const editPreviewImg = document.getElementById('editPreviewImage');
    const editProductImageFile = document.getElementById('editProductImageFile');
    
    if (editImagePreview) editImagePreview.classList.add('hidden');
    if (editPreviewImg) editPreviewImg.src = '';
    if (editProductImageFile) editProductImageFile.value = '';
    
    uploadedImageUrl = null;
}

// Add Product to Firestore
async function addProduct() {
    try {
        // Translation fields
        const name_en = document.getElementById('productNameEn').value;
        const name_ur = document.getElementById('productNameUr').value;
        const category_en = document.getElementById('productCategoryEn').value;
        const category_ur = document.getElementById('productCategoryUr').value;
        const description_en = document.getElementById('productDescriptionEn').value;
        const description_ur = document.getElementById('productDescriptionUr').value;
        
        // Use English name as default fallback
        const name = name_en || name_ur;
        const category = category_en || category_ur;
        const price = parseFloat(document.getElementById('productPrice').value);
        const subCategory = document.getElementById('productSubCategory').value;
        const tagsInput = document.getElementById('productTags').value;
        const sku = document.getElementById('productSKU').value;
        const brand = document.getElementById('productBrand').value;
        
        // Handle stock - can be unlimited (-1) or a number
        let stock = 0;
        const stockSelect = document.getElementById('productStock');
        if (stockSelect.value === 'custom') {
            stock = parseInt(document.getElementById('productStockCustom').value) || 0;
        } else {
            stock = parseInt(stockSelect.value) || 0;
        }
        
        const rating = parseFloat(document.getElementById('productRating').value) || 0;
        const specsInput = document.getElementById('productSpecs').value;
        const productLink = document.getElementById('productLink').value;
        const downloadLink = document.getElementById('productDownloadLink').value;
        const downloadLabel = document.getElementById('productDownloadLabel').value || 'Download';

        // Determine image
        let image = null;
        const imageType = document.querySelector('input[name="imageType"]:checked').value;
        
        if (imageType === 'url') {
            image = document.getElementById('productImageUrl').value;
        } else if (uploadedImageUrl) {
            image = uploadedImageUrl;
        }

        // Parse tags
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

        // Parse specifications
        let specs = {};
        if (specsInput) {
            try {
                specs = JSON.parse(specsInput);
            } catch (err) {
                alert('Invalid JSON in specifications field');
                return;
            }
        }

        // Create product object with translation fields
        const product = {
            // Fallback fields for compatibility
            name,
            category,
            description_en: description_en || null,
            description_ur: description_ur || null,
            // Translation-specific fields (Strategy 1: Language-specific field names)
            name_en: name_en || null,
            name_ur: name_ur || null,
            category_en: category_en || null,
            category_ur: category_ur || null,
            // Other fields
            price,
            subCategory: subCategory || null,
            tags,
            image: image || null,
            sku: sku || null,
            brand: brand || null,
            stock,
            rating,
            specifications: specs,
            productLink: productLink || null,
            downloadLink: downloadLink || null,
            downloadLabel: downloadLabel || 'Download',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: auth.currentUser?.email || 'unknown'
        };

        // Add to Firestore
        const productsCollection = collection(db, 'products');
        const docRef = await addDoc(productsCollection, product);

        console.log('Product added successfully with translations:', docRef.id);
        alert('✅ Product added successfully with translations!');

        // Close modal and reload products
        closeAddProductModal();
        loadControlPanelProducts();

    } catch (error) {
        console.error('Error adding product:', error);
        alert(`❌ Error adding product: ${error.message}`);
    }
}

// Update Product
async function updateProduct() {
    try {
        const productId = window.currentProductId;
        if (!productId) {
            alert('Error: Product ID not found');
            return;
        }

        // Translation fields
        const name_en = document.getElementById('editProductNameEn').value;
        const name_ur = document.getElementById('editProductNameUr').value;
        const category_en = document.getElementById('editProductCategoryEn').value;
        const category_ur = document.getElementById('editProductCategoryUr').value;
        const description_en = document.getElementById('editProductDescriptionEn').value;
        const description_ur = document.getElementById('editProductDescriptionUr').value;
        
        // Use English name as default fallback
        const name = name_en || name_ur;
        const category = category_en || category_ur;
        const price = parseFloat(document.getElementById('editProductPrice').value);
        const description = description_en || description_ur;
        const subCategory = document.getElementById('editProductSubCategory').value;
        const tagsInput = document.getElementById('editProductTags').value;
        const sku = document.getElementById('editProductSKU').value;
        const brand = document.getElementById('editProductBrand').value;
        const rating = parseFloat(document.getElementById('editProductRating').value) || 0;
        const specsInput = document.getElementById('editProductSpecs').value;
        const productLink = document.getElementById('editProductLink').value;
        const downloadLink = document.getElementById('editDownloadLink').value;
        const downloadLabel = document.getElementById('editDownloadLabel').value || 'Download';

        // Handle stock - can be unlimited (-1) or a number
        let stock = 0;
        const stockSelect = document.getElementById('editProductStock');
        if (stockSelect.value === 'custom') {
            stock = parseInt(document.getElementById('editProductStockCustom').value) || 0;
        } else {
            stock = parseInt(stockSelect.value) || 0;
        }

        // Determine image
        let image = window.currentProduct.image;
        const imageType = document.querySelector('input[name="editImageType"]:checked').value;
        
        if (imageType === 'url') {
            const imageUrl = document.getElementById('editProductImageUrl').value;
            if (imageUrl) {
                image = imageUrl;
            }
        } else if (uploadedImageUrl) {
            image = uploadedImageUrl;
        }

        // Parse tags
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

        // Parse specifications
        let specs = {};
        if (specsInput) {
            try {
                specs = JSON.parse(specsInput);
            } catch (err) {
                alert('Invalid JSON in specifications field');
                return;
            }
        }

        // Create updated product object with translation fields
        const updatedProduct = {
            // Fallback fields for compatibility
            name,
            category,
            description: description || null,
            // Translation-specific fields (Strategy 1: Language-specific field names)
            name_en: name_en || null,
            name_ur: name_ur || null,
            category_en: category_en || null,
            category_ur: category_ur || null,
            description_en: description_en || null,
            description_ur: description_ur || null,
            // Other fields
            price,
            subCategory: subCategory || null,
            tags,
            image: image || null,
            sku: sku || null,
            brand: brand || null,
            stock,
            rating,
            specifications: specs,
            productLink: productLink || null,
            downloadLink: downloadLink || null,
            downloadLabel: downloadLabel || 'Download',
            updatedAt: new Date(),
            updatedBy: auth.currentUser?.email || 'unknown'
        };

        // Update in Firestore
        const productDocRef = doc(db, 'products', productId);
        await updateDoc(productDocRef, updatedProduct);

        console.log('Product updated successfully with translations:', productId);
        alert('✅ Product updated successfully with translations!');

        // Close modal and reload products
        closeEditProductModal();
        loadControlPanelProducts();

    } catch (error) {
        console.error('Error updating product:', error);
        alert(`❌ Error updating product: ${error.message}`);
    }
}

// Load Products for Control Panel
async function loadControlPanelProducts() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;

    try {
        productsList.innerHTML = '<div class="loading">Loading products...</div>';

        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            productsList.innerHTML = '<p class="no-products">No products yet. Add one to get started!</p>';
            return;
        }

        productsList.innerHTML = '';

        snapshot.forEach(doc => {
            const product = doc.data();
            const createdDate = product.createdAt?.toDate?.() || new Date();
            const dateStr = new Date(createdDate).toLocaleDateString();

            const productCard = document.createElement('div');
            productCard.className = 'product-control-card';
            productCard.style.cursor = 'pointer';
            
            // Set onclick handler with error handling
            productCard.onclick = function(e) {
                console.log('Product card clicked:', doc.id, product);
                if (e.target.closest('.product-card-actions')) {
                    console.log('Click was on action buttons, ignoring');
                    return;
                }
                showProductDetails(doc.id, product);
            };
            
            productCard.innerHTML = `
                <div class="product-card-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div class="no-image">No Image</div>'}
                </div>
                <div class="product-card-info">
                    <h3>${product.name}</h3>
                    <p class="product-card-price">${formatPrice(product.price || 0)}</p>
                    <p class="product-card-category">
                        <strong>Category:</strong> ${product.category}
                        ${product.subCategory ? ` > ${product.subCategory}` : ''}
                    </p>
                    <p class="product-card-description">${product.description || 'No description'}</p>
                    <div class="product-card-meta">
                        <span><strong>SKU:</strong> ${product.sku || 'N/A'}</span>
                        <span><strong>Brand:</strong> ${product.brand || 'N/A'}</span>
                        <span><strong>Stock:</strong> ${product.stock === -1 ? 'Unlimited' : (product.stock || 0)}</span>
                        <span><strong>Rating:</strong> ${product.rating ? product.rating + '/5' : 'N/A'}</span>
                    </div>
                    ${product.tags && product.tags.length > 0 ? `
                        <div class="product-card-tags">
                            ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <p class="product-card-date">Added: ${dateStr} by ${product.createdBy}</p>
                </div>
                <div class="product-card-actions" onclick="event.stopPropagation();">
                    <button onclick="editProduct('${doc.id}')" class="edit-btn" title="Edit Product">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                    </button>
                    <button onclick="deleteProduct('${doc.id}', '${product.name}')" class="delete-btn" title="Delete Product">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
                        </svg>
                    </button>
                </div>
            `;
            productsList.appendChild(productCard);
        });

    } catch (error) {
        console.error('Error loading products:', error);
        productsList.innerHTML = '<p class="error">Error loading products</p>';
    }
}

// Show Product Details Modal
function showProductDetails(productId, product) {
    try {
        console.log('showProductDetails called with:', productId, product);
        
        const modal = document.getElementById('productDetailsModal');
        if (!modal) {
            console.error('Modal element #productDetailsModal not found!');
            alert('Error: Product details modal not found. Please refresh the page.');
            return;
        }
        
        console.log('Modal found, populating details...');
        
        // Helper function to safely set text content
        const setTextContent = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
            else console.warn(`Element #${id} not found`);
        };
        
        // Helper function to safely set value
        const setElementContent = (id, value, type = 'text') => {
            const el = document.getElementById(id);
            if (!el) {
                console.warn(`Element #${id} not found`);
                return;
            }
            if (type === 'text') {
                el.textContent = value;
            } else if (type === 'html') {
                el.innerHTML = value;
            }
        };
        
        // Store current product ID for editing
        window.currentProductId = productId;
        window.currentProduct = product;
        
        // Set basic info
        setTextContent('detailsProductName', product.name || 'Unknown Product');
        setTextContent('detailsName', product.name || '');
        
        const priceValue = product.price ? parseFloat(product.price) : 0;
        console.log('control.js - Product price:', product.price, 'Parsed as:', priceValue);
        const formattedPriceCtrl = formatPrice(priceValue);
        console.log('control.js - Formatted price:', formattedPriceCtrl);
        setTextContent('detailsPrice', formattedPriceCtrl);
        console.log('control.js - Price element content:', document.getElementById('detailsPrice')?.textContent);
        setTextContent('detailsCategory', product.category || 'N/A');
        
        // Set product image
        const imgElement = document.getElementById('detailsProductImage');
        if (imgElement) {
            if (product.image) {
                imgElement.src = product.image;
                imgElement.style.display = 'block';
            } else {
                imgElement.style.display = 'none';
            }
        }

        // Set optional fields with conditional display
        const setOptionalField = (id, rowId, value) => {
            const el = document.getElementById(id);
            const row = document.getElementById(rowId);
            if (el && row) {
                if (value) {
                    el.textContent = value;
                    row.style.display = 'flex';
                } else {
                    row.style.display = 'none';
                }
            }
        };

        setOptionalField('detailsSubCategory', 'subCategoryRow', product.subCategory);
        setOptionalField('detailsBrand', 'brandRow', product.brand);
        setOptionalField('detailsSKU', 'skuRow', product.sku);
        
        const stockRow = document.getElementById('stockRow');
        const stockEl = document.getElementById('detailsStock');
        let stockValue = null;
        if (product.stock !== undefined && product.stock !== null) {
            stockValue = parseInt(product.stock, 10); // Explicitly use base 10 for parseInt
        }
        console.log('control.js - Stock value:', product.stock, 'Parsed as:', stockValue, 'Type:', typeof stockValue);
        console.log('control.js - stockValue === -1?', stockValue === -1);
        
        if (stockValue === -1) {
            // Unlimited stock
            console.log('control.js - Setting stock to Unlimited');
            if (stockEl) {
                stockEl.textContent = 'Unlimited';
                console.log('control.js - Stock element:', stockEl.textContent);
            }
            if (stockRow) stockRow.style.display = 'flex';
        } else if (stockValue !== null && stockValue >= 0) {
            // Specific stock amount
            console.log('control.js - Setting stock to', stockValue, 'units');
            if (stockEl) {
                stockEl.textContent = `${stockValue} units`;
                console.log('control.js - Stock element:', stockEl.textContent);
            }
            if (stockRow) stockRow.style.display = 'flex';
        } else {
            // No stock info
            console.log('control.js - Hiding stock row (no valid value)');
            if (stockRow) stockRow.style.display = 'none';
        }

        setOptionalField('detailsRating', 'ratingRow', product.rating ? `${product.rating}/5 ⭐` : null);
        
        const descRow = document.getElementById('descriptionRow');
        const descEl = document.getElementById('detailsDescription');
        if (product.description) {
            if (descEl) descEl.textContent = product.description;
            if (descRow) descRow.style.display = 'flex';
        } else if (descRow) {
            descRow.style.display = 'none';
        }

        // Set tags
        const tagsRow = document.getElementById('tagsRow');
        const tagsContainer = document.getElementById('detailsTags');
        if (product.tags && product.tags.length > 0 && tagsContainer && tagsRow) {
            tagsContainer.innerHTML = product.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            tagsRow.style.display = 'flex';
        } else if (tagsRow) {
            tagsRow.style.display = 'none';
        }

        // Set specifications
        const specsRow = document.getElementById('specsRow');
        const specsContainer = document.getElementById('detailsSpecs');
        if (product.specifications && Object.keys(product.specifications).length > 0 && specsContainer && specsRow) {
            const specsHTML = Object.entries(product.specifications)
                .map(([key, value]) => `<div class="spec-item"><strong>${key}:</strong> ${value}</div>`)
                .join('');
            specsContainer.innerHTML = specsHTML;
            specsRow.style.display = 'flex';
        } else if (specsRow) {
            specsRow.style.display = 'none';
        }

        // Set product link button
        const productLinkBtn = document.getElementById('productLinkBtn');
        if (productLinkBtn) {
            if (product.productLink) {
                productLinkBtn.href = product.productLink;
                productLinkBtn.style.display = 'inline-block';
            } else {
                productLinkBtn.style.display = 'none';
            }
        }

        // Set download link button
        const downloadLinkBtn = document.getElementById('downloadLinkBtn');
        const downloadBtnLabel = document.getElementById('downloadBtnLabel');
        if (downloadLinkBtn) {
            if (product.downloadLink) {
                downloadLinkBtn.href = product.downloadLink;
                downloadLinkBtn.download = true;
                if (downloadBtnLabel) {
                    downloadBtnLabel.textContent = `📥 ${product.downloadLabel || 'Download'}`;
                }
                downloadLinkBtn.style.display = 'inline-block';
            } else {
                downloadLinkBtn.style.display = 'none';
            }
        }

        // Show modal
        console.log('Removing hidden class from modal');
        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
        console.log('Modal should now be visible. Classes:', modal.className, 'Display:', modal.style.display);
    } catch (error) {
        console.error('Error in showProductDetails:', error);
        alert('Error displaying product details: ' + error.message);
    }
}

// Delete Product
async function deleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
        return;
    }

    try {
        await deleteDoc(doc(db, 'products', productId));
        console.log('Product deleted successfully');
        alert('✅ Product deleted successfully!');
        loadControlPanelProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert(`❌ Error deleting product: ${error.message}`);
    }
}

// ============================================================================
// PRODUCT REPORTS FUNCTIONS
// ============================================================================

let allReports = [];

// Load all reports from Firestore
async function loadReports() {
    const reportsList = document.getElementById('reportsList');
    if (!reportsList) {
        console.log('Reports list element not found');
        return;
    }

    try {
        console.log('Loading reports...');
        reportsList.innerHTML = '<div class="loading">Loading reports...</div>';

        // Fetch all reports - simple query without orderBy for Firebase emulator compatibility
        const q = query(collection(db, 'reports'));

        const snapshot = await getDocs(q);
        console.log('Reports snapshot received. Document count:', snapshot.size);
        console.log('Snapshot empty?', snapshot.empty);

        allReports = [];
        snapshot.forEach(docSnap => {
            const report = docSnap.data();
            console.log('Processing report document:', docSnap.id);
            console.log('Report data structure:', Object.keys(report));
            console.log('Full report data:', JSON.stringify(report, null, 2));
            
            let reportTimestamp = new Date();
            if (report.timestamp) {
                if (typeof report.timestamp?.toDate === 'function') {
                    reportTimestamp = report.timestamp.toDate();
                } else if (typeof report.timestamp === 'number') {
                    reportTimestamp = new Date(report.timestamp);
                } else if (report.timestamp instanceof Date) {
                    reportTimestamp = report.timestamp;
                }
            }
            
            const reportObj = {
                id: docSnap.id,
                ...report,
                timestamp: reportTimestamp
            };
            
            console.log('Adding report to allReports:', reportObj);
            allReports.push(reportObj);
        });

        console.log('Total reports loaded:', allReports.length);
        console.log('allReports array:', allReports);
        
        // Sort by timestamp descending (in case orderBy didn't work)
        allReports.sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
            const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
            return timeB - timeA;
        });
        
        displayReports(allReports);
    } catch (error) {
        console.error('Error loading reports:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        reportsList.innerHTML = '<p class="error">Error loading reports: ' + error.message + '</p>';
    }
}

// Display reports in the list
function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    if (!reportsList) {
        console.log('reportsList element not found in displayReports');
        return;
    }

    console.log('displayReports called with', reports.length, 'reports');
    reportsList.innerHTML = '';

    if (!reports || reports.length === 0) {
        console.log('No reports to display');
        reportsList.innerHTML = '<p class="no-reports">No reports found</p>';
        return;
    }

    reports.forEach(report => {
        console.log('Rendering report:', report.id, report);
        
        let dateStr = 'Unknown date';
        try {
            let timestamp = report.timestamp;
            if (!timestamp) {
                dateStr = 'No date';
            } else if (timestamp instanceof Date) {
                dateStr = timestamp.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else if (typeof timestamp === 'number') {
                dateStr = new Date(timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else {
                dateStr = String(timestamp).substring(0, 16);
            }
        } catch (e) {
            console.warn('Error formatting date:', e);
            dateStr = 'Invalid date';
        }

        const reasonDisplay = {
            'inappropriate': '🚫 Inappropriate Content',
            'fake': '❌ Fake/Counterfeit',
            'misleading': '⚠️ Misleading Info',
            'broken_link': '🔗 Broken Link',
            'spam': '📧 Spam',
            'offensive': '😤 Offensive',
            'other': '❓ Other'
        };

        const statusBadge = {
            'pending': '<span class="badge badge-warning">Pending</span>',
            'reviewed': '<span class="badge badge-info">Reviewed</span>',
            'resolved': '<span class="badge badge-success">Resolved</span>',
            'dismissed': '<span class="badge badge-secondary">Dismissed</span>'
        };

        const productName = escapeHtml(report.productName || 'Unknown Product');
        const productId = escapeHtml(report.productId || 'N/A');
        const productCategory = escapeHtml(report.productCategory || 'N/A');
        const userEmail = escapeHtml(report.userEmail || 'Unknown User');
        const reportReason = reasonDisplay[report.reason] || escapeHtml(report.reason || 'Unknown');
        const reportDetails = report.details ? escapeHtml(report.details) : '';
        const reportStatus = statusBadge[report.status] || '<span class="badge badge-warning">Pending</span>';
        
        console.log('Rendering report - Name:', productName, 'ID:', productId, 'Status:', report.status);

        const reportHtml = `
            <div class="report-item">
                <div class="report-header">
                    <div class="report-title">
                        <h3>${productName}</h3>
                        ${reportStatus}
                    </div>
                    <div class="report-date">${dateStr}</div>
                </div>
                <div class="report-details">
                    <div class="detail-row">
                        <span class="label">Product ID:</span>
                        <span class="value">${productId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Category:</span>
                        <span class="value">${productCategory}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Reason:</span>
                        <span class="value">${reportReason}</span>
                    </div>
                    ${reportDetails ? `
                        <div class="detail-row">
                            <span class="label">Details:</span>
                            <span class="value description">${reportDetails}</span>
                        </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="label">Reported By:</span>
                        <span class="value">${userEmail}</span>
                    </div>
                </div>
                <div class="report-actions">
                    <button onclick="markReportStatus('${report.id}', 'reviewed')" class="action-btn btn-primary" ${report.status === 'reviewed' ? 'disabled' : ''}>✓ Mark Reviewed</button>
                    <button onclick="markReportStatus('${report.id}', 'resolved')" class="action-btn btn-success" ${report.status === 'resolved' ? 'disabled' : ''}>✓ Resolve</button>
                    <button onclick="markReportStatus('${report.id}', 'dismissed')" class="action-btn btn-secondary" ${report.status === 'dismissed' ? 'disabled' : ''}>✗ Dismiss</button>
                    <button onclick="deleteReport('${report.id}')" class="action-btn btn-danger">🗑️ Delete</button>
                </div>
            </div>
        `;

        reportsList.innerHTML += reportHtml;
    });
    
    console.log('Finished rendering all reports');
}

// Filter reports by status
function filterReports() {
    const statusFilter = document.getElementById('reportStatusFilter')?.value || '';
    console.log('Filtering reports by status:', statusFilter);
    
    if (statusFilter === '') {
        console.log('No filter, displaying all', allReports.length, 'reports');
        displayReports(allReports);
    } else {
        const filtered = allReports.filter(r => r.status === statusFilter);
        console.log('Filtered to', filtered.length, 'reports with status:', statusFilter);
        displayReports(filtered);
    }
}

// Update report status
async function markReportStatus(reportId, status) {
    console.log('markReportStatus called for', reportId, 'with status:', status);
    try {
        const reportRef = doc(db, 'reports', reportId);
        await updateDoc(reportRef, {
            status: status,
            updatedAt: new Date(),
            updatedBy: auth.currentUser?.email || 'unknown'
        });
        console.log(`Report ${reportId} marked as ${status}`);
        await loadReports();
    } catch (error) {
        console.error('Error updating report status:', error);
        alert('Error updating report status: ' + error.message);
    }
}

// Delete a report
async function deleteReport(reportId) {
    console.log('deleteReport called for', reportId);
    if (!confirm('Are you sure you want to delete this report?')) {
        return;
    }

    try {
        await deleteDoc(doc(db, 'reports', reportId));
        console.log('Report deleted successfully');
        await loadReports();
    } catch (error) {
        console.error('Error deleting report:', error);
        alert('Error deleting report: ' + error.message);
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]) || '';
}

// Edit Product (placeholder - can be expanded)
function editProduct(productId) {
    alert('Edit functionality coming soon!');
    // Can be implemented to open a pre-filled form
}

console.log('Exported functions:', Object.keys(exportedFunctions));

console.log('Control panel script loaded successfully');
console.log('Exported functions:', Object.keys(window).filter(k =>
    ['openAddModeratorModal', 'openAddSuperAdminModal', 'openAddAdminModal', 'openAddProductModal'].includes(k)
));

// Expose report functions to window
window.loadReports = loadReports;
window.filterReports = filterReports;
window.markReportStatus = markReportStatus;
window.deleteReport = deleteReport;