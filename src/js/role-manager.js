import { auth, functions } from './firebase-config.js';
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const db = getFirestore();

// Role definitions
export const ROLES = {
    OWNER: 'OWNER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MODERATOR: 'MODERATOR',
    USER: 'USER'
};

// Role configuration with permissions
export const ROLE_CONFIG = {
    [ROLES.OWNER]: {
        level: 1000,
        canManage: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
        canDelete: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
        description: 'Full system access and control'
    },
    [ROLES.SUPER_ADMIN]: {
        level: 100,
        // Super Admins may manage Admins and Moderators only (not Owners)
        canManage: [ROLES.ADMIN, ROLES.MODERATOR],
        canDelete: [ROLES.ADMIN, ROLES.MODERATOR],
        description: 'Can manage Admins and Moderators only'
    },
    [ROLES.ADMIN]: {
        level: 80,
        // Admins can manage Moderators only
        canManage: [ROLES.MODERATOR],
        canDelete: [ROLES.MODERATOR],
        description: 'Can manage Moderators only'
    },
    [ROLES.MODERATOR]: {
        level: 50,
        // Moderators cannot manage anyone
        canManage: [],
        canDelete: [],
        description: 'Moderator: limited privileges; cannot manage other users'
    },
    [ROLES.USER]: {
        level: 10,
        canManage: [],
        canDelete: [],
        description: 'Basic user access'
    }
};

export const OWNER_EMAILS = ['ag.aliengamerz@gmail.com', 'hamza.datashare@gmail.com'];

// Role management class
class RoleManager {
    constructor() {
        this.db = getFirestore();
    }

    async getUserRole(userId) {
        if (!userId) return null;

        try {
            const userDoc = await getDoc(doc(this.db, 'users', userId));
            return userDoc.exists() ? userDoc.data().role : null;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    }

    async checkPermission(user, action, targetRole) {
        if (!user) return false;

        try {
            // Owner check
            if (OWNER_EMAILS.includes(user.email.toLowerCase())) {
                return true;
            }

            const userRole = await this.getUserRole(user.uid);
            if (!userRole) return false;

            const userConfig = ROLE_CONFIG[userRole];
            if (!userConfig) return false;

            switch (action) {
                case 'manage':
                    return userConfig.canManage.includes(targetRole);
                case 'delete':
                    return userConfig.canDelete.includes(targetRole);
                default:
                    return userConfig.level >= ROLE_CONFIG[targetRole].level;
            }
        } catch (error) {
            console.error('Error checking permission:', error);
            return false;
        }
    }

    async assignRole(user, targetEmail, role) {
        if (!user || !targetEmail || !role) {
            throw new Error('Missing required parameters');
        }

        // Verify permission first
        const canAssign = await this.checkPermission(user, 'manage', role);
        if (!canAssign) {
            throw new Error('Insufficient permissions to assign this role');
        }

        const fn = httpsCallable(functions, 'setUserRole');
        const normalized = String(targetEmail).toLowerCase().trim();
        const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        let callableError = null;

        // Helper to attempt HTTP POST to the CORS-enabled endpoint
        const tryHttpSetUserRole = async () => {
            try {
                if (!auth || !auth.currentUser || typeof auth.currentUser.getIdToken !== 'function') return false;
                const idToken = await auth.currentUser.getIdToken();
                const region = 'us-central1';
                const project = 'ag-home-3db3f';
                const url = `https://${region}-${project}.cloudfunctions.net/setUserRoleCors`;
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify({ targetEmail: normalized, role })
                });

                if (!resp.ok) {
                    console.warn('HTTP setUserRoleCors returned non-OK:', resp.status, resp.statusText);
                    return false;
                }

                const data = await resp.json().catch(() => ({}));
                if (data && data.success) return true;
                console.warn('HTTP setUserRoleCors returned non-success body:', data);
                return false;
            } catch (err) {
                console.warn('HTTP setUserRoleCors failed:', err);
                return false;
            }
        };

        // On localhost prefer HTTP endpoint first
        if (isLocalhost) {
            const ok = await tryHttpSetUserRole();
            if (ok) return true;
        }

        // Try callable (deployed path)
        try {
            const res = await fn({ targetEmail: normalized, role });
            if (res && res.data && res.data.success) return true;
            throw new Error(res?.data?.error || 'Function failed to set role');
        } catch (err) {
            callableError = err;
            console.warn('Callable setUserRole failed:', err);
        }

        // Try HTTP fallback if callable failed
        const httpOk = await tryHttpSetUserRole();
        if (httpOk) return true;

        // Compose guidance and error
        const msg = (callableError && callableError.message) ? String(callableError.message) : String(callableError || 'unknown error');
        const guidance = [
            'Failed to call Cloud Functions setUserRole (callable and HTTP CORS fallbacks failed).',
            'Possible causes: Cloud Functions not deployed, wrong region, or CORS not configured on the function.',
            'Recommended fixes:',
            '1) Deploy Cloud Functions from the `functions` folder:',
            '   cd functions; npm install; cd ..; firebase deploy --only functions:setUserRole,functions:setUserRoleCors',
            '2) Ensure the functions run in the same region configured in `firebase-config.js` (us-central1).',
            '3) For temporary local development only: if you are an owner and understand the risks, set',
            "   `window.__ALLOW_OWNER_FALLBACK = true` in the browser console to enable a direct client-side Firestore fallback.",
            '   WARNING: enabling client-side writes bypasses server-side permission checks and is NOT recommended for production.'
        ].join('\n');

        console.warn(guidance);

        // Owner fallback only if explicitly opted-in
        if (typeof window !== 'undefined' && window.__ALLOW_OWNER_FALLBACK === true) {
            try {
                const callerEmail = String(user.email || '').toLowerCase();
                if (OWNER_EMAILS.includes(callerEmail)) {
                    if (role === ROLES.MODERATOR) {
                        await setDoc(doc(db, 'moderators', normalized), {
                            email: normalized,
                            addedBy: user.email,
                            addedAt: new Date()
                        });
                        await setDoc(doc(db, 'users', normalized), {
                            email: normalized,
                            rank: ROLES.MODERATOR,
                            updatedAt: new Date(),
                            updatedBy: user.email
                        }, { merge: true });
                    } else if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) {
                        await setDoc(doc(db, 'admins', normalized), {
                            email: normalized,
                            isSuperAdmin: role === ROLES.SUPER_ADMIN,
                            addedBy: user.email,
                            addedAt: new Date()
                        }, { merge: true });
                        await setDoc(doc(db, 'users', normalized), {
                            email: normalized,
                            rank: role,
                            updatedAt: new Date(),
                            updatedBy: user.email
                        }, { merge: true });
                    } else {
                        await setDoc(doc(db, 'users', normalized), {
                            email: normalized,
                            rank: role,
                            updatedAt: new Date(),
                            updatedBy: user.email
                        }, { merge: true });
                    }

                    console.log(`Role ${role} assigned to ${normalized} (owner fallback)`);
                    return true;
                }
            } catch (directErr) {
                console.error('Owner fallback failed:', directErr);
            }
        }

        throw new Error('Function call failed: ' + msg + '\n\n' + guidance);
    }

    async removeRole(user, targetEmail, role) {
        if (!user || !targetEmail || !role) {
            throw new Error('Missing required parameters');
        }

        try {
            // Verify permission
            const canDelete = await this.checkPermission(user, 'delete', role);
            if (!canDelete) {
                throw new Error('Insufficient permissions to remove this role');
            }

            // Delegate removal to callable function to avoid client rules
            const fn = httpsCallable(functions, 'removeUserRole');
            const normalized = String(targetEmail).toLowerCase().trim();
            const res = await fn({ targetEmail: normalized, role });
            if (res && res.data && res.data.success) return true;
            throw new Error('Function failed to remove role');
        } catch (error) {
            console.error('Error removing role:', error);
            throw error;
        }
    }
}

export const roleManager = new RoleManager();
export default roleManager;