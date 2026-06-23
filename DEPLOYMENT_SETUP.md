# AG-Home GitHub Pages Deployment Setup

## Overview

Your AG-Home website is now configured for **automatic deployment to GitHub Pages** at:
```
https://ag-pixel-creater.github.io/AG-Home/
```

The deployment is **fully automated** via GitHub Actions. When you push to the `master` branch, it will automatically:
1. ✅ Verify all required secrets are set
2. ✅ Build the production bundle with Vite
3. ✅ Verify environment variables are embedded
4. ✅ Deploy to GitHub Pages
5. ✅ Show a detailed deployment summary

---

## What Has Been Set Up

### 1. Code Fixes (GitHub Pages Compatibility)
- ✅ `src/js/app.js` - Fixed navigation redirects for GitHub Pages subpath
- ✅ `src/js/home.js` - Fixed auth state redirects
- ✅ `src/js/control.js` - Fixed access control redirects
- ✅ `src/js/fcm-manager.js` - Dynamic service worker paths for production
- ✅ `vite.config.js` - Correct base path `/AG-Home/`
- ✅ `src/manifest.json` - PWA paths set to `/AG-Home/`
- ✅ `public/404.html` - GitHub Pages error handler for direct page access

### 2. GitHub Actions Workflow
Enhanced automated deployment pipeline with:
- **Step 1-3**: Checkout code, setup Node.js 20, install dependencies
- **Step 4-5**: Create and verify `.env` file from secrets
- **Step 6**: ✨ NEW - Verify all critical GitHub Secrets are set before build
- **Step 7**: Build with Vite, passing all 14 environment variables
- **Step 8**: ✨ NEW - Verify production build and embedded configuration
- **Step 9-11**: Configure Pages, upload artifacts, deploy to GitHub Pages
- **Step 12**: ✨ NEW - Display comprehensive deployment summary with next steps

### 3. Environment Variable Flow

```
GitHub Secrets (Repository Settings)
         ↓
    GitHub Actions Workflow
         ↓
   Environment Variables (Passed to Node.js)
         ↓
   Vite Build Process (Reads from import.meta.env)
         ↓
   Embedded in Production JavaScript (dist/)
         ↓
   Available at Runtime (No .env file needed!)
```

**Important**: Variables are embedded during build time, NOT loaded at runtime. This is secure and efficient for static hosting.

---

## Required GitHub Secrets (14 Total)

### Firebase Configuration (8 Secrets)
Get these from [Firebase Console](https://console.firebase.google.com) → Project Settings:

| Secret Name | Value | Where to Find |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Web API Key | Project Settings → General tab → Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `projectid.firebaseapp.com` | Project Settings → General tab → Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID | Project Settings → General tab → Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `projectid.appspot.com` | Project Settings → General tab → Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Project Settings → Cloud Messaging tab |
| `VITE_FIREBASE_APP_ID` | App ID | Project Settings → General tab → App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Measurement ID (or empty) | Project Settings → General tab (optional) |
| `VITE_FIREBASE_VAPID_KEY` | VAPID Key | Project Settings → Cloud Messaging tab → Web Push certificates |

### Application Configuration (6 Secrets)

| Secret Name | Value | Notes |
|---|---|---|
| `VITE_ADMIN_EMAIL` | Your admin email | Email address with admin access |
| `VITE_ENVIRONMENT` | `production` | Deployment environment |
| `VITE_FUNCTIONS_REGION` | `us-central1` | Your Firebase Functions region |
| `VITE_FUNCTIONS_EMULATOR_HOST` | Empty | Leave empty for production |
| `VITE_FUNCTIONS_EMULATOR_PORT` | Empty | Leave empty for production |
| (Optional) `VITE_FIREBASE_MEASUREMENT_ID` | Analytics ID | From Firebase Console (optional) |

---

## Step-by-Step Deployment Guide

### Phase 1: Gather Firebase Values (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your AG-Home project
3. Click ⚙️ **Project Settings** (bottom left)
4. Copy the 8 values from "General" and "Cloud Messaging" tabs
5. Have them ready for next step

### Phase 2: Set GitHub Secrets (5 minutes)

1. Go to: https://github.com/AG-Pixel-creater/AG-Home/settings/secrets/actions
2. Click **"New repository secret"**
3. For each of the 14 secrets in the table above:
   - **Name**: Exact name from table (e.g., `VITE_FIREBASE_API_KEY`)
   - **Value**: Copy/paste the value from Firebase Console
   - Click **Add secret**
4. Repeat for all 14 secrets

**✅ All 14 secrets should be listed in the Secrets settings page**

### Phase 3: Deploy (1 minute)

1. In your terminal:
   ```bash
   git add .
   git commit -m "feat: enhance GitHub Actions with verification steps"
   git push origin master
   ```

2. Go to: https://github.com/AG-Pixel-creater/AG-Home/actions
3. Watch the workflow run (should complete in ~2 minutes)
4. All 12 steps should show ✅ green checkmarks
5. Check Step 6 output: Should list all 10 required secrets as ✅

### Phase 4: Test the Deployment (5 minutes)

1. **Open the live site**: https://ag-pixel-creater.github.io/AG-Home/
2. **Check console for errors**:
   - Press `F12` → **Console** tab
   - Should show Firebase initialization logs
   - No red error messages
3. **Test navigation**:
   - Click "About Us" → Page loads
   - Click "Products" → Data loads from Firestore
   - Click "Contact" → Form displays
4. **Test authentication**:
   - Click "Sign In" button
   - Should show Firebase Auth form
   - Try signing in with email
5. **Test features**:
   - Create account → Should work
   - Login → Should work
   - Access admin features → If admin account, should show Control Panel

---

## What Each Service Does

### Firebase Authentication ✅
- Enables: Email/password, Google, GitHub, Facebook, Yahoo, Phone sign-in
- Status: Will work immediately after deployment
- Test: Click "Sign In" button

### Firestore Database ✅
- Enables: Read/write access to database
- Status: Will work if you have Firestore collection set up
- Test: Click "Products" page (should load data)

### Cloud Storage ✅
- Enables: File uploads (profile pictures, etc.)
- Status: Available if your app uses file uploads
- Test: Look for file upload features in app

### Cloud Functions ✅
- Enables: Backend logic (email, data processing, etc.)
- Status: Callable from production JavaScript
- Test: Depends on your specific functions

### Cloud Messaging ✅
- Enables: Push notifications to browsers
- Status: Service worker registered at `/AG-Home/firebase-messaging-sw.js`
- Test: Check browser console for: `"Firebase Messaging: Initialization successful"`

---

## Verification Checklist

After deployment, verify:

- [ ] Workflow completed all 12 steps (green checkmarks)
- [ ] Step 6 shows all secrets are set
- [ ] Site loads at https://ag-pixel-creater.github.io/AG-Home/
- [ ] Browser console shows no red errors
- [ ] Sign in button works
- [ ] Products/data loads from Firestore
- [ ] Admin features accessible (if admin account)
- [ ] No "undefined" or "null" values in UI

---

## Troubleshooting

### ❌ Workflow fails at Step 6 (Missing Secrets)
**Problem**: One or more GitHub Secrets not set  
**Solution**:
1. Go to Settings → Secrets and variables → Actions
2. Check which secrets are listed
3. Add any missing ones from the table above
4. Re-push to trigger workflow again

### ❌ Workflow fails at Step 7 (Build fails)
**Problem**: Vite build errors  
**Solution**:
1. Check step output for specific errors
2. Common cause: Invalid secret values (copy/paste issue)
3. Verify Firebase values match exactly from console
4. Check for extra spaces or newlines in secret values

### ❌ Workflow fails at Step 8 (Build verification)
**Problem**: Production build missing files  
**Solution**:
1. Usually indicates build step didn't complete
2. Check Step 7 output for build errors
3. Verify vite.config.js is correct (base: '/AG-Home/')
4. Ensure src/manifest.json exists and is valid JSON

### ❌ Site loads but Firebase doesn't work
**Problem**: Authentication or database not responding  
**Solution**:
1. Press F12 → Console tab
2. Check for Firebase initialization errors
3. Verify all 8 Firebase secrets are correct
4. Check Firebase project is still active in console
5. Verify Firebase service isn't over quota

### ❌ Can't access other pages directly
**Problem**: 404.html routing not working  
**Solution**:
1. This is normal for direct URL access
2. Use site navigation instead of direct URLs
3. Refresh from root page: https://ag-pixel-creater.github.io/AG-Home/
4. 404.html should redirect to appropriate page

---

## How to Update After Initial Deployment

### To Update Code
1. Make changes to your code
2. Test locally with `npm run dev`
3. Commit: `git add . && git commit -m "description"`
4. Push: `git push origin master`
5. Automatic deployment starts immediately

### To Update Environment Variables
1. Go to Settings → Secrets and variables → Actions
2. Click the secret to edit
3. Update the value
4. Redeploy by pushing any commit to master
5. Or manually trigger workflow in Actions tab

### To Update Firebase Configuration
1. Update in Firebase Console
2. Copy new values to GitHub Secrets
3. Re-push to master or trigger workflow manually

---

## Environment Variables in Code

All environment variables are accessed via `import.meta.env`:

```javascript
// In any JavaScript file:
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
console.log(import.meta.env.VITE_ADMIN_EMAIL)
console.log(import.meta.env.VITE_ENVIRONMENT)

// These are ONLY available in production (not in dev console)
// But they ARE embedded in the production build
```

See these files to understand how they're used:
- [src/js/firebase-config.js](src/js/firebase-config.js) - Main Firebase configuration
- [src/js/messaging-config.js](src/js/messaging-config.js) - Cloud Messaging configuration
- [src/firebase-messaging-sw.js](src/firebase-messaging-sw.js) - Service worker Firebase setup

---

## Security Notes

✅ **GitHub Secrets are Secure**:
- Only visible to you and organization owners
- Never displayed in logs
- Encrypted at rest
- Only passed to workflow environment
- Not stored in repository

✅ **Build-time Embedding is Secure**:
- Variables embedded during build, not in .env file
- No .env file deployed to GitHub Pages
- Values only visible in production JavaScript (like any frontend code)
- Secrets never logged or exposed

⚠️ **What Everyone Can See**:
- Your Firebase configuration (normal for frontend apps)
- Your admin email address
- This is expected and necessary for frontend Firebase apps

---

## Next Steps

1. ✅ Gather 14 values from Firebase Console
2. ✅ Set GitHub Secrets in repository settings
3. ✅ Commit and push to master
4. ✅ Watch workflow run in Actions tab
5. ✅ Test deployment at https://ag-pixel-creater.github.io/AG-Home/
6. ✅ Verify all Firebase services work
7. ✅ Share the link!

---

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Firebase Console](https://console.firebase.google.com)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)

---

**Deployment Status**: ✅ Ready to Deploy

All code is prepared, workflow is configured, and documentation is complete.  
Follow the 4-phase guide above to deploy your site!
