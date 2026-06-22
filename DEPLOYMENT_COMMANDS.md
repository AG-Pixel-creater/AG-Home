# GitHub Pages Deployment - EXACT COMMANDS

**Target URL:** https://ag-pixel-creater.github.io/AG-Home/

---

## 🔐 STEP 1: Configure GitHub Secrets (One-time setup)

Open GitHub and navigate to:  
`https://github.com/AG-Pixel-creater/AG-Home/settings/secrets/actions`

Click **"New repository secret"** and add these 14 secrets:

### Required Secrets (Get values from Firebase Console)

```bash
# Using GitHub CLI (Alternative method):
gh secret set VITE_FIREBASE_API_KEY -b "AIzaSyD..."
gh secret set VITE_FIREBASE_AUTH_DOMAIN -b "your-project.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID -b "your-project-id"
gh secret set VITE_FIREBASE_STORAGE_BUCKET -b "your-project.appspot.com"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID -b "123456789"
gh secret set VITE_FIREBASE_APP_ID -b "1:123456789:web:abc123..."
gh secret set VITE_FIREBASE_MEASUREMENT_ID -b "G-XXXXXXXXXX"
gh secret set VITE_FIREBASE_VAPID_KEY -b "BF..."
gh secret set VITE_ADMIN_EMAIL -b "admin@example.com"
gh secret set VITE_ENVIRONMENT -b "production"
gh secret set VITE_FUNCTIONS_REGION -b "us-central1"
gh secret set VITE_FUNCTIONS_EMULATOR_HOST -b ""
gh secret set VITE_FUNCTIONS_EMULATOR_PORT -b ""
```

---

## 🚀 STEP 2: Deploy to GitHub Pages (Main Deployment)

### Option A: Using Git Commands (Recommended)

```bash
# 1. Navigate to project directory
cd /workspaces/AG-Home

# 2. Ensure you're on master branch
git checkout master
git pull origin master

# 3. Stage all changes
git add .

# 4. Commit with descriptive message
git commit -m "chore: deploy to GitHub Pages

- Fixed manifest.json paths for /AG-Home/ base path
- Corrected privacy.html back link to relative path
- Updated service worker registration for GitHub Pages
- Created GitHub Actions deployment workflow (deploy.yml)
- Added .env.example for GitHub Secrets reference
- Created 404.html for direct page access

Deployment URL: https://ag-pixel-creater.github.io/AG-Home/
Firebase Services: Auth, Firestore, Storage, Functions, Messaging"

# 5. Push to master (triggers GitHub Actions)
git push origin master

# 6. Monitor deployment
gh workflow run deploy.yml
gh run list --workflow=deploy.yml
```

### Option B: Using Deploy Script

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
# Follow interactive prompts
```

### Option C: Manual GitHub Web Interface

1. Go to https://github.com/AG-Pixel-creater/AG-Home
2. Check that all files are committed
3. Go to "Actions" tab
4. Select "Deploy to GitHub Pages" workflow
5. Click "Run workflow" → "Run workflow"
6. Monitor the deployment progress

---

## ✅ STEP 3: Verify Deployment

### Monitor GitHub Actions

```bash
# View all workflow runs
gh run list --workflow=deploy.yml

# View specific run details
gh run list --workflow=deploy.yml --limit 1

# Watch live logs
gh run watch --workflow=deploy.yml
```

### Test the Deployed Site

```bash
# Test main page
curl -I https://ag-pixel-creater.github.io/AG-Home/
# Expected: HTTP/2 200

# Test direct page access
curl -I https://ag-pixel-creater.github.io/AG-Home/index.html
curl -I https://ag-pixel-creater.github.io/AG-Home/about.html
curl -I https://ag-pixel-creater.github.io/AG-Home/products.html
curl -I https://ag-pixel-creater.github.io/AG-Home/contact.html
curl -I https://ag-pixel-creater.github.io/AG-Home/privacy.html

# All should return HTTP/2 200
```

### Test in Browser

1. Open https://ag-pixel-creater.github.io/AG-Home/
2. Test navigation links (Home, About, Products, Contact, Privacy)
3. Test direct URLs:
   - https://ag-pixel-creater.github.io/AG-Home/about.html
   - https://ag-pixel-creater.github.io/AG-Home/products.html
   - https://ag-pixel-creater.github.io/AG-Home/contact.html
4. Test Firebase authentication (if enabled)
5. Open DevTools (F12) and verify no 404 errors

---

## 📊 DEPLOYMENT STATUS

After running the commands above, check:

```bash
# Current git status
git status

# Latest commits
git log --oneline -5

# Check if GitHub Actions is configured
gh workflow list

# Check deployment status
gh run list --workflow=deploy.yml --limit 1
```

---

## 🔧 TROUBLESHOOTING

### If GitHub Actions Build Fails

```bash
# 1. Check GitHub Secrets are configured
gh secret list
# All 13 secrets should appear

# 2. Verify Vite config
cat vite.config.js
# Should have: base: '/AG-Home/'

# 3. Test local build
npm install
npm run build
# Should create dist/ folder with HTML files

# 4. Check GitHub Actions logs
gh run list --workflow=deploy.yml
gh run view <RUN_ID> --log
```

### If Pages Show 404

```bash
# 1. Verify 404.html exists
curl https://raw.githubusercontent.com/AG-Pixel-creater/AG-Home/master/public/404.html

# 2. Check GitHub Pages settings
# Go to: https://github.com/AG-Pixel-creater/AG-Home/settings/pages
# Should show: Source: Deploy from branch (master / root)

# 3. Check .nojekyll file exists
curl https://raw.githubusercontent.com/AG-Pixel-creater/AG-Home/master/public/.nojekyll
```

### If Firebase Not Working

```bash
# 1. Verify secrets are set
gh secret list | grep VITE_FIREBASE

# 2. Check environment variables in build
# Look at GitHub Actions logs for "Environment variables loaded"

# 3. Test locally with .env file
cat > .env << EOF
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... add all 14 variables
EOF

npm run build
npm run preview
# Visit http://localhost:4173/AG-Home/
```

---

## 📝 FILES CREATED

Verify these files were created:

```bash
# Check all new files exist
ls -la .env.example
ls -la .github/workflows/deploy.yml
ls -la public/404.html
ls -la DEPLOYMENT_GUIDE.md
ls -la DEPLOYMENT_ANALYSIS.md
ls -la deploy.sh

# Verify modified files
git diff src/manifest.json
git diff src/privacy.html
git diff src/js/fcm-manager.js
```

---

## ✓ DEPLOYMENT CHECKLIST

```
✓ .env.example created in project root
✓ .github/workflows/deploy.yml created
✓ public/404.html created
✓ src/manifest.json updated with /AG-Home/ paths
✓ src/privacy.html back link corrected
✓ src/js/fcm-manager.js service worker paths updated
✓ 14 GitHub Secrets configured
✓ All changes committed to git
✓ Changes pushed to master branch
✓ GitHub Actions workflow triggered
✓ Deployment completed successfully
✓ Website accessible at https://ag-pixel-creater.github.io/AG-Home/
```

---

## 📚 REFERENCE FILES

- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Analysis Report:** [DEPLOYMENT_ANALYSIS.md](./DEPLOYMENT_ANALYSIS.md)
- **Environment Template:** [.env.example](./.env.example)
- **GitHub Actions Workflow:** [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)
- **Error Handler:** [public/404.html](./public/404.html)

---

## ⏱️ ESTIMATED TIME

| Step | Time | Tasks |
|------|------|-------|
| 1. GitHub Secrets | 5 min | Add 13 secrets from Firebase |
| 2. Deploy | 2 min | Commit, push, workflow runs |
| 3. Verify | 5 min | Test URLs, check for errors |
| **Total** | **~12 minutes** | Complete deployment |

---

## 🎯 SUCCESS INDICATORS

When deployment is complete, you should see:

✅ GitHub Actions workflow shows "✓ Deploy to GitHub Pages" in green  
✅ Website loads at https://ag-pixel-creater.github.io/AG-Home/  
✅ All pages accessible: home, about, products, contact, privacy  
✅ Navigation links work correctly  
✅ Direct URLs work: /about.html, /products.html, etc.  
✅ No 404 errors in browser console  
✅ Firebase authentication works  
✅ CSS and images load correctly  

---

## 🔗 DEPLOYMENT URL

**Main URL:** https://ag-pixel-creater.github.io/AG-Home/  
**Repository:** https://github.com/AG-Pixel-creater/AG-Home  
**GitHub Actions:** https://github.com/AG-Pixel-creater/AG-Home/actions  

---

**Last Updated:** 2026-06-22  
**Status:** Ready for Production Deployment
