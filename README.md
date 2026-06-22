#  AG Home - Firebase Web Application

A modern, feature-rich web application built with Firebase, featuring real-time messaging, product management, role-based access control, and admin capabilities.

##  Features

###  Authentication & Security
- Firebase Authentication (Email/Password, Google Sign-In ready)
- Role-based access control (Owner, Super Admin, Admin, Moderator, User)
- Custom user claims for advanced permissions
- Secure environment variable management

###  Product Management
- Browse and filter products
- Admin product CRUD operations
- Product reporting system
- Real-time product updates

###  Messaging & Communication
- Global chat system with real-time updates
- Private user-to-user messaging
- Admin notification system
- Contact form for user inquiries

###  Push Notifications
- Firebase Cloud Messaging (FCM) integration
- Service Worker for background notifications
- Device token management
- Real-time admin alerts

###  User Management
- User profile management
- Admin panel for user administration
- Moderator management tools
- User role assignments

###  Internationalization
- Multi-language support (English & Arabic)
- RTL support for Arabic
- Language persistence

###  UI/UX
- Responsive design
- Light/Dark theme toggle
- Intuitive admin control panel
- Real-time status indicators

---

##  Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Firebase CLI** - Install via: `npm install -g firebase-tools`
- **Git** (optional, for version control)

---

## Quick Start

### 1. Clone or Download the Project
```bash
# If using git
git clone <repository-url>
cd ag-home

# Or extract the downloaded ZIP file
cd AG-Home
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 3. Configure Environment Variables

#### Client Configuration (.env)
```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your Firebase project credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_ADMIN_EMAIL=admin@example.com
VITE_ENVIRONMENT=development

VITE_FUNCTIONS_REGION=us-central1
VITE_FUNCTIONS_EMULATOR_HOST=localhost
VITE_FUNCTIONS_EMULATOR_PORT=5001
```

#### Server Configuration (functions/.env.local)
```bash
cd functions
cp .env.example .env.local
```

Edit `functions/.env.local`:
```env
ADMIN_EMAIL=admin@example.com
ALLOWED_ADMIN_EMAILS=admin@example.com,another-admin@example.com
ENVIRONMENT=development
```

### 4. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Navigate to **Project Settings** → **General**
4. Scroll down to **Your apps** section
5. Click **Web** icon and copy the Firebase config
6. Paste values into your `.env` file

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173/**

---

##  Project Structure

```
ag-home/
├── src/                          # Frontend source files
│   ├── js/                       # JavaScript modules
│   │   ├── app.js               # Main application logic
│   │   ├── auth.js              # Authentication handler
│   │   ├── firebase-config.js   # Firebase initialization (env vars)
│   │   ├── firebase.js          # Firebase utilities
│   │   ├── control.js           # Admin control panel
│   │   ├── fcm-manager.js       # Push notifications
│   │   ├── role-manager.js      # Role management
│   │   ├── ui-handlers.js       # UI event handlers
│   │   ├── db-translator.js     # Database translations
│   │   ├── localization.js      # i18n support
│   │   ├── theme.js             # Theme management
│   │   └── [other modules]
│   ├── css/                      # Stylesheets
│   │   ├── styles.css           # Main styles
│   │   └── styles_1.css         # Additional styles
│   ├── admin-sections/           # Admin pages
│   │   └── moderator-management.html
│   ├── [HTML pages]              # User pages
│   │   ├── index.html
│   │   ├── products.html
│   │   ├── home.html
│   │   ├── contact.html
│   │   ├── about.html
│   │   ├── privacy.html
│   │   └── control.html
│   └── manifest.json             # PWA manifest
│
├── functions/                    # Cloud Functions (server-side)
│   ├── index.js                 # Functions code
│   ├── package.json             # Functions dependencies
│   └── .env.local               # Server environment (gitignored)
│
├── public/                       # Static assets
│   ├── index.html               # Hosting index
│   ├── admin.html               # Admin page
│   ├── firebase-messaging-sw.js # Service worker
│   └── manifest.json            # PWA manifest
│
├── scripts/                      # Utility scripts
│   ├── set_custom_claims.js     # Set user roles
│   └── migrate_roles.js         # Migrate role data
│
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── .firebaserc                  # Firebase project config
├── firebase.json                # Firebase hosting config
├── vite.config.js               # Vite bundler config
├── Firebase.rules               # Firestore security rules
├── package.json                 # Root dependencies
│
├── README.md                    # This file
├── SECURITY_SETUP.md            # Security configuration
├── SECURITY_IMPLEMENTATION_SUMMARY.md
├── FIRESTORE_RULES_FIX.md       # Firestore rules guide
├── DATABASE_README.md           # Database documentation
├── FIREBASE_SETUP_GUIDE.md      # Firebase setup steps
├── LOGIN_FEATURES.md            # Login documentation
├── PRODUCT_MANAGEMENT_GUIDE.md  # Products guide
├── PRODUCT_WHEEL_README.md      # Product wheel info
└── README_MAIN.md               # Main documentation
```

---

## Available Scripts

### Development
```bash
# Start development server (with hot reload)
npm run dev

# Preview production build locally
npm run preview
```

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy everything to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

### Local Development with Emulator
```bash
# Terminal 1: Start Firebase emulator
firebase emulators:start

# Terminal 2: Start Vite dev server
npm run dev

# Terminal 3: Run Cloud Functions locally (if needed)
cd functions
npm run serve
```

### Cloud Functions
```bash
cd functions

# Run functions locally
npm run serve

# Deploy functions only
npm run deploy
```

### Utility Scripts
```bash
# Set custom claims (assign roles to users)
node scripts/set_custom_claims.js

# Migrate roles from old system
node scripts/migrate_roles.js
```

---

## 🔐 Security & Environment

### Environment Variables
- **Never** commit `.env` file (it's in .gitignore)
- Keep `.env.example` updated with new variable names (no secrets)
- For production, set environment variables in Firebase Console
- Rotate API keys regularly

### Firestore Security Rules
Located in `Firebase.rules`:
- Role-based access control
- Collection-level permissions
- Field-level validation

### Deploying Rules
```bash
firebase deploy --only firestore:rules
```

See [FIRESTORE_RULES_FIX.md](FIRESTORE_RULES_FIX.md) for detailed rule information.

---

## 📚 Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Client environment variables (gitignored) |
| `functions/.env.local` | Server environment variables (gitignored) |
| `.env.example` | Template for client variables |
| `functions/.env.example` | Template for server variables |
| `vite.config.js` | Vite bundler configuration |
| `firebase.json` | Firebase hosting & functions config |
| `.firebaserc` | Firebase project settings |
| `Firebase.rules` | Firestore security rules |

---

## 🧪 Testing & Verification

### Check Environment Variables
After starting dev server, open browser console and verify:
```javascript
// Should show Firebase config loaded successfully
[firebase-config] Using Firebase configuration from: environment variables (.env)
[firebase-config] App configuration loaded from .env: Object
[firebase-config] Connected Functions emulator at http://localhost:5001
```

### Test Authentication
1. Sign up with email/password
2. Verify email (if required)
3. Set user roles through admin panel

### Test Admin Features
1. Log in as admin user
2. Access `/control.html` (admin control panel)
3. Manage users, products, messages

---

## 🐛 Troubleshooting

### Environment Variables Not Loading
1. Ensure `.env` file exists in project root
2. Check variable names have `VITE_` prefix (for client)
3. Restart dev server: `npm run dev`
4. Clear browser cache (Cmd/Ctrl + Shift + Delete)

### Firebase Connection Issues
```bash
# Check Firebase CLI is authenticated
firebase login

# Verify Firebase project is set
firebase projects:list
firebase use project-id
```

### Build Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Permission Errors in Console
- Check Firestore rules are deployed
- Verify user role in Firebase Console
- Check authentication status

See individual documentation files for more troubleshooting:
- [SECURITY_SETUP.md](SECURITY_SETUP.md) - Security troubleshooting
- [DATABASE_README.md](DATABASE_README.md) - Database issues
- [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md) - Firebase setup help

---

## 📖 Documentation

| Document | Content |
|----------|---------|
| [README_MAIN.md](README_MAIN.md) | Comprehensive project guide |
| [SECURITY_SETUP.md](SECURITY_SETUP.md) | Security configuration |
| [DATABASE_README.md](DATABASE_README.md) | Database schema & queries |
| [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md) | Firebase project setup |
| [FIRESTORE_RULES_FIX.md](FIRESTORE_RULES_FIX.md) | Security rules guide |
| [LOGIN_FEATURES.md](LOGIN_FEATURES.md) | Authentication system |
| [PRODUCT_MANAGEMENT_GUIDE.md](PRODUCT_MANAGEMENT_GUIDE.md) | Products module |
| [PRODUCT_WHEEL_README.md](PRODUCT_WHEEL_README.md) | Product wheel UI |

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Commit with clear messages
5. Push and create a Pull Request

---

## 🔗 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Vite Documentation](https://vitejs.dev/)
- [Vite + Firebase](https://vitejs.dev/guide/env-and-modes.html)

---

## 📄 License

This project is provided as-is. Modify and use according to your needs.

---

## 👥 Support

For issues and questions:
1. Check the documentation files
2. Review browser console for error messages
3. Check Firebase Cloud Logs
4. Review function logs: `firebase functions:log`

---

**Last Updated:** June 1, 2026  
**Version:** 1.0.0