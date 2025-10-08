# 🧪 Authentication Flows Testing Guide

## Testing Email OTP and Google OAuth

This guide will help you test both authentication methods to ensure they work correctly.

---

## 📋 Prerequisites

Before testing, ensure:
- [ ] Development server is running: `npm run dev`
- [ ] `.env.local` file has all required variables
- [ ] Supabase project is accessible
- [ ] Google OAuth is configured (if testing Google sign-in)

---

## 🔐 Email OTP Flow (Magic Link)

### **How It Works:**

1. User enters email address
2. Backend sends magic link to email via Supabase
3. User clicks link in email
4. Link contains auth code
5. Callback route exchanges code for session
6. User is authenticated and redirected

### **Testing Steps:**

#### **1. Start the Flow**
```
Visit: http://localhost:3000/auth/signup
or     http://localhost:3000/auth/signin
```

#### **2. Select Magic Link**
- Click the "Magic Link" tab in the auth form
- Enter your email address
- Click "Send Magic Link"

#### **3. Expected Result:**
```
✅ Success message: "Magic link sent! Check your email to sign in."
```

#### **4. Check Your Email**
- Open your email inbox
- Look for email from Supabase
- Subject: "Confirm your signup" or "Magic Link"
- **Note**: Check spam folder if not found

#### **5. Email Content:**
```
Subject: Confirm your signup

Click the link below to confirm your email address and sign in:

[Confirm your email] <- Click this button

Or copy and paste this URL: https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/verify?...
```

#### **6. Click the Link**
- Click the confirmation button/link
- You should be redirected to your app

#### **7. Expected Flow:**
```
Email Link
  ↓
Supabase Verification
  ↓
Redirect to: http://localhost:3000/auth/callback?code=...
  ↓
Backend exchanges code for session
  ↓
Sets cookies (access_token, refresh_token)
  ↓
Redirects to: http://localhost:3000/dashboard
```

#### **8. Verify Success:**
- [ ] You're on `/dashboard` page
- [ ] You see your email displayed
- [ ] No errors in console
- [ ] Cookies are set (DevTools → Application → Cookies)

---

## 🔵 Google OAuth Flow

### **How It Works:**

1. User clicks "Continue with Google"
2. Frontend calls backend OAuth API
3. Backend generates OAuth URL via Supabase
4. User redirected to Google sign-in
5. User selects Google account and grants permissions
6. Google redirects to Supabase callback with auth code
7. Callback route exchanges code for session
8. User is authenticated and redirected to dashboard

### **Testing Steps:**

#### **1. Ensure Google OAuth is Configured**
- [ ] Google Cloud Console OAuth client created
- [ ] Supabase Google provider enabled
- [ ] Environment variables set (`GOOGLE_CLIENT_ID`, etc.)
- [ ] Dev server restarted after adding env vars

#### **2. Start the Flow**
```
Visit: http://localhost:3000/auth/signup
or     http://localhost:3000/auth/signin
```

#### **3. Click Google Button**
- Click "Continue with Google" button
- **Expected**: Popup or redirect to Google sign-in

#### **4. Google Sign-In Screen**
```
Sign in with Google

Choose an account to continue to My E-Commerce

[user1@gmail.com]  ← Select your Google account
[user2@gmail.com]
[Use another account]
```

#### **5. Select Your Account**
- Click on your Google account
- **First time**: You'll see permission request screen

#### **6. Permission Screen (First Time Only):**
```
My E-Commerce wants to access your Google Account

This will allow My E-Commerce to:
✓ View your email address
✓ View your basic profile info

[user@gmail.com]

[Cancel] [Continue]  ← Click Continue
```

#### **7. Expected Flow After Permission:**
```
Google Authorization
  ↓
Redirect to Supabase with auth code
  ↓
Redirect to: http://localhost:3000/auth/callback?code=...
  ↓
Backend exchanges code for session
  ↓
Sets cookies (access_token, refresh_token)
  ↓
Redirects to: http://localhost:3000/dashboard
```

#### **8. Verify Success:**
- [ ] You're on `/dashboard` page
- [ ] You see your Google email displayed
- [ ] Profile includes Google data
- [ ] No errors in console
- [ ] Cookies are set

---

## 📊 Network Inspection

### **Using Browser DevTools:**

#### **1. Open DevTools**
- Press `F12` or `Cmd+Option+I` (Mac)
- Go to "Network" tab
- Keep it open while testing

#### **2. For Email OTP, you should see:**

```
Request: POST http://localhost:3000/api/auth/signin-otp
Request Body: { "email": "user@example.com" }
Response: { "success": true, "message": "Magic link sent to your email" }
Status: 200 OK
```

#### **3. For Google OAuth, you should see:**

```
1. Request: POST http://localhost:3000/api/auth/oauth
   Request Body: { "provider": "google" }
   Response: { "success": true, "url": "https://accounts.google.com/o/oauth2/v2/auth?..." }
   Status: 200 OK

2. Redirect: https://accounts.google.com/o/oauth2/v2/auth?...
   (Google sign-in page)

3. Redirect: https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback?code=...
   (Supabase processes auth)

4. Redirect: http://localhost:3000/auth/callback?code=...
   (Your app processes callback)

5. Redirect: http://localhost:3000/dashboard
   (Final destination)
```

---

## 🍪 Cookie Verification

### **Check Session Cookies:**

1. **Open DevTools**
2. **Go to**: Application → Cookies → `http://localhost:3000`

#### **Expected Cookies:**

| Name | Value | HttpOnly | Secure | SameSite | Max-Age |
|------|-------|----------|--------|----------|---------|
| `access_token` | `eyJhbG...` | ✅ Yes | Dev: No | Lax | 7 days |
| `refresh_token` | `v1-re...` | ✅ Yes | Dev: No | Lax | 30 days |

#### **Verify:**
- [ ] Both cookies present
- [ ] HttpOnly flag is set (can't access via JavaScript)
- [ ] Values are long encrypted strings
- [ ] Max-Age is set correctly

---

## 🔍 Supabase Dashboard Verification

### **Check User Created:**

1. Go to [Supabase Dashboard](https://app.supabase.com/project/fuxgceherfxekwttmsjh)
2. Navigate to **Authentication** → **Users**
3. Find your user in the list

#### **For Email OTP User:**
```
Email: user@example.com
Provider: email
Confirmed: Yes (after clicking email link)
Created: [timestamp]
Last Sign In: [timestamp]
```

#### **For Google OAuth User:**
```
Email: user@gmail.com
Provider: google
Confirmed: Yes (auto-confirmed)
Created: [timestamp]
Last Sign In: [timestamp]
User Metadata: {
  avatar_url: "https://lh3.googleusercontent.com/...",
  email: "user@gmail.com",
  email_verified: true,
  full_name: "John Doe",
  iss: "https://accounts.google.com",
  name: "John Doe",
  picture: "https://lh3.googleusercontent.com/...",
  provider_id: "1234567890",
  sub: "1234567890"
}
```

---

## 🧪 Complete Test Scenarios

### **Scenario 1: New User Sign-Up with Email OTP**

```
1. Visit /auth/signup
2. Select "Magic Link" tab
3. Enter email: newuser@example.com
4. Click "Send Magic Link"
5. Check email
6. Click magic link
7. Redirected to /dashboard
8. User created in Supabase
✅ Test passed
```

### **Scenario 2: Existing User Sign-In with Email OTP**

```
1. Visit /auth/signin
2. Select "Magic Link" tab
3. Enter existing email
4. Click "Send Magic Link"
5. Check email
6. Click magic link
7. Redirected to /dashboard
8. Last sign-in updated in Supabase
✅ Test passed
```

### **Scenario 3: New User Sign-Up with Google**

```
1. Visit /auth/signup
2. Click "Continue with Google"
3. Select Google account
4. Grant permissions (first time)
5. Redirected to /dashboard
6. User created in Supabase with Google provider
7. Profile includes Google avatar and name
✅ Test passed
```

### **Scenario 4: Existing User Sign-In with Google**

```
1. Visit /auth/signin
2. Click "Continue with Google"
3. Select same Google account
4. No permission screen (already granted)
5. Redirected to /dashboard
6. Last sign-in updated
✅ Test passed
```

### **Scenario 5: Sign-Out**

```
1. On /dashboard
2. Click "Sign Out" button
3. Cookies cleared
4. Redirected to /
5. Try accessing /dashboard
6. Redirected to /auth/signin
✅ Test passed
```

### **Scenario 6: Protected Route Access**

```
1. While signed out
2. Try to visit /dashboard directly
3. Middleware checks for cookie
4. No access_token cookie found
5. Redirected to /auth/signin
✅ Test passed
```

---

## ⚠️ Common Issues & Solutions

### **Issue: Email not received**

**Possible Causes:**
- Email in spam folder
- Supabase email settings
- Email provider blocking

**Solutions:**
1. Check spam/junk folder
2. Add `noreply@mail.app.supabase.io` to contacts
3. Check Supabase email settings: Authentication → Email Templates
4. Try with different email provider (Gmail, etc.)

---

### **Issue: Google OAuth button does nothing**

**Possible Causes:**
- Missing environment variables
- Google provider not enabled in Supabase
- Incorrect redirect URI

**Solutions:**
1. Check `.env.local` has Google OAuth variables
2. Restart dev server
3. Verify Supabase Google provider is enabled
4. Check browser console for errors
5. Verify redirect URI in Google Cloud Console

---

### **Issue: "redirect_uri_mismatch" error**

**Cause:** Redirect URI in Google Cloud doesn't match Supabase callback

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit OAuth 2.0 Client ID
3. Add to Authorized redirect URIs:
   ```
   https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
   ```
4. Save and wait 5 minutes

---

### **Issue: Redirected to /auth/auth-code-error**

**Cause:** OAuth code exchange failed

**Solutions:**
1. Check backend logs for errors
2. Verify Supabase credentials are correct
3. Check if auth code is valid (not expired)
4. Ensure callback route is working

---

### **Issue: Cookies not set**

**Cause:** Cookie configuration issue

**Solutions:**
1. Check callback route sets cookies correctly
2. Verify cookie settings (httpOnly, sameSite, path)
3. Check browser allows cookies
4. In dev, secure should be `false`

---

## 📝 Testing Checklist

### **Before Testing:**
- [ ] `.env.local` file exists with all variables
- [ ] Dev server running (`npm run dev`)
- [ ] Can access `http://localhost:3000`
- [ ] Supabase project accessible
- [ ] Email inbox accessible
- [ ] Google account ready (for OAuth testing)

### **Email OTP Tests:**
- [ ] Can send magic link
- [ ] Receive email with link
- [ ] Link redirects correctly
- [ ] Session created
- [ ] Cookies set
- [ ] User created in Supabase
- [ ] Can access dashboard

### **Google OAuth Tests:**
- [ ] Google button visible
- [ ] Button triggers Google sign-in
- [ ] Can select Google account
- [ ] Permission screen shows (first time)
- [ ] Redirects after authorization
- [ ] Session created
- [ ] Cookies set
- [ ] User created with Google provider
- [ ] Can access dashboard

### **General Tests:**
- [ ] Sign-out works
- [ ] Cookies cleared on sign-out
- [ ] Protected routes require auth
- [ ] Middleware redirects correctly
- [ ] No console errors

---

## 🎯 Success Criteria

### **Email OTP Flow:**
✅ User receives email within 1 minute  
✅ Magic link works and authenticates user  
✅ Redirects to dashboard automatically  
✅ Session persists across page refreshes  
✅ User data visible in Supabase  

### **Google OAuth Flow:**
✅ Google sign-in popup/redirect works  
✅ User can select Google account  
✅ Permissions granted successfully  
✅ Redirects to dashboard automatically  
✅ Google profile data saved (email, name, picture)  
✅ Session persists across page refreshes  

---

**Created**: October 8, 2025  
**Purpose**: Authentication flows testing guide  
**Status**: ✅ Ready for testing

