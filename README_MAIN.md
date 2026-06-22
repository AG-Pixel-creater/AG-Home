# AG Home - Firebase Web Application

[![Security](https://img.shields.io/badge/security-environment%20variables-brightgreen)]()
[![Firebase](https://img.shields.io/badge/firebase-latest-orange)]()
[![Node](https://img.shields.io/badge/node-18%2B-blue)]()

A modern Firebase-powered web application for product management, user authentication, messaging, and role-based access control.

## 📖 Table of Contents

- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Features](#features)
- [Project Structure](#project-structure)
- [Security](#security)
- [Database](#database)
- [Development](#development)
- [Deployment](#deployment)
- [Support](#support)

---
d
## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account

### Installation

```bash
# 1. Install dependencies
npm install
cd functions && npm install && cd ..

# 2. Create environment files
cp .env.example .env
cd functions && cp .env.example .env.local && cd ..

# 3. Fill in your Firebase credentials in .env files
# See SECURITY_SETUP.md for detailed instructions

# 4. Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📚 Documentation

This project includes comprehensive documentation:

### 🔐 **[SECURITY_SETUP.md](./SECURITY_SETUP.md)** - START HERE
Complete security setup guide including:
- Environment variable configuration
- Firebase Console setup
- Security best practices
- Troubleshooting guide
- **⚠️ Contains urgent actions for exposed credentials**

### 🗄️ **[DATABASE_README.md](./DATABASE_README.md)**
Complete database documentation:
- Firestore collection structure
- Database schemas and fields
- User roles and permissions
- Cloud Functions reference
- Security rules
- Authentication setup

### 📋 **[SECURITY_IMPLEMENTATION_SUMMARY.md](./SECURITY_IMPLEMENTATION_SUMMARY.md)**
Summary of security changes:
- All files created and modified
- Before/after code comparisons
- Exposed credentials list
- Verification checklist

### 📝 **Original Guides**
- [PRODUCT_WHEEL_README.md](./PRODUCT_WHEEL_README.md) - Product features guide
- [PRODUCT_MANAGEMENT_GUIDE.md](./PRODUCT_MANAGEMENT_GUIDE.md) - Management instructions

---

## ✨ Features

### 🔐 Authentication & Authorization
- Email/Password authentication
- Role-based access control (Admin, Moderator, User)
- Custom authentication claims
- Auto-login persistence

### 📦 Product Management
- Full CRUD operations
- Product reviews and ratings
- Stock management
- Category filtering
- Search functionality

### 💬 Messaging System
- Contact form for users
- Admin notification system
- Real-time notifications via FCM
- Message status tracking

### 🔔 Real-Time Notifications
- Firebase Cloud Messaging (FCM)
- Device token management
- Push notifications to admins
- Service Worker integration

### 🌍 Internationalization
- Support for English and Arabic
- Language persistence
- RTL support for Arabic

### 🎨 Theme Support
- Light/Dark theme toggle
- User preferences persistence
- Responsive design

---

## 📁 Project Structure

```
af-home/
├── src/                           # Frontend source
│   ├── js/
│   │   ├── firebase-config.js     # Firebase initialization (env vars)
│   │   ├── auth.js                # Authentication logic
│   │   ├── firebase.js            # Firebase utilities
│   │   ├── app.js                 # Main app logic
│   │   ├── fcm-manager.js         # FCM notifications
│   │   ├── role-manager.js        # Role management
│   │   ├── ui-handlers.js         # UI event handlers
│   │   └── [other modules]
│   ├── css/
│   │   └── styles.css             # Styling
│   ├── [HTML pages]
│   └── admin-sections/            # Admin pages
│
├── functions/                     # Cloud Functions
│   ├── index.js                   # Functions code (env vars)
│   └── package.json
│
├── public/                        # Static assets
│   ├── index.html
│   ├── admin.html
│   └── [other files]
│
├── scripts/                       # Utility scripts
│   ├── set_custom_claims.js       # Set user roles
│   └── migrate_roles.js           # Migrate role data
│
├── .env.example                   # Client env template
├── functions/.env.example         # Functions env template
├── .gitignore                     # Git ignore file (secure)
├── .firebaserc                    # Firebase configuration
├── firebase.json                  # Firebase config
├── vite.config.js                 # Vite configuration
├── package.json                   # Root dependencies
│
├── DATABASE_README.md             # 📚 Database documentation
├── SECURITY_SETUP.md              # 🔐 Security setup guide
├── SECURITY_IMPLEMENTATION_SUMMARY.md  # 📋 Changes summary
└── README.md                      # This file
```

---

## 🔐 Security

### Environment Variables
All sensitive data is stored in `.env` files:

```bash
# Client configuration (.env)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
# ... more variables

# Functions configuration (functions/.env.local)
ADMIN_EMAIL=...
ALLOWED_ADMIN_EMAILS=...
```

### Protected Files
- `.env` files are in `.gitignore` (never committed to git)
- `.env.example` provides templates
- No credentials in source code

### Best Practices
✅ Use environment variables for all secrets
✅ Keep `.env` files local and never share
✅ Rotate credentials regularly
✅ Enable API key restrictions
✅ Implement Firestore security rules
✅ Monitor cloud logs

### 🚨 Important: Exposed Credentials
Previous hardcoded credentials have been exposed. **Please:**
1. Rotate Firebase API key immediately
2. Review authentication logs for unauthorized access
3. Check Cloud Logs for suspicious activity
4. Read [SECURITY_SETUP.md](./SECURITY_SETUP.md) for details

See [SECURITY_IMPLEMENTATION_SUMMARY.md](./SECURITY_IMPLEMENTATION_SUMMARY.md#-exposed-credentials-urgent-action-required) for the list of exposed values.

---

## 🗄️ Database

Firestore database with the following collections:

### Collections
- **users** - User profiles and preferences
- **products** - Product catalog
- **messages** - Contact messages
- **adminTokens** - FCM device tokens
- **notifications** - Notification history
- **roles** - Role definitions

### Schema Reference
See [DATABASE_README.md](./DATABASE_README.md) for complete schema documentation with all fields and types.

### Security Rules
Firestore security rules are implemented to:
- Allow users to read only their own profiles
- Allow public read access to products
- Restrict message access appropriately
- Protect admin tokens
- Enforce role-based permissions

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Firebase emulator (in separate terminal)
firebase emulators:start

# Cloud Functions development
cd functions
npm run serve

# Deploy functions
npm run deploy
```

### Development with Emulator

```bash
# Terminal 1: Start Firebase emulator
firebase emulators:start

# Terminal 2: Start Vite dev server
npm run dev
```

### Environment Setup

Development uses these environment variables:
```
VITE_ENVIRONMENT=development
VITE_FUNCTIONS_EMULATOR_HOST=localhost
VITE_FUNCTIONS_EMULATOR_PORT=5001
```

---

## 🚀 Deployment

### Firebase Hosting

```bash
# 1. Build the project
npm run build

# 2. Deploy everything
firebase deploy

# Or deploy specific targets:
firebase deploy --only hosting,functions
```

### Environment Configuration
Set production environment variables in:
1. Firebase Console > Project Settings > Environment variables
2. Or in production `.env` file before build

### Security Checklist
- [ ] API key rotated
- [ ] Firebase rules tested
- [ ] Admin emails configured
- [ ] CORS settings correct
- [ ] Firebase functions deployed
- [ ] Service worker enabled
- [ ] Monitoring enabled

---

## 🔧 Configuration Files

### `.env` (Client)
Template: `.env.example`
- Firebase initialization
- Admin email
- Functions region
- Emulator settings

### `functions/.env.local` (Server)
Template: `functions/.env.example`
- Admin email list
- Environment mode

### `firebase.json`
Firebase project configuration for hosting and functions

### `vite.config.js`
Vite bundler configuration

### `.firebaserc`
Firebase project aliases and settings

---

## 🐛 Troubleshooting

### Build Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
1. Restart dev server: `npm run dev`
2. Check `.env` file exists
3. Verify variable names (client: `VITE_` prefix)
4. Check for spaces around `=`

### Firebase Connection Issues
1. Check internet connection
2. Verify Firebase credentials
3. Check Firebase project is active
4. Review auth tokens in Cloud Logs

### Functions Not Deploying
```bash
# Check deployment status
firebase deploy --only functions

# View function logs
firebase functions:log
```

For more troubleshooting, see [SECURITY_SETUP.md](./SECURITY_SETUP.md#-troubleshooting)

---

## 📦 Dependencies

### Core
- **firebase** ^10.14.1 - Firebase SDK
- **dotenv** ^16.0.0 - Environment variables

### Development
- **vite** ^5.4.16 - Build tool

### Cloud Functions
- **firebase-admin** ^11.8.0
- **firebase-functions** ^4.3.1
- **express** ^4.18.2
- **cors** ^2.8.5
- **dotenv** ^16.0.0

---

## 🔗 Related Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Vite Guide](https://vitejs.dev/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

## 📧 Admin Configuration

Primary admin email (configurable):
```
VITE_ADMIN_EMAIL=ag.aliengamerz@gmail.com
```

Can be changed in `.env` file and will be used for:
- Receiving notifications for new messages
- System admin operations
- Admin console access

---

## 🔔 Features in Detail

### Real-Time Notifications
- Push notifications via FCM
- Device token registration
- Admin notification routing
- Background service worker

### Role-Based Access
- **Admin** - Full system access
- **Moderator** - Content moderation
- **User** - Basic user access

### Product Features
- Browse products
- Search and filter
- Read reviews
- Check availability
- Rate and review

### Messaging
- Contact form submission
- Message tracking
- Admin responses
- Notification delivery

---

## 📈 Stats

- **Collections**: 6 (users, products, messages, adminTokens, notifications, roles)
- **Cloud Functions**: 2+ (notifyAdmin, setUserRole)
- **Pages**: 5+ (home, products, contact, admin, auth)
- **Supported Languages**: 2 (English, Arabic)

---

## 📄 License

All rights reserved. This project is proprietary and confidential.

---

## 👥 Contributors

AG Home Team

---

## 📝 Changelog

### v1.1.0 - Security Update (March 2026)
✅ Implemented environment variables for all secrets
✅ Replaced hardcoded API keys
✅ Updated .gitignore with security entries
✅ Created comprehensive documentation
✅ Added security setup guide

### v1.0.0 - Initial Release
✅ Firebase integration
✅ Authentication system
✅ Product management
✅ Messaging system
✅ Role-based access control

---

## 🆘 Getting Help

1. **Setup Issues?** → Read [SECURITY_SETUP.md](./SECURITY_SETUP.md)
2. **Database Questions?** → Read [DATABASE_README.md](./DATABASE_README.md)
3. **Security Concerns?** → Read [SECURITY_IMPLEMENTATION_SUMMARY.md](./SECURITY_IMPLEMENTATION_SUMMARY.md)
4. **Firebase Help?** → Visit [firebase.google.com/docs](https://firebase.google.com/docs)

---

## ⚡ Quick Links

| Document | Purpose |
|----------|---------|
| [SECURITY_SETUP.md](./SECURITY_SETUP.md) | Setup & security guide |
| [DATABASE_README.md](./DATABASE_README.md) | Database structure |
| [SECURITY_IMPLEMENTATION_SUMMARY.md](./SECURITY_IMPLEMENTATION_SUMMARY.md) | Changes summary |
| [PRODUCT_MANAGEMENT_GUIDE.md](./PRODUCT_MANAGEMENT_GUIDE.md) | Product features |
| [PRODUCT_WHEEL_README.md](./PRODUCT_WHEEL_README.md) | Feature wheel |

---

**Last Updated:** March 2026
**Status:** Production Ready ✅
**Security:** Hardened ✅
**Documentation:** Complete ✅
