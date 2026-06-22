# GitHub Pages Deployment Guide - AG-Home

## 📋 Deployment Overview

This document provides step-by-step instructions for deploying the AG-Home website to GitHub Pages at:
**https://ag-pixel-creater.github.io/AG-Home/**

---

## 🔧 Prerequisites

- Node.js 18+ installed
- Git installed and configured
- GitHub repository access
- GitHub Secrets configured with Firebase credentials

---

## 🚀 Deployment Steps

### Step 1: Configure GitHub Repository Secrets

Navigate to your GitHub repository settings and add the following secrets:

```
Settings → Secrets and variables → Actions → New repository secret
```

Add these exact secrets with your Firebase project values:

| Secret Name | Description | Example |
|-----------|-----------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyD...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123456789:web:abc123...` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | `G-XXXXXXXXXX` |
| `VITE_FIREBASE_VAPID_KEY` | Firebase FCM VAPID Key | `BF...` |
| `VITE_ADMIN_EMAIL` | Admin Email Address | `admin@example.com` |
| `VITE_ENVIRONMENT` | Environment Type | `production` |
| `VITE_FUNCTIONS_REGION` | Cloud Functions Region | `us-central1` |
| `VITE_FUNCTIONS_EMULATOR_HOST` | Functions Emulator Host | *(leave empty for production)* |
| `VITE_FUNCTIONS_EMULATOR_PORT` | Functions Emulator Port | *(leave empty for production)* |

**How to find your Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (⚙️)
4. Under "Your apps", find your web app
5. Copy the configuration values
6. For VAPID Key: Cloud Messaging → Web Push certificates

---

### Step 2: Prepare Your Local Repository

```bash
# Navigate to your project directory
cd /workspaces/AG-Home

# Ensure you're on the master branch
git checkout master

# Pull latest changes
git pull origin master
```

---

### Step 3: Verify All Files Are in Place

The following critical files should exist:

```
AG-Home/
├── .github/
│   └── workflows/
│       └── deploy.yml          ✓ GitHub Actions workflow
├── .env.example                ✓ Environment variables template
├── .nojekyll                   ✓ Disables Jekyll processing
├── vite.config.js              ✓ Vite config with base: '/AG-Home/'
├── public/
│   └── 404.html                ✓ GitHub Pages error handler
├── src/
│   ├── index.html              ✓ Home page
│   ├── home.html               ✓ Home page variant
│   ├── about.html              ✓ About page
│   ├── products.html           ✓ Products page
│   ├── contact.html            ✓ Contact page
│   ├── privacy.html            ✓ Privacy policy
│   ├── control.html            ✓ Control panel
│   ├── manifest.json           ✓ PWA manifest (updated)
│   └── firebase-messaging-sw.js ✓ Service worker
└── package.json                ✓ Project config
```

---

### Step 4: Commit Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "chore: prepare for GitHub Pages deployment

- Updated manifest.json for /AG-Home/ base path
- Fixed privacy.html back link to relative path
- Created 404.html for direct page access on GitHub Pages
- Updated service worker registration for GitHub Pages paths
- Added .env.example for GitHub Secrets reference
- Created GitHub Actions deployment workflow (deploy.yml)

Deployment URL: https://ag-pixel-creater.github.io/AG-Home/"

# Push to master branch (triggers GitHub Actions)
git push origin master
```

---

### Step 5: Monitor GitHub Actions Deployment

```bash
# Option A: Via GitHub Web Interface
# 1. Go to your repository on GitHub
# 2. Click on "Actions" tab
# 3. Select "Deploy to GitHub Pages" workflow
# 4. Monitor the build progress

# Option B: Via GitHub CLI
gh workflow run deploy.yml
gh run list --workflow=deploy.yml
gh run view <run-id> --log
```

---

### Step 6: Verify Deployment

After the GitHub Actions workflow completes successfully, verify your site:

```bash
# Check the deployed site
curl -I https://ag-pixel-creater.github.io/AG-Home/

# Expected response:
# HTTP/2 200
# Content-Type: text/html; charset=utf-8

# Test page access
curl -I https://ag-pixel-creater.github.io/AG-Home/index.html
curl -I https://ag-pixel-creater.github.io/AG-Home/about.html
curl -I https://ag-pixel-creater.github.io/AG-Home/products.html
curl -I https://ag-pixel-creater.github.io/AG-Home/contact.html
curl -I https://ag-pixel-creater.github.io/AG-Home/privacy.html
```

---

## 📄 Modified Files Summary

### 1. `.env.example` - NEW
Environment variables template for GitHub Secrets configuration

### 2. `.github/workflows/deploy.yml` - NEW
GitHub Actions workflow that:
- Runs on every push to `master` branch
- Installs dependencies
- Creates `.env` file from GitHub Secrets
- Builds the project with Vite
- Deploys to GitHub Pages
- Verifies deployment completion

### 3. `public/404.html` - NEW
Custom 404 page for GitHub Pages that:
- Enables direct page access (home.html, about.html, etc.)
- Redirects to appropriate pages or home page
- Shows user-friendly error message

### 4. `src/manifest.json` - MODIFIED
Updated PWA manifest:
- `start_url`: `/AG-Home/index.html` (was `/admin.html`)
- `scope`: `/AG-Home/` (new field for PWA)
- `icons[0].src`: `/AG-Home/favicon.ico` (was `/favicon.ico`)

### 5. `src/privacy.html` - MODIFIED
Fixed navigation link:
- Back link: `./home.html` (was `/home.html`)
- Ensures relative paths work on GitHub Pages subpath

### 6. `src/js/fcm-manager.js` - MODIFIED
Updated service worker registration:
- Detects GitHub Pages deployment automatically
- Uses `/AG-Home/firebase-messaging-sw.js` for GitHub Pages
- Uses `/firebase-messaging-sw.js` for local development
- Sets correct scope for service worker

### 7. `vite.config.js` - VERIFIED (No changes needed)
Already correctly configured:
- `base: '/AG-Home/'` ✓
- `root: 'src'` ✓
- `envDir: '..'` ✓

---

## 🔐 GitHub Secrets Setup Script

To automate adding secrets via GitHub CLI:

```bash
# Replace YOUR_VALUES with actual values from Firebase Console
gh secret set VITE_FIREBASE_API_KEY -b "YOUR_API_KEY"
gh secret set VITE_FIREBASE_AUTH_DOMAIN -b "your-project.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID -b "your-project-id"
gh secret set VITE_FIREBASE_STORAGE_BUCKET -b "your-project.appspot.com"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID -b "123456789"
gh secret set VITE_FIREBASE_APP_ID -b "1:123456789:web:abc123..."
gh secret set VITE_FIREBASE_MEASUREMENT_ID -b "G-XXXXXXXXXX"
gh secret set VITE_FIREBASE_VAPID_KEY -b "YOUR_VAPID_KEY"
gh secret set VITE_ADMIN_EMAIL -b "admin@example.com"
gh secret set VITE_ENVIRONMENT -b "production"
gh secret set VITE_FUNCTIONS_REGION -b "us-central1"
gh secret set VITE_FUNCTIONS_EMULATOR_HOST -b ""
gh secret set VITE_FUNCTIONS_EMULATOR_PORT -b ""
```

---

## ✅ Deployment Checklist

- [ ] All 13 GitHub Secrets are configured
- [ ] `.env.example` file exists in project root
- [ ] `.github/workflows/deploy.yml` exists and is valid YAML
- [ ] `public/404.html` exists with redirect logic
- [ ] `src/manifest.json` has `/AG-Home/` prefix in paths
- [ ] `src/privacy.html` back link uses `./home.html`
- [ ] `src/js/fcm-manager.js` uses dynamic service worker paths
- [ ] `.nojekyll` exists in public folder
- [ ] `vite.config.js` has `base: '/AG-Home/'`
- [ ] All changes committed to `master` branch
- [ ] GitHub Actions workflow completed successfully
- [ ] Website accessible at https://ag-pixel-creater.github.io/AG-Home/
- [ ] All pages load without 404 errors
- [ ] Navigation links work correctly
- [ ] Firebase services functional (auth, messaging, firestore, storage)

---

## 🧪 Testing After Deployment

```bash
# Test main page
https://ag-pixel-creater.github.io/AG-Home/

# Test direct page access (tests 404.html functionality)
https://ag-pixel-creater.github.io/AG-Home/about.html
https://ag-pixel-creater.github.io/AG-Home/products.html
https://ag-pixel-creater.github.io/AG-Home/contact.html
https://ag-pixel-creater.github.io/AG-Home/privacy.html

# Test navigation links
# Click through all navigation items to verify links work

# Test Firebase
# Try authentication (login/signup)
# Verify notifications if enabled
# Check Firestore access
# Verify Cloud Storage access
```

---

## 🔧 Troubleshooting

### Issue: GitHub Actions workflow fails during build
**Solution:**
```bash
# 1. Check that all 13 GitHub Secrets are set
gh secret list

# 2. Verify Vite config is correct
cat vite.config.js

# 3. Check build locally
npm install
npm run build

# 4. Review workflow logs on GitHub Actions tab
```

### Issue: Pages show 404 after deployment
**Solution:**
- Verify `public/404.html` exists
- Check GitHub Pages settings: Settings → Pages → Source → Deploy from branch → master
- Ensure branch is set to `master` and folder is root `/`

### Issue: Firebase not working after deployment
**Solution:**
- Verify all 13 GitHub Secrets are correctly set
- Check browser console for errors
- Verify Firebase project is configured for the domain
- Add `ag-pixel-creater.github.io` to Firebase Console → Authentication → Authorized domains

### Issue: CSS/Assets not loading
**Solution:**
- Check that `base: '/AG-Home/'` is in `vite.config.js`
- Verify asset paths use relative imports
- Check browser DevTools → Network tab for 404 errors

### Issue: Service Worker not registering
**Solution:**
- Verify service worker path is correct: `/AG-Home/firebase-messaging-sw.js`
- Check browser console for service worker errors
- Ensure HTTPS is used (required for service workers on GitHub Pages)

---

## 📚 Reference Links

- [Vite Documentation](https://vitejs.dev/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Service Workers MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review GitHub Actions workflow logs
3. Check browser DevTools console for errors
4. Review Firebase Console for configuration issues

---

**Last Updated:** 2026-06-22
**Deployment Status:** Ready for production
**Target URL:** https://ag-pixel-creater.github.io/AG-Home/
