import { auth, functions } from './firebase-config.js';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const db = getFirestore();
const contactForm = document.getElementById('contactForm');
const submitBtn = document.querySelector('.submit-btn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button while processing
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    try {
        // Validate inputs
        if (!name || !email || !message) {
            throw new Error('Please fill in all fields');
        }

        // Create message object
        const messageData = {
            name,
            email,
            message,
            timestamp: new Date(),
            userId: auth.currentUser?.uid || 'anonymous',
            status: 'unread'
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, 'messages'), messageData);

        // Send notification with better error handling
        try {
            const notifyAdmin = httpsCallable(functions, 'notifyAdmin');
            const result = await notifyAdmin({
                messageId: docRef.id,
                sender: name,
                preview: message.substring(0, 100)
            });

            if (!result.data.success) {
                console.warn('Notification not sent:', result.data.error);
            }
        } catch (notifyError) {
            console.error('Notification error:', notifyError);
            // Continue since message is saved
        }

        // Success
        alert('Message sent successfully!');
        contactForm.reset();

    } catch (error) {
        console.error('Error details:', error);
        alert(error.message || 'Failed to send message. Please try again.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});

// Add real-time validation
const inputs = contactForm.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        input.setCustomValidity('');
        input.checkValidity();
    });

    input.addEventListener('invalid', () => {
        if (input.value.trim() === '') {
            input.setCustomValidity('This field is required');
        }
    });
});
