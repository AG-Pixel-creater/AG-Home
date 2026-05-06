// Role management module

export const OWNER_EMAILS = [
    'ag.aliengamerz@gmail.com'
];

export const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
};

class RoleManager {
    constructor() {
        this.currentRole = ROLES.USER;
    }

    async getUserRole(email) {
        try {
            const lowerEmail = String(email || '').toLowerCase();
            
            if (OWNER_EMAILS.includes(lowerEmail)) {
                return ROLES.OWNER;
            }
            
            // Add logic here to check Firestore for other roles
            return ROLES.USER;
        } catch (error) {
            console.warn('[roleManager] getUserRole error:', error);
            return ROLES.USER;
        }
    }

    isOwner(email) {
        return OWNER_EMAILS.includes(String(email || '').toLowerCase());
    }

    isAdmin(role) {
        return role === ROLES.ADMIN || role === ROLES.OWNER;
    }

    isModerator(role) {
        return [ROLES.MODERATOR, ROLES.ADMIN, ROLES.OWNER].includes(role);
    }

    setCurrentRole(role) {
        this.currentRole = role;
    }

    getCurrentRole() {
        return this.currentRole;
    }

    canAccess(requiredRole) {
        const roleHierarchy = {
            [ROLES.USER]: 0,
            [ROLES.MODERATOR]: 1,
            [ROLES.ADMIN]: 2,
            [ROLES.OWNER]: 3
        };

        return (roleHierarchy[this.currentRole] || 0) >= (roleHierarchy[requiredRole] || 0);
    }
}

export default new RoleManager();
