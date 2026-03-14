const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Load environment variables
require('dotenv').config();

admin.initializeApp();

// Get admin email from environment variable
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ag.aliengamerz@gmail.com';
const ALLOWED_ADMIN_EMAILS = (process.env.ALLOWED_ADMIN_EMAILS || 'ag.aliengamerz@gmail.com,hamza.datashare@gmail.com')
    .split(',')
    .map(email => email.toLowerCase().trim());

exports.notifyAdmin = functions.https.onCall(async (data, context) => {
    try {
        // Check if user is authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'User must be authenticated.'
            );
        }

        // Check if data exists
        if (!data.messageId || !data.sender || !data.preview) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Missing required message data.'
            );
        }

        // Get admin tokens with error handling
        const adminSnapshot = await admin.firestore()
            .collection('adminTokens')
            .where('email', '==', ADMIN_EMAIL)
            .get();

        if (adminSnapshot.empty) {
            console.log('No admin tokens found');
            return { success: false, error: 'No admin devices registered' };
        }

        // Send notifications with better error handling
        const notifications = adminSnapshot.docs.map(async (doc) => {
            try {
                const token = doc.data().token;
                if (!token) return null;

                return await admin.messaging().send({
                    token: token,
                    notification: {
                        title: `New Message from ${data.sender}`,
                        body: data.preview + '...'
                    },
                    webpush: {
                        fcmOptions: {
                            link: `/admin.html?message=${data.messageId}`
                        },
                        notification: {
                            requireInteraction: true,
                            badge: '/icon.png'
                        }
                    }
                });
            } catch (error) {
                console.error('Error sending notification:', error);
                if (error.code === 'messaging/invalid-token') {
                    // Remove invalid token
                    await doc.ref.delete();
                }
                return null;
            }
        });

        const results = await Promise.all(notifications);
        const successCount = results.filter(Boolean).length;

        return {
            success: true,
            notificationsSent: successCount
        };

    } catch (error) {
        console.error('Function error:', error);
        throw new functions.https.HttpsError(
            'internal',
            error.message || 'Failed to send notification'
        );
    }
});

// Optional: Create a function to handle new messages
exports.onNewMessage = functions.firestore
    .document('messages/{messageId}')
    .onCreate(async (snap, context) => {
        const message = snap.data();

        // Get admin tokens
        const adminTokens = await admin.firestore()
            .collection('adminTokens')
            .get();

        // Send notifications
        const notifications = adminTokens.docs.map(doc => {
            return admin.messaging().send({
                token: doc.data().token,
                notification: {
                    title: 'New Contact Message',
                    body: `From: ${message.name}\n${message.message.substring(0, 100)}...`
                }
            });
        });

        return Promise.all(notifications);
    });

// Callable function to set a user's role. Runs with admin privileges.
exports.setUserRole = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
        }

        const callerEmail = (context.auth.token && context.auth.token.email) ? String(context.auth.token.email).toLowerCase() : null;
        const allowedOwners = ALLOWED_ADMIN_EMAILS;

        // Allow owners or super-admins (check admins collection for isSuperAdmin)
        let isAllowed = false;
        if (callerEmail && allowedOwners.includes(callerEmail)) isAllowed = true;
        if (!isAllowed) {
            const adminDoc = await admin.firestore().collection('admins').doc(callerEmail).get().catch(() => null);
            if (adminDoc && adminDoc.exists && adminDoc.data() && adminDoc.data().isSuperAdmin) isAllowed = true;
        }
        if (!isAllowed) {
            throw new functions.https.HttpsError('permission-denied', 'Only owners or super-admins may call setUserRole');
        }

        const { targetEmail, role } = data || {};
        if (!targetEmail || !role) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing targetEmail or role');
        }

        const normalizedEmail = String(targetEmail).toLowerCase().trim();

        const firestore = admin.firestore();

        // Find existing user doc by email
        const usersQuery = await firestore.collection('users').where('email', '==', normalizedEmail).get();
        let userId = null;
        if (usersQuery.empty) {
            // create new user doc with auto id
            const newUserRef = firestore.collection('users').doc();
            userId = newUserRef.id;
            await newUserRef.set({
                email: normalizedEmail,
                role: role,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                createdBy: callerEmail,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedBy: callerEmail
            });
        } else {
            userId = usersQuery.docs[0].id;
            await firestore.collection('users').doc(userId).set({ role: role, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: callerEmail }, { merge: true });
        }

        // Handle special collections
        if (role === 'MODERATOR') {
            await firestore.collection('moderators').doc(normalizedEmail).set({
                email: normalizedEmail,
                addedBy: callerEmail,
                addedAt: admin.firestore.FieldValue.serverTimestamp(),
                userId: userId
            });
        } else if (['ADMIN', 'SUPER_ADMIN'].includes(role)) {
            await firestore.collection('admins').doc(normalizedEmail).set({
                email: normalizedEmail,
                isSuperAdmin: role === 'SUPER_ADMIN',
                addedBy: callerEmail,
                addedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        // Log action
        await firestore.collection('admin_logs').add({
            action: 'ROLE_CHANGE',
            targetEmail: normalizedEmail,
            newRole: role,
            performedBy: callerEmail,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true };
    } catch (err) {
        console.error('setUserRole function error:', err);
        if (err instanceof functions.https.HttpsError) throw err;
        throw new functions.https.HttpsError('internal', err.message || 'Failed to set user role');
    }
});

// Callable function to remove a user's elevated role (demote to USER)
exports.removeUserRole = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
        }

        const callerEmail = (context.auth.token && context.auth.token.email) ? String(context.auth.token.email).toLowerCase() : null;
        const allowedOwners = ['ag.aliengamerz@gmail.com', 'hamza.datashare@gmail.com'];
        // Allow owners or super-admins to remove roles
        let isAllowedRemove = false;
        if (callerEmail && allowedOwners.includes(callerEmail)) isAllowedRemove = true;
        if (!isAllowedRemove) {
            const adminDoc = await admin.firestore().collection('admins').doc(callerEmail).get().catch(() => null);
            if (adminDoc && adminDoc.exists && adminDoc.data() && adminDoc.data().isSuperAdmin) isAllowedRemove = true;
        }
        if (!isAllowedRemove) {
            throw new functions.https.HttpsError('permission-denied', 'Only owners or super-admins may call removeUserRole');
        }

        const { targetEmail, role } = data || {};
        if (!targetEmail || !role) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing targetEmail or role');
        }

        const normalizedEmail = String(targetEmail).toLowerCase().trim();
        const firestore = admin.firestore();

        // Clean up special collections
        if (role === 'MODERATOR') {
            await firestore.collection('moderators').doc(normalizedEmail).delete().catch(() => null);
        } else if (['ADMIN', 'SUPER_ADMIN'].includes(role)) {
            await firestore.collection('admins').doc(normalizedEmail).delete().catch(() => null);
        }

        // Update user's role to USER if exists
        const usersQuery = await firestore.collection('users').where('email', '==', normalizedEmail).get();
        if (!usersQuery.empty) {
            await firestore.collection('users').doc(usersQuery.docs[0].id).set({ role: 'USER', updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: callerEmail }, { merge: true });
        }

        // Log action
        await firestore.collection('admin_logs').add({
            action: 'ROLE_REMOVE',
            targetEmail: normalizedEmail,
            oldRole: role,
            performedBy: callerEmail,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true };
    } catch (err) {
        console.error('removeUserRole function error:', err);
        if (err instanceof functions.https.HttpsError) throw err;
        throw new functions.https.HttpsError('internal', err.message || 'Failed to remove user role');
    }
});

// Callable function to allow admins/owners to update message metadata (status, archived, adminReply)
exports.updateMessage = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
        }

        const callerEmail = (context.auth.token && context.auth.token.email) ? String(context.auth.token.email).toLowerCase() : null;
        const allowedOwners = ['ag.aliengamerz@gmail.com', 'hamza.datashare@gmail.com'];

        // Check if caller is owner or admin
        let isAdminAllowed = false;
        if (callerEmail && allowedOwners.includes(callerEmail)) isAdminAllowed = true;
        if (!isAdminAllowed) {
            const adminDoc = await admin.firestore().collection('admins').doc(callerEmail).get().catch(() => null);
            if (adminDoc && adminDoc.exists && adminDoc.data() && adminDoc.data().isSuperAdmin) isAdminAllowed = true;
            // Allow regular admins as message handlers too
            if (!isAdminAllowed) {
                const adminDoc2 = await admin.firestore().collection('admins').doc(callerEmail).get().catch(() => null);
                if (adminDoc2 && adminDoc2.exists) isAdminAllowed = true;
            }
        }

        if (!isAdminAllowed) {
            throw new functions.https.HttpsError('permission-denied', 'Only owners or admins may update messages');
        }

        const { messageId, updates } = data || {};
        if (!messageId || !updates || typeof updates !== 'object') {
            throw new functions.https.HttpsError('invalid-argument', 'Missing messageId or updates');
        }

        const allowedKeys = ['status', 'archived', 'adminReply'];
        const payload = {};
        Object.keys(updates).forEach(k => {
            if (allowedKeys.includes(k)) payload[k] = updates[k];
        });

        if (Object.keys(payload).length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'No valid fields to update');
        }

        // Add handled metadata
        payload.handledBy = callerEmail;
        payload.handledAt = admin.firestore.FieldValue.serverTimestamp();

        await admin.firestore().collection('messages').doc(messageId).set(payload, { merge: true });

        // Log action
        await admin.firestore().collection('admin_logs').add({
            action: 'MESSAGE_UPDATE',
            messageId,
            updates: payload,
            performedBy: callerEmail,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true };
    } catch (err) {
        console.error('updateMessage function error:', err);
        if (err instanceof functions.https.HttpsError) throw err;
        throw new functions.https.HttpsError('internal', err.message || 'Failed to update message');
    }
});

// HTTP endpoint with CORS to support direct POSTs from browsers during local dev
const updateMessageApp = express();
updateMessageApp.use(cors({ origin: true }));
updateMessageApp.use(express.json());

updateMessageApp.options('*', cors({ origin: true }));

updateMessageApp.post('/', async (req, res) => {
    try {
        // Expect Authorization: Bearer <idToken>
        const authHeader = req.get('Authorization') || req.get('authorization');
        if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization header' });
        const idToken = parts[1];

        const decoded = await admin.auth().verifyIdToken(idToken).catch(() => null);
        if (!decoded || !decoded.email) return res.status(401).json({ error: 'Invalid token' });

        const callerEmail = String(decoded.email).toLowerCase();
        const allowedOwners = ['ag.aliengamerz@gmail.com', 'hamza.datashare@gmail.com'];

        let isAdminAllowed = false;
        if (callerEmail && allowedOwners.includes(callerEmail)) isAdminAllowed = true;
        if (!isAdminAllowed) {
            const adminDoc = await admin.firestore().collection('admins').doc(callerEmail).get().catch(() => null);
            if (adminDoc && adminDoc.exists && adminDoc.data() && adminDoc.data().isSuperAdmin) isAdminAllowed = true;
            if (!isAdminAllowed) {
                const adminDoc2 = await admin.firestore().collection('admins').doc(callerEmail).get().catch(() => null);
                if (adminDoc2 && adminDoc2.exists) isAdminAllowed = true;
            }
        }
        if (!isAdminAllowed) return res.status(403).json({ error: 'Permission denied' });

        const { messageId, updates } = req.body || {};
        if (!messageId || !updates || typeof updates !== 'object') return res.status(400).json({ error: 'Missing messageId or updates' });

        const allowedKeys = ['status', 'archived', 'adminReply'];
        const payload = {};
        Object.keys(updates).forEach(k => {
            if (allowedKeys.includes(k)) payload[k] = updates[k];
        });
        if (Object.keys(payload).length === 0) return res.status(400).json({ error: 'No valid fields to update' });

        payload.handledBy = callerEmail;
        payload.handledAt = admin.firestore.FieldValue.serverTimestamp();

        await admin.firestore().collection('messages').doc(messageId).set(payload, { merge: true });

        await admin.firestore().collection('admin_logs').add({
            action: 'MESSAGE_UPDATE',
            messageId,
            updates: payload,
            performedBy: callerEmail,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.json({ success: true });
    } catch (err) {
        console.error('updateMessage HTTP error:', err);
        return res.status(500).json({ error: err.message || 'internal' });
    }
});

exports.updateMessageCors = functions.https.onRequest(updateMessageApp);

// HTTP endpoint with CORS to support setUserRole via POST from browsers during local dev
const setUserRoleApp = express();
// Allow dev origins; adjust to your production origin as needed
// Explicitly allow Authorization header and preflight methods so browsers can send idTokens
setUserRoleApp.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Allow credentials if needed (cookies). Currently we use Bearer tokens.
    res.header('Access-Control-Allow-Credentials', 'true');
    // Cache preflight response for 1 hour
    res.header('Access-Control-Max-Age', '3600');
    // If this is a preflight request, respond immediately
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }
    next();
});
setUserRoleApp.use(express.json());

// Simple health endpoint to verify CORS and auth flow quickly
setUserRoleApp.get('/_health', (req, res) => {
    res.json({ ok: true, service: 'setUserRoleCors' });
});

setUserRoleApp.post('/', async (req, res) => {
    try {
        // Expect Authorization: Bearer <idToken>
        const authHeader = req.get('Authorization') || req.get('authorization');
        if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization header' });
        const idToken = parts[1];

        const decoded = await admin.auth().verifyIdToken(idToken).catch(() => null);
        if (!decoded || !decoded.email) return res.status(401).json({ error: 'Invalid token' });

        const callerEmail = String(decoded.email).toLowerCase();
        const allowedOwners = ['ag.aliengamerz@gmail.com', 'hamza.datashare@gmail.com'];

        // Permission check (owners or admins)
        let isAllowed = false;
        if (callerEmail && allowedOwners.includes(callerEmail)) isAllowed = true;
        if (!isAllowed) {
            const adminDoc = await admin.firestore().collection('admins').doc(callerEmail).get().catch(() => null);
            if (adminDoc && adminDoc.exists && adminDoc.data() && adminDoc.data().isSuperAdmin) isAllowed = true;
            if (!isAllowed) {
                const adminDoc2 = await admin.firestore().collection('admins').doc(callerEmail).get().catch(() => null);
                if (adminDoc2 && adminDoc2.exists) isAllowed = true;
            }
        }
        if (!isAllowed) return res.status(403).json({ error: 'Permission denied' });

        const { targetEmail, role } = req.body || {};
        if (!targetEmail || !role) return res.status(400).json({ error: 'Missing targetEmail or role' });

        const normalizedEmail = String(targetEmail).toLowerCase().trim();
        const firestore = admin.firestore();

        // Find existing user doc by email
        const usersQuery = await firestore.collection('users').where('email', '==', normalizedEmail).get();
        let userId = null;
        if (usersQuery.empty) {
            const newUserRef = firestore.collection('users').doc();
            userId = newUserRef.id;
            await newUserRef.set({
                email: normalizedEmail,
                role: role,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                createdBy: callerEmail,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedBy: callerEmail
            });
        } else {
            userId = usersQuery.docs[0].id;
            await firestore.collection('users').doc(userId).set({ role: role, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: callerEmail }, { merge: true });
        }

        // Handle special collections
        if (role === 'MODERATOR') {
            await firestore.collection('moderators').doc(normalizedEmail).set({
                email: normalizedEmail,
                addedBy: callerEmail,
                addedAt: admin.firestore.FieldValue.serverTimestamp(),
                userId: userId
            });
        } else if (['ADMIN', 'SUPER_ADMIN'].includes(role)) {
            await firestore.collection('admins').doc(normalizedEmail).set({
                email: normalizedEmail,
                isSuperAdmin: role === 'SUPER_ADMIN',
                addedBy: callerEmail,
                addedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        // Log action
        await firestore.collection('admin_logs').add({
            action: 'ROLE_CHANGE',
            targetEmail: normalizedEmail,
            newRole: role,
            performedBy: callerEmail,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.json({ success: true });
    } catch (err) {
        console.error('setUserRole HTTP error:', err);
        return res.status(500).json({ error: err.message || 'internal' });
    }
});

exports.setUserRoleCors = functions.https.onRequest(setUserRoleApp);
