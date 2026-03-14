# 🔐 Security Setup Guide

This guide walks you through securing your AG Home application by using environment variables instead of hardcoded secrets.

## ⚠️ CRITICAL: What You Must Do First

### 1. Never Commit Secrets
**IMPORTANT:** Your `.env` file contains sensitive credentials. It is **ALREADY** listed in `.gitignore` to prevent accidental commits.

Verify that `.gitignore` contains:
```
.env
.env.local
.env.*.local
```

### 2. Review Exposed Keys (URGENT)
The following Firebase API keys were previously hardcoded and are now exposed:
- **API Key:** `AIzaSyBfu4YI21vaAPeW6WbElRL56PHbxl6knb0`
- **Admin Email:** `ag.aliengamerz@gmail.com`, `hamza.datashare@gmail.com`

**YOU SHOULD:**
1. ✅ Rotate your Firebase API key in [Firebase Console](https://console.firebase.google.com)
2. ✅ Review and revoke any potentially compromised tokens
3. ✅ Check your Firebase Cloud Logs for unauthorized access
4. ✅ Enable API key restrictions in Firebase Console

---

## 🚀 Setup Steps

### Step 1: Create .env File (Client)

```bash
# In project root
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

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
VITE_FUNCTIONS_EMULATOR_HOST=localhost
VITE_FUNCTIONS_EMULATOR_PORT=5001
```

### Step 2: Create .env File (Cloud Functions)

```bash
# In functions/ directory
cp .env.example .env.local
```

Edit `functions/.env.local`:

```plaintext
ADMIN_EMAIL=ag.aliengamerz@gmail.com
ALLOWED_ADMIN_EMAILS=ag.aliengamerz@gmail.com,hamza.datashare@gmail.com
ENVIRONMENT=development
```

### Step 3: Install Dependencies

```bash
# Root directory
npm install

# Functions directory
cd functions
npm install
cd ..
```

### Step 4: Verify Environment Variables Load

Test that environment variables are loaded correctly:

```bash
# Dev server will now use .env values
npm run dev
```

Check browser console:
- Should see: `[firebase-config] Connected Functions emulator...` (if running locally)
- Should NOT see any undefined values for Firebase config

---

## 🔍 Verification Checklist

- [ ] `.env` file exists in project root
- [ ] `functions/.env.local` exists in functions directory
- [ ] Both files are listed in `.gitignore`
- [ ] `npm run dev` starts without errors
- [ ] Browser console shows Firebase initialized (check for errors)
- [ ] Git status shows `.env` as untracked (not staged)
- [ ] Run `git status` to confirm - should show `.env` NOT in staging area

---

## 📋 Environment Variables Reference

### Client-Side (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase authentication key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `ag-home-3db3f.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `ag-home-3db3f` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `ag-home-3db3f.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | `384219186370` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:384219186370:web:...` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics ID | `G-5W214BQMNJ` |
| `VITE_FUNCTIONS_REGION` | Functions region | `us-central1` |
| `VITE_ADMIN_EMAIL` | Primary admin email | `admin@example.com` |
| `VITE_ENVIRONMENT` | Environment type | `development` or `production` |
| `VITE_FUNCTIONS_EMULATOR_HOST` | Emulator host (local dev) | `localhost` |
| `VITE_FUNCTIONS_EMULATOR_PORT` | Emulator port (local dev) | `5001` |

### Server-Side (functions/.env.local)

| Variable | Purpose | Example |
|----------|---------|---------|
| `ADMIN_EMAIL` | Primary admin email | `admin@example.com` |
| `ALLOWED_ADMIN_EMAILS` | Comma-separated admin emails | `admin1@example.com,admin2@example.com` |
| `ENVIRONMENT` | Environment type | `development` or `production` |

---

## 🔑 Firebase Console Configuration

### API Key Restrictions

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Project Settings → API Keys
3. Click your Browser API Key
4. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain: `yourdomain.com/*`
5. Under "API restrictions":
   - Select "Restrict key"
   - Choose only required APIs (don't allow all)

### Authentication Settings

1. Authentication → Settings
2. Authorized domains: Add `localhost:5173` and your production domain
3. Email/Password: Enable
4. Enable any other auth providers as needed

---

## 🚨 Security Best Practices

### DO:
✅ Always use `.env` files for secrets
✅ Add `.env*` to `.gitignore`
✅ Rotate credentials regularly
✅ Use different keys for development and production
✅ Enable API key restrictions
✅ Monitor Cloud Logs for suspicious activity
✅ Use environment-specific configurations
✅ Implement Firestore security rules
✅ Enable audit logging

### DON'T:
❌ Hardcode API keys in source files
❌ Commit `.env` files to version control
❌ Share `.env` files over email or messaging
❌ Use same credentials for dev and production
❌ Log sensitive data to console in production
❌ Expose Firebase config to client without restrictions
❌ Use weak authentication rules
❌ Skip environment variable checks

---

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
cd functions && npm install && cd ..
```

### Environment variables showing as undefined
1. Restart dev server: `npm run dev`
2. Check `.env` file exists in correct location
3. Verify variable names have `VITE_` prefix (client-side)
4. Check no spaces around `=` in `.env` file

### Firebase config not initializing
1. Check browser console for errors
2. Verify all environment variables are set
3. Check `.env` file permissions
4. Clear browser cache and reload

### Functions still using hardcoded values
1. Verify `functions/.env.local` exists
2. Restart Functions emulator: `firebase emulators:start`
3. Check `dotenv` is installed: `npm list dotenv` in functions directory

---

## 📝 Files Modified

| File | Changes |
|------|---------|
| `src/js/firebase-config.js` | Uses env vars, removed hardcoded keys |
| `functions/index.js` | Uses env vars, removed email hardcoding |
| `functions/package.json` | Added dotenv dependency |
| `package.json` | Added dotenv dependency |
| `.gitignore` | Added .env file patterns |
| `.env.example` | Created template with all variables |
| `functions/.env.example` | Created template for functions |

---

## 🔄 Git Best Practices

### Before first commit:
```bash
# Verify .env is in gitignore
cat .gitignore | grep .env

# Check git status
git status

# .env should show as UNTRACKED (not in staging area)
# If it shows as "Changes to be committed", STOP and remove it:
git rm --cached .env
```

### Safe commit flow:
```bash
# Add all files except .env (already in .gitignore)
git add .

# Verify .env is NOT listed
git status

# Commit with message about security improvements
git commit -m "chore: secure sensitive data using environment variables"

# Push to remote
git push
```

---

## 📞 Support Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/security/overview)
- [Dotenv Documentation](https://github.com/motdotla/dotenv)
- [OWASP: Secrets Management](https://owasp.org/www-project-api-security/)

---

**Last Updated:** March 2026
**Security Status:** Environment variables configured ✅
