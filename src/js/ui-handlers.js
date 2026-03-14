import { auth } from './firebase-config.js';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import roleManager, { ROLES, OWNER_EMAILS } from './role-manager.js';

// Clean single-file implementation for ui handling
const db = getFirestore();

function setupFormHandlers() {
    setupModeratorForm();
    setupSuperAdminForm();
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
            // Full replacement content follows
            import { auth } from './firebase-config.js';
            import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
            import roleManager, { ROLES, OWNER_EMAILS } from './role-manager.js';

            const db = getFirestore();

            function setupFormHandlers() {
                setupModeratorForm();
                setupSuperAdminForm();
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
                        }
                    }, 100);
                }
                if (targetLink) targetLink.classList.add('active');
                try { history.replaceState(null, '', `#${sectionId}`); } catch (e) { /* ignore */ }
            }

            async function loadUsers() {
                const usersListEl = document.getElementById('usersList');
                const ownersListEl = document.getElementById('ownersList');
                if (!usersListEl && !ownersListEl) return;
                try {
                    const snapshot = await getDocs(query(collection(db, 'users')));
                    const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    for (const ownerEmail of OWNER_EMAILS) {
                        const normalized = String(ownerEmail).toLowerCase();
                        if (!users.find(u => String(u.email || '').toLowerCase() === normalized)) users.push({ id: `owner-${normalized}`, email: normalized, role: ROLES.OWNER, createdAt: null });
                    }
                    const owners = [];
                    const others = [];
                    for (const user of users) {
                        const normalizedEmail = String(user.email || '').toLowerCase();
                        const normalizedRole = (user.role || ROLES.USER).toUpperCase();
                        const isOwner = normalizedRole === ROLES.OWNER || OWNER_EMAILS.map(e => String(e).toLowerCase()).includes(normalizedEmail);
                        if (isOwner) owners.push({ ...user, normalizedRole }); else others.push({ ...user, normalizedRole });
                    }
                    if (ownersListEl) ownersListEl.innerHTML = '';
                    for (const user of owners) {
                        const containerClass = 'Owner-item';
                        const email = user.email;
                        if (ownersListEl) ownersListEl.innerHTML += `
                            <div class="${containerClass}">
                                <div class="user-info">
                                    <div class="user-email">${email}</div>
                                    <div class="user-meta">
                                        <span class="user-role owner">OWNER</span>
                                        <span class="user-date">Joined: ${formatDate(user.createdAt)}</span>
                                    </div>
                                </div>
                                <div class="user-actions"><span class="protected-label">Protected</span></div>
                            </div>`;
                    }
                    if (usersListEl) usersListEl.innerHTML = '';
                    for (const user of others) {
                        const normalizedRole = user.normalizedRole || (user.role || ROLES.USER).toUpperCase();
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
                                        <span class="user-date">Joined: ${formatDate(user.createdAt)}</span>
                                    </div>
                                </div>
                                ${showActions ? `
                                    <div class="user-actions">
                                        <button onclick="showRolePicker('${user.id}','${user.email}','${normalizedRole}', this)" class="change-role-btn">Change Role</button>
                                        <button onclick="deleteUser('${user.id}')" class="delete-btn">Delete</button>
                                    </div>` : ''}
                            </div>`;
                    }
                } catch (error) { console.error('Error loading users:', error); if (ownersListEl) ownersListEl.innerHTML = ''; if (usersListEl) usersListEl.innerHTML = '<p class="error">Error loading users</p>'; }
            }

            function showRolePicker(userId, userEmail, currentRole, buttonEl) {
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
                    const roles = [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER];
                    const currentUserEmail = auth.currentUser?.email?.toLowerCase();
                    const currentUserIsOwner = currentUserEmail && OWNER_EMAILS.map(e => e.toLowerCase()).includes(currentUserEmail);
                    for (const r of roles) { const opt = document.createElement('option'); opt.value = r; opt.textContent = r.replace('_', ' '); if (r === currentRole) opt.selected = true; if (r === ROLES.OWNER && !currentUserIsOwner) opt.disabled = true; select.appendChild(opt); }
                    const confirmBtn = document.createElement('button'); confirmBtn.textContent = 'Set'; confirmBtn.className = 'confirm-role-btn'; confirmBtn.style.marginLeft = '8px';
                    const cancelBtn = document.createElement('button'); cancelBtn.textContent = 'Cancel'; cancelBtn.className = 'cancel-role-btn'; cancelBtn.style.marginLeft = '6px';
                    picker.appendChild(select); picker.appendChild(confirmBtn); picker.appendChild(cancelBtn); document.body.appendChild(picker);
                    const rect = buttonEl.getBoundingClientRect(); picker.style.top = `${rect.bottom + window.scrollY + 6}px`; picker.style.left = `${rect.left + window.scrollX}px`;
                    confirmBtn.addEventListener('click', async () => { const chosen = select.value; try { await window.setUserRole(userId, userEmail, chosen); picker.remove(); } catch (err) { /* handled in setUserRole */ } });
                    cancelBtn.addEventListener('click', () => picker.remove());
                    const onDocClick = (e) => { if (!picker.contains(e.target) && e.target !== buttonEl) { picker.remove(); document.removeEventListener('click', onDocClick); } };
                    setTimeout(() => document.addEventListener('click', onDocClick)); window._lastRolePicker = picker; return picker;
                } catch (err) { console.error('Error showing role picker:', err); }
            }

            window.showRolePicker = showRolePicker;

            export { setupFormHandlers, setupNavigationHandlers, showSection, loadUsers };
        }
        }

        // Data Loading Functions
        async function loadUsers() {
            const usersListEl = document.getElementById('usersList');
            const ownersListEl = document.getElementById('ownersList');
            if (!usersListEl && !ownersListEl) return;

            try {
                // Load users from the users collection
                const snapshot = await getDocs(query(collection(db, 'users')));

                // Map firestore docs into a working users array
                const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                // Ensure owner emails are shown even if they don't exist in the users collection
                for (const ownerEmail of OWNER_EMAILS) {
                    const normalized = String(ownerEmail).toLowerCase();
                    if (!users.find(u => String(u.email || '').toLowerCase() === normalized)) {
                        users.push({ id: `owner-${normalized}`, email: normalized, role: ROLES.OWNER, createdAt: null });
                    }
                }

                const owners = [];
                const others = [];

                for (const user of users) {
                    const normalizedEmail = String(user.email || '').toLowerCase();
                    const normalizedRole = (user.role || ROLES.USER).toUpperCase();
                    const isOwner = normalizedRole === ROLES.OWNER || OWNER_EMAILS.map(e => String(e).toLowerCase()).includes(normalizedEmail);
                    if (isOwner) {
                        owners.push({ ...user, normalizedRole });
                    } else {
                        others.push({ ...user, normalizedRole });
                    }
                }

                // Render Owners first
                if (ownersListEl) ownersListEl.innerHTML = '';

                for (const user of owners) {
                    const containerClass = 'Owner-item';
                    const email = user.email;
                    if (ownersListEl) {
                        ownersListEl.innerHTML += `
                    <div class="${containerClass}">
                        <div class="user-info">
                            <div class="user-email">${email}</div>
                            <div class="user-meta">
                                <span class="user-role owner">OWNER</span>
                                <span class="user-date">Joined: ${formatDate(user.createdAt)}</span>
                            </div>
                        </div>
                        <div class="user-actions"><span class="protected-label">Protected</span></div>
                    </div>
                `;
                    }
                }

                // Now render other ranks into usersList
                if (usersListEl) usersListEl.innerHTML = '';

                for (const user of others) {
                    const normalizedRole = user.normalizedRole || (user.role || ROLES.USER).toUpperCase();

                    // Determine container class for CSS styling
                    let containerClass = 'user-item';
                    switch (normalizedRole) {
                        case ROLES.SUPER_ADMIN:
                            containerClass = 'super-admin-item';
                            break;
                        case ROLES.ADMIN:
                            containerClass = 'admin-item';
                            break;
                        case ROLES.MODERATOR:
                            containerClass = 'moderator-item';
                            break;
                        default:
                            containerClass = 'user-item';
                    }

                    const canManage = await roleManager.checkPermission(
                        auth.currentUser,
                        'manage',
                        normalizedRole
                    );

                    const showActions = canManage;

                    if (usersListEl) {
                        usersListEl.innerHTML += `
                    <div class="${containerClass}">
                        <div class="user-info">
                            <div class="user-email">${user.email}</div>
                            <div class="user-meta">
                                <span class="user-role ${normalizedRole.toLowerCase()}">${normalizedRole}</span>
                                <span class="user-date">Joined: ${formatDate(user.createdAt)}</span>
                            </div>
                        </div>
                        ${showActions ? `
                            <div class="user-actions">
                                <button onclick="showRolePicker('${user.id}','${user.email}','${normalizedRole}', this)" class="change-role-btn">
                                    Change Role
                                </button>
                                <button onclick="deleteUser('${user.id}')" class="delete-btn">
                                    Delete
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `;
                    }
                }
            } catch (error) {
                console.error('Error loading users:', error);
                if (ownersListEl) ownersListEl.innerHTML = '';
                if (usersListEl) usersListEl.innerHTML = '<p class="error">Error loading users</p>';
            }
        }

        // Role picker UI: render a small dropdown next to the clicked button
        function showRolePicker(userId, userEmail, currentRole, buttonEl) {
            try {
                // Remove any existing pickers
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
                const roles = [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER];

                const currentUserEmail = auth.currentUser?.email?.toLowerCase();
                const currentUserIsOwner = currentUserEmail && OWNER_EMAILS.map(e => e.toLowerCase()).includes(currentUserEmail);

                for (const r of roles) {
                    const opt = document.createElement('option');
                    opt.value = r;
                    opt.textContent = r.replace('_', ' ');
                    if (r === currentRole) opt.selected = true;
                    // disable OWNER option unless current user is an owner
                    if (r === ROLES.OWNER && !currentUserIsOwner) opt.disabled = true;
                    select.appendChild(opt);
                }

                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = 'Set';
                confirmBtn.className = 'confirm-role-btn';
                confirmBtn.style.marginLeft = '8px';

                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';
                cancelBtn.className = 'cancel-role-btn';
                cancelBtn.style.marginLeft = '6px';

                picker.appendChild(select);
                picker.appendChild(confirmBtn);
                picker.appendChild(cancelBtn);

                document.body.appendChild(picker);

                // Position the picker near the button
                const rect = buttonEl.getBoundingClientRect();
                picker.style.top = `${rect.bottom + window.scrollY + 6}px`;
                picker.style.left = `${rect.left + window.scrollX}px`;

                confirmBtn.addEventListener('click', async () => {
                    const chosen = select.value;
                    try {
                        await window.setUserRole(userId, userEmail, chosen);
                        picker.remove();
                    } catch (err) {
                        // error shown in setUserRole
                    }
                });

                cancelBtn.addEventListener('click', () => picker.remove());

                // Close when clicking outside
                const onDocClick = (e) => {
                    if (!picker.contains(e.target) && e.target !== buttonEl) {
                        picker.remove();
                        document.removeEventListener('click', onDocClick);
                    }
                };
                setTimeout(() => document.addEventListener('click', onDocClick));

                // expose for debugging
                window._lastRolePicker = picker;
                return picker;
            } catch (err) {
                console.error('Error showing role picker:', err);
            }
        }

        // Expose the picker globally so inline onclick can call it
        window.showRolePicker = showRolePicker;

    // Export functions
    export {
        setupFormHandlers,
        setupNavigationHandlers,
        showSection,
        loadUsers
    };

    usersList.innerHTML += `
                <div class="${containerClass}">
                    <div class="user-info">
                        <div class="user-email">${user.email}</div>
                        <div class="user-meta">
                            <span class="user-role ${normalizedRole.toLowerCase()}">${normalizedRole}</span>
                            <span class="user-date">Joined: ${formatDate(user.createdAt)}</span>
                        </div>
                    </div>
                    ${showActions ? `
                        <div class="user-actions">
                            <button onclick="showRolePicker('${user.id}','${user.email}','${normalizedRole}', this)" class="change-role-btn">
                                Change Role
                            </button>
                            <button onclick="deleteUser('${user.id}')" class="delete-btn">
                                Delete
                            </button>
                        </div>
                    ` : (isOwner ? `<div class="user-actions"><span class="protected-label">Protected</span></div>` : '')}
                </div>
            `;
}
    } catch (error) {
    console.error('Error loading users:', error);
    usersList.innerHTML = '<p class="error">Error loading users</p>';
}
}

// Export functions
export {
    setupFormHandlers,
    setupNavigationHandlers,
    showSection,
    loadUsers
};

// Role picker UI: render a small dropdown next to the clicked button
function showRolePicker(userId, userEmail, currentRole, buttonEl) {
    try {
        // Remove any existing pickers
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
        const roles = [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER];

        const currentUserEmail = auth.currentUser?.email?.toLowerCase();
        const currentUserIsOwner = currentUserEmail && OWNER_EMAILS.map(e => e.toLowerCase()).includes(currentUserEmail);

        for (const r of roles) {
            const opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r.replace('_', ' ');
            if (r === currentRole) opt.selected = true;
            // disable OWNER option unless current user is an owner
            if (r === ROLES.OWNER && !currentUserIsOwner) opt.disabled = true;
            select.appendChild(opt);
        }

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Set';
        confirmBtn.className = 'confirm-role-btn';
        confirmBtn.style.marginLeft = '8px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'cancel-role-btn';
        cancelBtn.style.marginLeft = '6px';

        picker.appendChild(select);
        picker.appendChild(confirmBtn);
        picker.appendChild(cancelBtn);

        document.body.appendChild(picker);

        // Position the picker near the button
        const rect = buttonEl.getBoundingClientRect();
        picker.style.top = `${rect.bottom + window.scrollY + 6}px`;
        picker.style.left = `${rect.left + window.scrollX}px`;

        confirmBtn.addEventListener('click', async () => {
            const chosen = select.value;
            try {
                await window.setUserRole(userId, userEmail, chosen);
                picker.remove();
            } catch (err) {
                // error shown in setUserRole
            }
        });

        cancelBtn.addEventListener('click', () => picker.remove());

        // Close when clicking outside
        const onDocClick = (e) => {
            if (!picker.contains(e.target) && e.target !== buttonEl) {
                picker.remove();
                document.removeEventListener('click', onDocClick);
            }
        };
        setTimeout(() => document.addEventListener('click', onDocClick));

        // expose for debugging
        window._lastRolePicker = picker;
        return picker;
    } catch (err) {
        console.error('Error showing role picker:', err);
    }
}

// Expose the picker globally so inline onclick can call it
window.showRolePicker = showRolePicker;