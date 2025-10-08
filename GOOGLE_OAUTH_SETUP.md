# 🔐 Google OAuth Setup Guide

## Complete Guide to Setting Up Google Sign-In

This guide will walk you through configuring Google OAuth for your e-commerce application.

---

## 📋 Prerequisites

- Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Access to [Supabase Dashboard](https://app.supabase.com/)
- Your Supabase project URL: `https://fuxgceherfxekwttmsjh.supabase.co`

---

## 🚀 Step-by-Step Setup

### **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project"
4. Enter project details:
   - **Project name**: My E-Commerce App
   - **Organization**: (optional)
5. Click "Create"
6. Wait for the project to be created
7. Select your new project from the dropdown

---

### **Step 2: Enable Google+ API**

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on "Google+ API"
4. Click "Enable"
5. Wait for the API to be enabled

---

### **Step 3: Configure OAuth Consent Screen**

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select **"External"** user type
3. Click "Create"

#### **OAuth Consent Screen Configuration:**

**App Information:**
- **App name**: My E-Commerce
- **User support email**: your-email@example.com
- **App logo**: (optional) Upload your logo
- **Application home page**: http://localhost:3000 (for dev) or your production URL
- **Application privacy policy link**: (optional)
- **Application terms of service link**: (optional)

**Developer Contact Information:**
- **Email addresses**: your-email@example.com

4. Click "Save and Continue"

**Scopes:**
- Click "Add or Remove Scopes"
- Select:
  - `email`
  - `profile`
  - `openid`
- Click "Update"
- Click "Save and Continue"

**Test Users:** (Optional for development)
- Add your email and any other test user emails
- Click "Save and Continue"

5. Click "Back to Dashboard"

---

### **Step 4: Create OAuth 2.0 Client ID**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. If prompted, configure the consent screen (already done in Step 3)

#### **OAuth Client Configuration:**

**Application type**: Web application

**Name**: My E-Commerce Web App

**Authorized JavaScript origins:**
Add these URLs:
```
http://localhost:3000
http://127.0.0.1:3000
https://yourdomain.com (for production)
```

**Authorized redirect URIs:**
Add this URL (this is the Supabase callback):
```
https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
```

4. Click "Create"

5. **Important**: A dialog will appear with your credentials:
   - **Client ID**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-abc123xyz789`
   
   **COPY THESE NOW!** You'll need them for Supabase and your `.env.local` file.

6. Click "OK"

---

### **Step 5: Configure Supabase**

1. Go to [Supabase Dashboard](https://app.supabase.com/project/fuxgceherfxekwttmsjh)
2. Navigate to **Authentication** → **Providers**
3. Scroll down to find **Google**
4. Toggle to **enable** Google provider

#### **Google Provider Configuration:**

**Client ID (for OAuth)**:
```
Paste your Google Client ID here
```

**Client Secret (for OAuth)**:
```
Paste your Google Client Secret here
```

**Redirect URL** (auto-filled):
```
https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
```

**Skip nonce check**: Leave unchecked (default)

5. Click "Save"

---

### **Step 6: Update Environment Variables**

Add these to your `.env.local` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
CALLBACK_URL=https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
```

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xyz789abc123
CALLBACK_URL=https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
```

---

### **Step 7: Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Testing Google OAuth

### **Test Flow:**

1. **Visit Sign-Up Page**:
   ```
   http://localhost:3000/auth/signup
   ```

2. **Click "Continue with Google"**

3. **You should see**:
   - Google sign-in popup
   - List of Google accounts to choose from
   - Permission request screen

4. **Select your Google account**

5. **Grant permissions**:
   - The app will request access to:
     - Your email address
     - Your basic profile info (name, photo)

6. **After authorization**:
   - Redirected back to your app
   - Automatically signed in
   - Redirected to dashboard (`/dashboard`)

---

## 🔍 Verification Checklist

### **Google Cloud Console:**
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized JavaScript origins include `http://localhost:3000`
- [ ] Authorized redirect URIs include Supabase callback URL
- [ ] Client ID and Secret copied

### **Supabase Dashboard:**
- [ ] Google provider enabled
- [ ] Client ID pasted
- [ ] Client Secret pasted
- [ ] Configuration saved

### **Environment Variables:**
- [ ] `GOOGLE_CLIENT_ID` added to `.env.local`
- [ ] `GOOGLE_CLIENT_SECRET` added to `.env.local`
- [ ] `CALLBACK_URL` added to `.env.local`
- [ ] Dev server restarted

### **Application:**
- [ ] "Continue with Google" button visible
- [ ] Button triggers Google sign-in popup
- [ ] Can select Google account
- [ ] Redirects back to app after authorization
- [ ] User signed in and redirected to dashboard

---

## 🐛 Troubleshooting

### **Issue: "Error 400: redirect_uri_mismatch"**

**Cause**: The redirect URI doesn't match what's configured in Google Cloud Console

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Ensure **Authorized redirect URIs** includes:
   ```
   https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
   ```
4. Save changes
5. Wait 5 minutes for changes to propagate

---

### **Issue: "Access blocked: This app's request is invalid"**

**Cause**: OAuth consent screen not properly configured

**Solution**:
1. Go to OAuth consent screen settings
2. Verify all required fields are filled
3. Publish the app (if needed)
4. Add your email as a test user

---

### **Issue: Google button doesn't work**

**Cause**: Missing environment variables or Supabase not configured

**Solution**:
1. Check `.env.local` has all Google OAuth variables
2. Restart dev server: `npm run dev`
3. Verify Supabase dashboard shows Google provider enabled
4. Check browser console for errors

---

### **Issue: "Cookies not set" or "Session not found"**

**Cause**: OAuth callback not handling session correctly

**Solution**:
1. Check that `/auth/callback` route exists
2. Verify cookies are being set (DevTools → Application → Cookies)
3. Ensure callback URL matches in Google and Supabase

---

## 📝 Production Deployment

### **When deploying to production:**

1. **Update Google Cloud Console**:
   - Add your production domain to Authorized JavaScript origins:
     ```
     https://yourdomain.com
     ```
   - Keep the Supabase callback URL (doesn't change)

2. **Update Environment Variables**:
   - In your hosting platform (Vercel, etc.)
   - Set the same Google OAuth variables
   - Update `NEXT_PUBLIC_SITE_URL` to your production URL

3. **Verify OAuth Consent Screen**:
   - Ensure it's published (not in testing mode)
   - Or add all users as test users

---

## 🔐 Security Best Practices

### **DO:**
- ✅ Keep Client Secret in backend only (never expose to frontend)
- ✅ Use HTTPS in production
- ✅ Verify OAuth callback domain matches
- ✅ Set up proper CORS policies
- ✅ Use SameSite cookies

### **DON'T:**
- ❌ Commit `.env.local` to git
- ❌ Expose Client Secret to frontend
- ❌ Use HTTP in production
- ❌ Skip OAuth consent screen configuration

---

## 📊 What Data Google Provides

When a user signs in with Google, you receive:

```typescript
{
  id: "google-user-id",
  email: "user@gmail.com",
  email_verified: true,
  name: "John Doe",
  picture: "https://lh3.googleusercontent.com/...",
  given_name: "John",
  family_name: "Doe"
}
```

This data is automatically:
- Stored in `auth.users` table (Supabase)
- Available via `getUser()` API call
- Used to create user profile

---

## 🎯 Next Steps

After Google OAuth is working:

1. **Test with multiple Google accounts**
2. **Test sign-out and sign-in again**
3. **Verify user data in Supabase Dashboard**
4. **Add profile picture from Google**
5. **Customize user profile with Google data**

---

## 📚 Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

**Created**: October 8, 2025  
**Purpose**: Complete Google OAuth setup guide  
**Status**: ✅ Ready to follow  
**Supabase Project**: fuxgceherfxekwttmsjh

