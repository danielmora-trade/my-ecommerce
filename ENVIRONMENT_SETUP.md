# Environment Variables Setup

To use Supabase authentication with your Next.js application, you need to set up the following environment variables:

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Site URL for redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## How to Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings > API**
4. **Copy the following values**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Google OAuth Setup (Optional)

To enable Google Sign-in:

1. **Go to Authentication > Providers** in your Supabase dashboard
2. **Enable Google provider**
3. **Add your Google OAuth credentials**:
   - Client ID
   - Client Secret
4. **Set redirect URL**: `https://your-project-ref.supabase.co/auth/v1/callback`

## Example .env.local

```bash
# Replace with your actual Supabase project values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Security Notes

- ✅ The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- ✅ The anon key is safe to expose publicly (it's designed for client-side use)
- ✅ Never commit your `.env.local` file to version control
- ✅ Add `.env.local` to your `.gitignore` file

## Testing Authentication

Once you've set up your environment variables:

1. **Start your development server**: `npm run dev`
2. **Visit**: http://localhost:3000
3. **Test sign-up**: Click "Create Account" and try registering
4. **Test sign-in**: Use your registered credentials
5. **Test Google OAuth**: Click "Continue with Google" (if configured)
6. **Test protected routes**: Visit `/dashboard` (should redirect to sign-in if not authenticated)

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **"Invalid URL"**: Check your `NEXT_PUBLIC_SUPABASE_URL`
3. **Google OAuth not working**: Verify Google provider is enabled in Supabase
4. **Redirect issues**: Check your redirect URLs in Supabase settings

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
3. Check Supabase logs in the dashboard
4. Ensure your domain is added to allowed origins in Supabase
