# 🚀 Quick Reference Guide

## Essential Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate types from Supabase
npm run generate:types
```

---

## Project Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| **Backend** | Database access, business logic | `src/backend/services/auth.service.ts` |
| **API Routes** | HTTP endpoints | `src/app/api/auth/signin/route.ts` |
| **Frontend** | API client | `src/frontend/services/api.client.ts` |
| **Components** | UI elements | `src/components/auth/auth-form.tsx` |
| **Shared** | Type definitions | `src/shared/types/api.types.ts` |

---

## API Endpoints

```typescript
// Sign up
POST /api/auth/signup
Body: { email, password }

// Sign in
POST /api/auth/signin
Body: { email, password }

// Magic link
POST /api/auth/signin-otp
Body: { email }

// OAuth
POST /api/auth/oauth
Body: { provider: 'google' }

// Sign out
POST /api/auth/signout

// Get user
GET /api/auth/user
```

---

## Frontend Usage

```typescript
import { apiClient } from '@/frontend/services/api.client'

// Sign up
const result = await apiClient.signUp({ email, password })

// Sign in
const result = await apiClient.signIn({ email, password })

// Get user
const result = await apiClient.getUser()
```

---

## Backend Usage (Server Components)

```typescript
import { authService } from '@/backend/services/auth.service'
import { cookies } from 'next/headers'

// Get current user
const cookieStore = await cookies()
const accessToken = cookieStore.get('access_token')?.value
const result = await authService.getUser(accessToken)
```

---

## File Structure Quick Map

```
src/
├── app/
│   ├── api/           → Backend API routes
│   ├── auth/          → Frontend auth pages
│   ├── dashboard/     → Protected pages
│   └── page.tsx       → Landing page
│
├── backend/           → Backend services & Supabase
├── frontend/          → Frontend API client
├── shared/            → Shared types
└── components/        → UI components
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Common Tasks

### Add New API Endpoint

1. Define types in `src/shared/types/api.types.ts`
2. Create service in `src/backend/services/*.service.ts`
3. Create route in `src/app/api/*/route.ts`
4. Add method in `src/frontend/services/api.client.ts`
5. Use in components

### Protect a Page

```typescript
// src/app/your-page/page.tsx
import { authService } from '@/backend/services/auth.service'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function YourPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const result = await authService.getUser(accessToken)

  if (!result.success) {
    redirect('/auth/signin')
  }

  return <div>Protected content</div>
}
```

### Call API from Component

```typescript
'use client'

import { apiClient } from '@/frontend/services/api.client'

export default function MyComponent() {
  const handleAction = async () => {
    try {
      const result = await apiClient.someMethod(data)
      if (result.success) {
        // Handle success
      }
    } catch (error) {
      // Handle error
    }
  }

  return <button onClick={handleAction}>Action</button>
}
```

---

## Important URLs

- **Homepage**: `http://localhost:3000`
- **Sign Up**: `http://localhost:3000/auth/signup`
- **Sign In**: `http://localhost:3000/auth/signin`
- **Dashboard**: `http://localhost:3000/dashboard`
- **API Docs**: See `ARCHITECTURE.md`

---

## Documentation

| File | When to Read |
|------|--------------|
| `ARCHITECTURE.md` | Understanding the architecture |
| `PROJECT_STRUCTURE_COMPLETE.md` | Complete overview |
| `RESTRUCTURE_SUMMARY.md` | What changed and why |
| `ENV_SETUP.md` | Setting up environment |
| `QUICK_REFERENCE.md` | This file - quick lookup |

---

## Troubleshooting

### Server won't start
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### TypeScript errors
- Restart TS server in VS Code
- Check `tsconfig.json`
- Verify all imports

### Auth not working
- Check `.env.local` exists
- Verify cookies in DevTools
- Check backend logs

---

**Quick Reference** | **Updated**: October 8, 2025

