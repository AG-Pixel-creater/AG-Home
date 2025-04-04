const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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
            .where('email', '==', 'ag.aliengamerz@gmail.com')
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
