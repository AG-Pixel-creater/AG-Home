import { auth } from './firebase-config.js';
import { getFirestore, collection, query, getDocs, addDoc, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import roleManager, { ROLES, OWNER_EMAILS } from './role-manager.js';

const db = getFirestore();

function setupFormHandlers() {
    setupModeratorForm();
    setupSuperAdminForm();
    setupChatHandlers();
    setupModalHandlers();
}

function setupModeratorForm() {
    const form = document.getElementById('addModeratorForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const emailInput = document.getElementById('moderatorEmail');
            if (!emailInput) throw new Error('Moderator email input not found');
            const email = emailInput.value.trim().toLowerCase();
            if (!email || !email.includes('@')) throw new Error('Please enter a valid email address');
            await roleManager.assignRole(auth.currentUser, email, ROLES.MODERATOR);
            emailInput.value = '';
            window.closeAddModeratorModal?.();
            alert('Moderator added successfully');
            await Promise.all([window.loadModerators?.(), window.loadModeratorList?.(), window.loadUsers?.()]);
        } catch (err) { console.error('Error adding moderator:', err); alert(err.message || 'Failed to add moderator'); }
    });
}

function setupSuperAdminForm() {
    const form = document.getElementById('addSuperAdminForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const emailInput = document.getElementById('superAdminEmail');
            if (!emailInput) throw new Error('Email input not found');
            const email = emailInput.value.trim().toLowerCase();
            if (!email || !email.includes('@')) throw new Error('Please enter a valid email address');
            await roleManager.assignRole(auth.currentUser, email, ROLES.SUPER_ADMIN);
            emailInput.value = '';
            window.closeAddSuperAdminModal?.();
            alert('Super Admin added successfully');
            await Promise.all([window.loadSuperAdmins?.(), window.loadUsers?.()]);
        } catch (err) { console.error('Error adding super admin:', err); alert(err.message || 'Failed to add super admin'); }
    });
}

function setupModalHandlers() {
    document.getElementById('addModeratorModal')?.addEventListener('click', (e) => { if (e.target.id === 'addModeratorModal') window.closeAddModeratorModal?.(); });
    document.getElementById('addSuperAdminModal')?.addEventListener('click', (e) => { if (e.target.id === 'addSuperAdminModal') window.closeAddSuperAdminModal?.(); });
}

function setupNavigationHandlers() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href')?.startsWith('#')) { e.preventDefault(); const section = link.getAttribute('data-section'); if (section) showSection(section); }
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => { section.classList.remove('active'); section.classList.add('hidden'); });
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const targetSection = document.getElementById(`${sectionId}-section`);
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetSection) {
        targetSection.classList.remove('hidden'); targetSection.classList.add('active');
        setTimeout(() => {
            switch (sectionId) {
                case 'admin-management':
                case 'admins': window.loadAdmins?.(); break;
                case 'moderator-management':
                case 'moderators': window.loadModerators?.(); break;
                case 'super-admin': window.loadSuperAdmins?.(); break;
                case 'messages': window.loadMessages?.(); break;
                case 'manage-all-ranks': loadUsers(); break;
                case 'chats': loadChats(); break;
                case 'product-management': window.loadControlPanelProducts?.(); break;
                case 'product-reports': window.loadReports?.(); break;
                case 'product-reports': window.loadReports?.(); break;
            }
        }, 100);
    }
    if (targetLink) targetLink.classList.add('active');
    try { history.replaceState(null, '', `#${sectionId}`); } catch (e) { /* ignore */ }
}

async function loadUsers() {
    const usersListEl = document.getElementById('usersList');
    const ownersListEl = document.getElementById('ownersList');
    const adminsListEl = document.getElementById('adminsListAll');
    const superAdminsListEl = document.getElementById('superAdminsListAll');
    const moderatorsListEl = document.getElementById('moderatorsListAll');
    if (!usersListEl && !ownersListEl && !adminsListEl && !moderatorsListEl) return;

    try {
        // Fetch all roles collections
        const [usersSnap, adminsSnap, modsSnap] = await Promise.all([
            getDocs(query(collection(db, 'users'))),
            getDocs(query(collection(db, 'admins'))),
            getDocs(query(collection(db, 'moderators')))
        ]);

        const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const admins = adminsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const moderators = modsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Force OWNER_EMAILS into owners list
        for (const ownerEmail of OWNER_EMAILS) {
            const normalized = String(ownerEmail).toLowerCase();
            if (!users.find(u => String(u.email || '').toLowerCase() === normalized)) users.push({ id: `owner-${normalized}`, email: normalized, role: ROLES.OWNER, createdAt: null });
        }

        // Build lookup sets to dedupe
        const ownerEmails = new Set(OWNER_EMAILS.map(e => String(e).toLowerCase()));
        const adminEmails = new Set(admins.map(a => String(a.email || '').toLowerCase()));
        const moderatorEmails = new Set(moderators.map(m => String(m.email || '').toLowerCase()));

        const owners = [];
        const remainingUsers = [];

        for (const user of users) {
            const email = String(user.email || '').toLowerCase();
            if (!email) continue;
            if (ownerEmails.has(email) || (user.role || '').toUpperCase() === ROLES.OWNER) {
                owners.push(user);
            } else if (adminEmails.has(email)) {
                // skip here; admins rendered from admins collection
            } else if (moderatorEmails.has(email)) {
                // skip here; moderators rendered separately
            } else {
                remainingUsers.push(user);
            }
        }

        // Render owners
        if (ownersListEl) ownersListEl.innerHTML = '';
        for (const user of owners) {
            const email = user.email;
            if (ownersListEl) ownersListEl.innerHTML += `
                <div class="owner-item">
                    <div class="Owner-info">
                        <div class="Owner-email">👑 ${email}</div>
                        <div class="Owner-meta">
                            <span class="owner">👑 Owner</span>
                            <span class="Owner-Add">Added by: System</span>
                            <span class="Owner-Add">Joined: From Start</span>
                            <span class="Owner-RN">Name: Muhammad Hamza Sabir</span>
                        </div>
                        <div class="Owner-actions">
                            <span class="protected-label">
                            Protected
                            </span>
                        </div>
                </div>`;
        }

        // Separate super-admins from regular admins
        const superAdmins = admins.filter(a => a.isSuperAdmin);
        const normalAdmins = admins.filter(a => !a.isSuperAdmin);

        // Render super admins
        if (superAdminsListEl) superAdminsListEl.innerHTML = '';
        for (const sa of superAdmins) {
            const email = sa.email;
            const addedDate = sa.addedAt || sa.createdAt || null;
            const dateStr = (window.formatDate || ((d) => 'N/A'))(addedDate);
            if (superAdminsListEl) superAdminsListEl.innerHTML += `
                <div class="super-admin-item">
                    <div class="super-admin-info">
                        <div class="super-admin-email">${email}</div>
                        <div class="super-admin-meta">
                        <span class="super-admin-type">
                            Super Admin
                        </span>
                            <span class="admin-date">Added: ${dateStr}</span>
                            <span class="admin-by">by: ${sa.addedBy || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="super-admin-actions">
                        <button onclick="showRolePicker('${sa.id}','${email}','SUPER_ADMIN', this)" class="demote-btn">Change Role</button>
                        <button onclick="removeSuperAdmin('${sa.id}')" class="remove-btn">Remove</button>
                    </div>
                </div>`;
        }

        // Render regular admins
        if (adminsListEl) adminsListEl.innerHTML = '';
        for (const a of normalAdmins) {
            const email = a.email;
            const addedDate = a.addedAt || a.createdAt || null;
            const dateStr = (window.formatDate || ((d) => 'N/A'))(addedDate);
            if (adminsListEl) adminsListEl.innerHTML += `
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${email}</div>
                        <div class="admin-meta">
                            <span class="admin-type regular">Admin</span>
                            <span class="admin-date">Added: ${dateStr}</span>
                            <span class="admin-by">by: ${a.addedBy || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="admin-actions">
                        <button onclick="showRolePicker('${a.id}','${email}','ADMIN', this)" class="role-btn">Change Role</button>
                        <button onclick="removeAdmin('${a.id}')" class="remove-btn">Remove</button>
                    </div>
                </div>`;
        }

        // Render moderators
        if (moderatorsListEl) moderatorsListEl.innerHTML = '';
        for (const m of moderators) {
            const email = m.email;
            const addedDate = m.addedAt || m.createdAt || null;
            if (moderatorsListEl) moderatorsListEl.innerHTML += `
                <div class="moderator-item">
                    <div class="moderator-info">
                        <div class="moderator-email">${email}</div>
                        <div class="moderator-meta">
                            <span class="moderator-type">Moderator</span>
                            <span class="moderator-date">Added: ${(window.formatDate || ((d) => 'N/A'))(addedDate)}</span>
                            <span class="moderator-by">by: ${m.addedBy || 'N/A'}
                        </div>
                    </div>
                    <div class="moderator-actions">
                    <button onclick="showRolePicker('${m.id || m.email}', '${email}', 'MODERATOR', this)" class="promote-btn">Change Role</button>
                        <button onclick="removeModerator('${m.id || m.email}')" class="remove-btn">Remove</button>
                    </div>
                </div>`;
        }

        // Render remaining users
        if (usersListEl) usersListEl.innerHTML = '';
        for (const user of remainingUsers) {
            const normalizedRole = (user.role || ROLES.USER).toUpperCase();
            let containerClass = 'user-item';
            switch (normalizedRole) { case ROLES.SUPER_ADMIN: containerClass = 'super-admin-item'; break; case ROLES.ADMIN: containerClass = 'admin-item'; break; case ROLES.MODERATOR: containerClass = 'moderator-item'; break; default: containerClass = 'user-item'; }
            const canManage = await roleManager.checkPermission(auth.currentUser, 'manage', normalizedRole);
            const showActions = canManage;
            if (usersListEl) usersListEl.innerHTML += `
                <div class="${containerClass}">
                    <div class="user-info">
                        <div class="user-email">${user.email}</div>
                        <div class="user-meta">
                            <span class="user-role ${normalizedRole.toLowerCase()}">${normalizedRole}</span>
                            <span class="user-date">Joined: ${(window.formatDate || ((d) => 'N/A'))(user.createdAt)}</span>
                        </div>
                    </div>
                    ${showActions ? `
                        <div class="user-actions">
                            <button onclick="showRolePicker('${user.id}','${user.email}','${normalizedRole}', this)" class="change-role-btn">Change Role</button>
                            <button onclick="deleteUser('${user.id}')" class="delete-btn">Delete</button>
                        </div>` : ''}
                </div>`;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        if (ownersListEl) ownersListEl.innerHTML = '';
        if (usersListEl) usersListEl.innerHTML = '<p class="error">Error loading users</p>';
        if (adminsListEl) adminsListEl.innerHTML = '<p class="error">Error loading admins</p>';
        if (moderatorsListEl) moderatorsListEl.innerHTML = '<p class="error">Error loading moderators</p>';
    }
}

// --------------------
// Global chat
// --------------------
let _chatUnsub = null;
async function loadChats() {
    const chatsList = document.getElementById('chatsList');
    if (!chatsList) return;

    // cleanup old listener
    if (_chatUnsub) { _chatUnsub(); _chatUnsub = null; }

    try {
        const q = query(collection(db, 'global_chat'), orderBy('timestamp', 'asc'));
        _chatUnsub = onSnapshot(q, (snapshot) => {
            chatsList.innerHTML = '';
            if (snapshot.empty) {
                chatsList.innerHTML = '<p class="no-messages">No messages yet</p>';
                return;
            }
            snapshot.forEach(docSnap => {
                const m = docSnap.data();
                const time = (window.formatDate || ((d) => 'N/A'))(m.timestamp);
                const sender = m.senderName || m.senderEmail || 'Anonymous';
                const text = m.text || '';
                const msgEl = document.createElement('div');
                msgEl.className = 'chat-message';
                msgEl.innerHTML = `
                    <div class="chat-meta"><strong class="chat-sender">${sender}</strong> <span class="chat-time">${time}</span></div>
                    <div class="chat-text">${escapeHtml(text)}</div>
                `;
                chatsList.appendChild(msgEl);
            });
            // scroll to bottom
            chatsList.scrollTop = chatsList.scrollHeight;
        }, (err) => {
            console.error('Error loading chats:', err);
            chatsList.innerHTML = '<p class="error">Error loading chat messages</p>';
        });
    } catch (err) {
        console.error('Error in loadChats:', err);
    }
}

function setupChatHandlers() {
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    if (!form || !input) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        if (!auth.currentUser) { alert('You must be signed in to chat'); return; }
        try {
            await addDoc(collection(db, 'global_chat'), {
                text,
                senderId: auth.currentUser.uid,
                senderName: auth.currentUser.email,
                timestamp: serverTimestamp()
            });
            input.value = '';
        } catch (err) {
            console.error('Error sending chat message:', err);
            alert(err.message || 'Failed to send message');
        }
    });
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"'`]/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' })[s]);
}

async function showRolePicker(userId, userEmail, currentRole, buttonEl) {
    try {
        document.querySelectorAll('.role-picker').forEach(el => el.remove());
        const picker = document.createElement('div');
        picker.className = 'role-picker';
        picker.style.position = 'absolute';
        picker.style.zIndex = 10000;
        picker.style.background = 'var(--container-bg, #fff)';
        picker.style.border = '1px solid var(--border-color, #ddd)';
        picker.style.padding = '8px';
        picker.style.borderRadius = '6px';
        picker.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';

        const select = document.createElement('select');
        select.setAttribute('aria-label', `Change role for ${userEmail}`);

        // Roles shown in the picker
        const roles = [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER];

        // Determine permission for current user to assign/manage each role
        const permissionChecks = await Promise.all(roles.map(r => roleManager.checkPermission(auth.currentUser, 'manage', r).then(Boolean).catch(() => false)));

        // Owner detection
        const currentUserEmail = auth.currentUser?.email?.toLowerCase();
        const currentUserIsOwner = currentUserEmail && OWNER_EMAILS.map(e => e.toLowerCase()).includes(currentUserEmail);

        // If the target is owner or super-admin, only owner can change those
        const targetIsOwner = OWNER_EMAILS.map(e => e.toLowerCase()).includes(String(userEmail || '').toLowerCase());

        // Build options with enabled/disabled state based on permissionChecks and special-case rules
        roles.forEach((r, idx) => {
            const opt = document.createElement('option');
            opt.value = r; opt.textContent = r.replace('_', ' ');
            if (r === currentRole) opt.selected = true;

            let allowed = permissionChecks[idx];

            // Disallow modifications to OWNER unless current user is owner
            if (r === ROLES.OWNER && !currentUserIsOwner) allowed = false;

            // Prevent non-owners from changing existing owners/super-admins (even if they could assign role elsewhere)
            if ((targetIsOwner || currentRole === ROLES.SUPER_ADMIN) && !currentUserIsOwner) {
                // if target is owner or currently super-admin, only owner may change
                allowed = false;
            }

            if (!allowed) opt.disabled = true;
            select.appendChild(opt);
        });

        const confirmBtn = document.createElement('button'); confirmBtn.textContent = 'Set'; confirmBtn.className = 'confirm-role-btn'; confirmBtn.style.marginLeft = '8px';
        const cancelBtn = document.createElement('button'); cancelBtn.textContent = 'Cancel'; cancelBtn.className = 'cancel-role-btn'; cancelBtn.style.marginLeft = '6px';

        picker.appendChild(select); picker.appendChild(confirmBtn); picker.appendChild(cancelBtn); document.body.appendChild(picker);
        const rect = buttonEl.getBoundingClientRect(); picker.style.top = `${rect.bottom + window.scrollY + 6}px`; picker.style.left = `${rect.left + window.scrollX}px`;

        confirmBtn.addEventListener('click', async () => {
            const chosen = select.value;
            try {
                // Quick client-side guard: ensure user is allowed to assign chosen role
                const canAssign = await roleManager.checkPermission(auth.currentUser, 'manage', chosen);
                if (!canAssign && !currentUserIsOwner) {
                    alert('You do not have permission to assign this role');
                    return;
                }

                // Prevent accidental owner/super admin changes when not owner
                if ((chosen === ROLES.OWNER || chosen === ROLES.SUPER_ADMIN) && !currentUserIsOwner) {
                    alert('Only owners can assign Owner or Super Admin roles');
                    return;
                }

                await window.setUserRole(userId, userEmail, chosen);
                picker.remove();
            } catch (err) {
                console.error('Error changing role via picker:', err);
                alert(err.message || 'Failed to change role');
            }
        });

        cancelBtn.addEventListener('click', () => picker.remove());
        const onDocClick = (e) => { if (!picker.contains(e.target) && e.target !== buttonEl) { picker.remove(); document.removeEventListener('click', onDocClick); } };
        setTimeout(() => document.addEventListener('click', onDocClick)); window._lastRolePicker = picker; return picker;
    } catch (err) { console.error('Error showing role picker:', err); }
}

window.showRolePicker = showRolePicker;

export { setupFormHandlers, setupNavigationHandlers, showSection, loadUsers };
