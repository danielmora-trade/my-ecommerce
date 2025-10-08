# 🔐 Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# ==================== SUPABASE CONFIGURATION ====================

# Supabase Project URL (Public - Safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anonymous Key (Public - Safe for client)
# This key is safe to expose as it works with RLS policies
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Service Role Key (BACKEND ONLY - Keep Secret!)
# ⚠️ WARNING: Never expose this to the frontend!
# This key bypasses RLS and has full database access
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ==================== SITE CONFIGURATION ====================

# Your site URL (used for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# API URL (optional, defaults to /api)
NEXT_PUBLIC_API_URL=/api

# ==================== GOOGLE OAUTH CONFIGURATION ====================

# Google OAuth Client ID (Public - Safe for client)
# Get from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id_here

# Google OAuth Client Secret (BACKEND ONLY - Keep Secret!)
# ⚠️ WARNING: Never expose this to the frontend!
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# OAuth Callback URL (for Google OAuth configuration)
# This should match the redirect URI in Google Cloud Console
CALLBACK_URL=https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
```

---

## How to Get These Values

### **1. Supabase Project URL**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL"

### **2. Supabase Anonymous Key**
1. In the same API settings page
2. Copy the "anon" key under "Project API keys"

### **3. Supabase Service Role Key**
1. In the same API settings page
2. Copy the "service_role" key under "Project API keys"
3. ⚠️ **IMPORTANT**: Keep this secret! Never commit to git!

### **4. Google OAuth Client ID and Secret**

#### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" → "Credentials"

#### **Step 2: Configure OAuth Consent Screen**
1. Click "OAuth consent screen" in the left sidebar
2. Select "External" user type
3. Fill in required fields:
   - **App name**: My E-Commerce
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click "Save and Continue"
5. Skip "Scopes" (click "Save and Continue")
6. Add test users if needed
7. Click "Save and Continue"

#### **Step 3: Create OAuth 2.0 Credentials**
1. Click "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Select "Web application"
4. Configure:
   - **Name**: My E-Commerce Web App
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback`
5. Click "Create"
6. **Copy the Client ID and Client Secret** (you'll need these!)

#### **Step 4: Configure Supabase**
1. Go to [Supabase Dashboard](https://app.supabase.com/project/fuxgceherfxekwttmsjh)
2. Navigate to Authentication → Providers
3. Find "Google" in the list
4. Enable Google provider
5. Paste your **Client ID** and **Client Secret**
6. Click "Save"

### **5. Callback URL**
The callback URL is automatically set by Supabase:
```
https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
```

This URL must be added to:
- Google Cloud Console → Authorized redirect URIs
- Your application's OAuth configuration

---

## Environment File Example

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fuxgceherfxekwttmsjh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
CALLBACK_URL=https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
```

---

## Security Notes

### ✅ **Safe to Expose (NEXT_PUBLIC_*)**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`

These are exposed to the browser but safe because:
- Anon key works with Row Level Security (RLS)
- RLS policies prevent unauthorized access
- No sensitive data exposed

### ❌ **MUST Keep Secret**
- `SUPABASE_SERVICE_ROLE_KEY`

This key:
- Bypasses ALL RLS policies
- Has full database access
- Should ONLY be used in backend code
- Must NEVER be exposed to the frontend

---

## Verifying Your Setup

### **1. Check Environment Variables are Loaded**

```typescript
// In a server component or API route
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Service Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
```

### **2. Test Backend Connection**

```bash
# Start the dev server
npm run dev

# Try signing up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Production Deployment

### **Vercel**

1. Go to your project settings
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)

### **Other Platforms**

Add the same environment variables to your hosting platform's environment configuration.

---

## Common Issues

### **Issue: "Missing Supabase environment variables"**

**Cause**: Environment variables not loaded

**Solution**:
1. Ensure `.env.local` exists in project root
2. Restart dev server: `npm run dev`
3. Check variable names match exactly

### **Issue: "Invalid API key"**

**Cause**: Wrong key or expired key

**Solution**:
1. Go to Supabase Dashboard
2. Regenerate API keys if needed
3. Update `.env.local`

### **Issue: "Unauthorized" in production**

**Cause**: Environment variables not set in hosting platform

**Solution**:
1. Add all required variables to hosting platform
2. Redeploy application

---

## Best Practices

1. **Never commit `.env.local` to git**
   - Already in `.gitignore`
   - Use `.env.example` for documentation

2. **Use different Supabase projects for development/production**
   - Development: `dev-project.supabase.co`
   - Production: `prod-project.supabase.co`

3. **Rotate service role key periodically**
   - Generate new key in Supabase Dashboard
   - Update in all environments

4. **Monitor API usage**
   - Check Supabase Dashboard for unusual activity
   - Set up alerts for high usage

---

## Example `.env.local` for Development

```env
# Development Environment

NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...dev-service-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

---

**Created**: October 8, 2025  
**Purpose**: Environment configuration guide  
**Status**: ✅ Ready to use

