# AG Home - Firebase Database & Project Documentation

## 📋 Overview

This project is an **AG Home Management Application** built with Firebase and Vite. It provides user authentication, role-based access control, product management, contact messaging, and real-time notifications.

---

## 🔐 Security & Environment Setup

### Important: Environment Variables

**NEVER commit `.env` files to version control.** Always use `.env` files for sensitive data.

#### Step 1: Create Your .env File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials from [Firebase Console](https://console.firebase.google.com/):

   ```plaintext
   VITE_FIREBASE_API_KEY=AIzaSyBfu4YI21vaAPeW6WbElRL56PHbxl6knb0
   VITE_FIREBASE_AUTH_DOMAIN=ag-home-3db3f.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ag-home-3db3f
   VITE_FIREBASE_STORAGE_BUCKET=ag-home-3db3f.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=384219186370
   VITE_FIREBASE_APP_ID=1:384219186370:web:b6b69a39d6cc5affa8e75b
   VITE_FIREBASE_MEASUREMENT_ID=G-5W214BQMNJ
   VITE_FUNCTIONS_REGION=us-central1
   VITE_ADMIN_EMAIL=ag.aliengamerz@gmail.com
   VITE_ENVIRONMENT=development
   ```

#### Step 2: Install dotenv Package (for client-side)

```bash
npm install dotenv
```

#### Step 3: Update Environment in firebase-config.js

The application now reads environment variables instead of hardcoded values:

```javascript
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

---

## 🗄️ Database Structure (Firestore)

### Collections Overview

#### 1. **users**
Stores user profile information and authentication metadata.

```
├── uid (document ID)
│   ├── email: string
│   ├── displayName: string
│   ├── photoURL: string
│   ├── role: string (admin | moderator | user)
│   ├── status: string (active | inactive | banned)
│   ├── createdAt: timestamp
│   ├── lastLogin: timestamp
│   └── preferences: object
│       ├── theme: string (light | dark)
│       ├── language: string (en | ar)
│       └── notifications: boolean
```

#### 2. **products**
Stores product catalog information.

```
├── productId (document ID)
│   ├── name: string
│   ├── description: string
│   ├── category: string
│   ├── price: number
│   ├── image: string (URL)
│   ├── stock: number
│   ├── rating: number (0-5)
│   ├── reviews: array of objects
│   │   ├── userId: string
│   │   ├── rating: number
│   │   ├── comment: string
│   │   └── date: timestamp
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   └── status: string (active | inactive | discontinued)
```

#### 3. **messages**
Stores contact form messages and user communications.

```
├── messageId (document ID)
│   ├── senderId: string (uid)
│   ├── senderEmail: string
│   ├── senderName: string
│   ├── subject: string
│   ├── content: string
│   ├── type: string (contact | support | feedback)
│   ├── status: string (unread | read | replied)
│   ├── createdAt: timestamp
│   ├── repliedAt: timestamp
│   └── adminReply: string (optional)
```

#### 4. **adminTokens**
Stores FCM (Firebase Cloud Messaging) tokens for admin notifications.

```
├── tokenId (document ID)
│   ├── email: string
│   ├── token: string (FCM token)
│   ├── deviceInfo: string
│   ├── createdAt: timestamp
│   └── expiresAt: timestamp
```

#### 5. **notifications**
Stores notification history for users.

```
├── notificationId (document ID)
│   ├── userId: string
│   ├── title: string
│   ├── body: string
│   ├── type: string (message | system | order | alert)
│   ├── read: boolean
│   ├── actionUrl: string
│   └── createdAt: timestamp
```

#### 6. **roles**
Stores role definitions and permissions (if using custom claims).

```
├── admin
│   ├── permissions: [array of permission strings]
│   └── description: string
├── moderator
│   ├── permissions: [array of permission strings]
│   └── description: string
└── user
    ├── permissions: [array of permission strings]
    └── description: string
```

---

## 👥 User Roles & Permissions

### Admin
- Full access to all features
- User management (ban, unban, update roles)
- Message management (view all, reply)
- Product management (create, update, delete)
- Analytics access

### Moderator
- Manage reports and user complaints
- Delete inappropriate content
- View user statistics
- Cannot manage user roles or delete accounts

### User (Default)
- View products
- Submit contact messages
- Receive notifications
- Update own profile
- Leave product reviews

---

## 🔧 Cloud Functions

### Available Functions

#### 1. **notifyAdmin**
Sends FCM notifications to admin devices when a new message arrives.

**Trigger:** HTTP callable function
**Parameters:**
- `messageId`: ID of the message
- `sender`: Name of the sender
- `preview`: Message preview text

**Usage:**
```javascript
const notifyAdmin = httpsCallable(functions, 'notifyAdmin');
await notifyAdmin({
    messageId: 'msg123',
    sender: 'John Doe',
    preview: 'Hello admin...'
});
```

---

## 📦 Authentication Setup

### Firebase Authentication Methods

1. **Email/Password** - Standard authentication
2. **Custom Claims** - For role-based access control

### Setup Custom Claims

Run the migration script to set custom roles:

```bash
node scripts/set_custom_claims.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase account with active project
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ag-home
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Run locally:**
   ```bash
   npm run dev
   ```

   This starts:
   - Vite dev server (http://localhost:5173)
   - Firebase emulator suite (optional, run with: `firebase emulators:start`)

### Development with Firebase Emulator

```bash
# In one terminal
firebase emulators:start

# In another terminal
npm run dev
```

---

## 📤 Deployment

### Deploy to Firebase Hosting

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   ```bash
   firebase deploy
   ```

3. **Deploy Cloud Functions only:**
   ```bash
   firebase deploy --only functions
   ```

### Set Environment Variables in Firebase Console

For production, set your admin email in Firebase Console > Project Settings.

---

## 🔐 Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId && request.auth.token.role in ['admin', 'moderator'];
    }
    
    // Public products can be read by anyone
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.role == 'admin';
    }
    
    // Messages - users can read their own, admins can read all
    match /messages/{document=**} {
      allow read: if request.auth.uid != null && 
                    (request.auth.uid == resource.data.senderId || 
                     request.auth.token.role == 'admin');
      allow create: if request.auth != null;
    }
    
    // Admin tokens - only owner can write
    match /adminTokens/{document=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null;
    }
  }
}
```

---

## 🎯 Key Features

✅ **Authentication** - Secure user authentication with Firebase Auth
✅ **Real-time Notifications** - FCM integration for push notifications
✅ **Role-based Access Control** - Admin, Moderator, User roles
✅ **Product Management** - Full CRUD operations for products
✅ **Contact System** - User contact form with admin notifications
✅ **Internationalization** - Support for multiple languages (EN, AR)
✅ **Dark/Light Theme** - User preference-based theming
✅ **Responsive Design** - Mobile-friendly interface

---

## 🐛 Troubleshooting

### Firebase Config Not Loading
- Ensure `.env` file exists in project root
- Check that environment variable names match `VITE_` prefix
- Restart dev server after changing `.env`

### Emulator Connection Issues
- Verify emulator is running: `firebase emulators:start`
- Check port 5001 is available
- Look for connection errors in browser console

### Cloud Functions Not Found
- Deploy functions: `firebase deploy --only functions`
- Verify function deployment: `firebase functions:list`
- Check Cloud Logs in Firebase Console

### Notifications Not Appearing
- Ensure FCM token is registered in `adminTokens` collection
- Check browser notification permissions
- Service Worker must be registered

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Vite Documentation](https://vitejs.dev/)

---

## 📝 Notes

- Never share your `.env` file or expose API keys publicly
- Regularly rotate your credentials
- Monitor Cloud Logs for security issues
- Test security rules in non-production environment first
- Keep dependencies updated for security patches

---

**Last Updated:** March 2026
**Maintainer:** AG Home Team
