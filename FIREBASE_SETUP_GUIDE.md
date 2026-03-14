# Firebase Configuration Guide for New Login Methods

## Quick Setup Steps

### Step 1: Enable Phone Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ag-home-3db3f**
3. Go to **Authentication** → **Sign-in method**
4. Find **Phone** in the provider list
5. Click on it and enable it
6. Configure test phone numbers (optional for development):
   - Add test numbers in the format: +1 555-555-5555
   - Add reCAPTCHA enterprise or v2

### Step 2: Configure reCAPTCHA (Required for Phone Auth)

**Option A: reCAPTCHA v2 Checkbox (Recommended)**
1. In Authentication > Sign-in method
2. Find "reCAPTCHA enterprise" section
3. Click **Create key**
4. Select **reCAPTCHA v2 → Checkbox**
5. Name it "ag-home-phone-auth"
6. Complete the setup

**Option B: reCAPTCHA v3**
1. Same steps but select "reCAPTCHA v3"
2. No user interaction required

### Step 3: Facebook Login Setup (Optional)

#### On Facebook Developer Console:
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app or use existing
3. Add "Facebook Login" product
4. Go to Settings → Basic
5. Copy your **App ID** and **App Secret**

#### In Firebase Console:
1. Go to Authentication > Sign-in method
2. Add custom OAuth provider or use authenticated flow
3. Add your app's domain to Facebook App's App Domains

### Step 4: Yahoo Login Setup (Optional)

#### On Yahoo Developer Console:
1. Go to [developer.yahoo.com](https://developer.yahoo.com)
2. Create an application
3. Get **Client ID** and **Client Secret**
4. Set Redirect URI to: `https://ag-home-3db3f.firebaseapp.com/__/auth/handler`

#### In Firebase Console:
1. Go to Authentication > Sign-in method
2. Click **Add new provider** > **Custom OAuth provider**
3. Fill in:
   - Provider ID: `yahoo.com`
   - Client ID: [Your Yahoo Client ID]
   - Client Secret: [Your Yahoo Client Secret]
   - Authorization URL: `https://api.login.yahoo.com/oauth2/request_auth`
   - Token URL: `https://api.login.yahoo.com/oauth2/get_token`
   - Scopes: `profile email`

### Step 5: Testing Setup

#### Test Phone Numbers (for development):
1. In Firebase Console, go to Authentication
2. Find Phone section
3. Under "Test phone numbers and verification codes":
   - Phone Number: +1 555-555-5555
   - Verification Code: 123456

#### Test Other Providers:
- Use test accounts from Facebook/Yahoo
- Test with real user accounts in development

---

## Environment Variables (Optional)

If using environment variables, add to `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSyBfu4YI21vaAPeW6WbElRL56PHbxl6knb0
VITE_FIREBASE_AUTH_DOMAIN=ag-home-3db3f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ag-home-3db3f
VITE_FIREBASE_STORAGE_BUCKET=ag-home-3db3f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=384219186370
VITE_FIREBASE_APP_ID=1:384219186370:web:b6b69a39d6cc5affa8e75b
VITE_FIREBASE_MEASUREMENT_ID=G-5W214BQMNJ

# Optional - Functions region
VITE_FUNCTIONS_REGION=us-central1
VITE_FUNCTIONS_EMULATOR_HOST=localhost
VITE_FUNCTIONS_EMULATOR_PORT=5001
```

---

## Verification Checklist

After setup, verify:

- [ ] **Phone Auth Enabled**
  - [ ] SMS provider configured
  - [ ] reCAPTCHA enabled
  - [ ] Test numbers added (optional)

- [ ] **Facebook Login** (if enabled)
  - [ ] App created on Facebook Developer
  - [ ] OAuth configured in Firebase
  - [ ] Test accounts ready

- [ ] **Yahoo Login** (if enabled)
  - [ ] OAuth provider set up in Firebase
  - [ ] Client credentials configured
  - [ ] Test accounts ready

- [ ] **Application**
  - [ ] All buttons render correctly
  - [ ] Modal opens/closes properly
  - [ ] Each provider tested manually

---

## Deployment Checklist

Before going to production:

- [ ] **Security**
  - [ ] All API keys secured (no hardcode in production)
  - [ ] reCAPTCHA configured properly
  - [ ] OAuth redirect URIs whitelisted
  - [ ] CORS settings correct

- [ ] **Functionality**
  - [ ] All login methods tested
  - [ ] Error messages display correctly
  - [ ] Loading states implemented
  - [ ] Session management working

- [ ] **Providers**
  - [ ] Facebook rates/limits understood
  - [ ] Yahoo service availability confirmed
  - [ ] Phone service provider selected
  - [ ] SMS delivery working reliably

- [ ] **Monitoring**
  - [ ] Error logging enabled
  - [ ] Analytics tracking configured
  - [ ] User session tracking enabled
  - [ ] Rate limiting in place

---

## Troubleshooting

### Phone Authentication Not Working

**Problem:** "reCAPTCHA not initialized"
- **Solution:** Make sure reCAPTCHA is enabled in Firebase Console

**Problem:** "Invalid phone number format"
- **Solution:** Use format with country code: +1 (555) 555-5555 or +15555555555

**Problem:** "OTP not received"
- **Solution:** 
  - Check phone number is correct
  - Check SMS provider is active in Firebase
  - Wait a few moments for SMS delivery

### OAuth Provider Issues

**Problem:** "Popup blocked"
- **Solution:** Ensure popups are allowed for your domain

**Problem:** "Redirect URI mismatch"
- **Solution:** Verify redirect URI matches in provider console

**Problem:** "Permission denied"
- **Solution:** Check scopes are correct in OAuth provider setup

---

## Support Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Phone Auth Guide:** https://firebase.google.com/docs/auth/web/phone-auth
- **OAuth Guide:** https://firebase.google.com/docs/auth/web/federated-auth
- **Authentication Troubleshooting:** https://firebase.google.com/docs/auth/troubleshooting

---

Contact Firebase Support or consult documentation for implementation questions.
