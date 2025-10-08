# 🏗️ Project Architecture - Frontend/Backend Separation

## 📋 Overview

This Next.js project follows a **strict separation** between frontend and backend concerns:

- **Frontend**: UI components that only communicate with the backend API
- **Backend**: API routes and services that handle all Supabase interactions
- **Shared**: Type definitions that establish the contract between frontend and backend

## 🎯 Architecture Principles

### ✅ What We Do
1. **Frontend** communicates ONLY with backend API routes
2. **Backend** is the ONLY layer that accesses Supabase directly
3. **Shared types** ensure type safety across the API boundary
4. **Cookies** handle session management (HTTP-only for security)

### ❌ What We DON'T Do
1. Direct Supabase calls from frontend components
2. Mixed frontend/backend concerns
3. Client-side storage of sensitive tokens

---

## 📁 Project Structure

```
my-ecommerce/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # 🔴 BACKEND API Routes
│   │   │   └── auth/
│   │   │       ├── signup/route.ts
│   │   │       ├── signin/route.ts
│   │   │       ├── signin-otp/route.ts
│   │   │       ├── signout/route.ts
│   │   │       ├── user/route.ts
│   │   │       └── oauth/route.ts
│   │   ├── auth/                     # Frontend Auth Pages
│   │   │   ├── signin/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── callback/route.ts     # OAuth callback handler
│   │   │   └── auth-code-error/page.tsx
│   │   ├── dashboard/page.tsx        # Protected page example
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── backend/                      # 🔴 BACKEND LAYER
│   │   ├── lib/
│   │   │   └── supabase.ts           # Supabase client (BACKEND ONLY)
│   │   └── services/
│   │       └── auth.service.ts       # Authentication business logic
│   │
│   ├── frontend/                     # 🔵 FRONTEND LAYER
│   │   └── services/
│   │       └── api.client.ts         # API client for backend communication
│   │
│   ├── shared/                       # 🟡 SHARED LAYER
│   │   └── types/
│   │       └── api.types.ts          # API contract types
│   │
│   ├── components/                   # 🔵 Frontend UI Components
│   │   ├── auth/
│   │   │   └── auth-form.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       └── ...
│   │
│   ├── lib/                          # Utilities
│   │   └── utils.ts
│   │
│   └── types/                        # Database types
│       └── database.types.ts
│
├── middleware.ts                     # Route protection
├── package.json
└── tsconfig.json
```

---

## 🔴 Backend Layer

### **Purpose**
- Handle ALL Supabase interactions
- Implement business logic
- Validate requests
- Manage sessions

### **Key Files**

#### `src/backend/lib/supabase.ts`
```typescript
// Supabase clients for backend use only
export function getSupabaseAdmin() { ... }
export function getSupabaseClient() { ... }
```

#### `src/backend/services/auth.service.ts`
```typescript
// Authentication business logic
export class AuthService {
  async signUp(data: SignUpRequest): Promise<SignUpResponse>
  async signIn(data: SignInRequest): Promise<SignInResponse>
  async signInWithOTP(data: SignInWithOTPRequest): Promise<SignInWithOTPResponse>
  async signOut(): Promise<SignOutResponse>
  async getUser(accessToken?: string): Promise<GetUserResponse>
  async exchangeCodeForSession(code: string)
}
```

#### `src/app/api/auth/*/route.ts`
```typescript
// API route handlers
export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = await authService.methodName(body)
  return NextResponse.json(result)
}
```

---

## 🔵 Frontend Layer

### **Purpose**
- Display UI
- Handle user interactions
- Call backend API
- NO direct database access

### **Key Files**

#### `src/frontend/services/api.client.ts`
```typescript
// Frontend API client - communicates with backend
export class APIClient {
  async signUp(data: SignUpRequest): Promise<SignUpResponse>
  async signIn(data: SignInRequest): Promise<SignInResponse>
  async signInWithOTP(data: SignInWithOTPRequest): Promise<SignInWithOTPResponse>
  async signOut(): Promise<SignOutResponse>
  async getUser(): Promise<GetUserResponse>
}

export const apiClient = new APIClient()
```

#### `src/components/auth/auth-form.tsx`
```typescript
// Frontend component using API client
import { apiClient } from '@/frontend/services/api.client'

const result = await apiClient.signIn({ email, password })
```

---

## 🟡 Shared Layer

### **Purpose**
- Define API contracts
- Ensure type safety
- Document API interfaces

### **Key Files**

#### `src/shared/types/api.types.ts`
```typescript
// Request/Response types
export interface SignUpRequest {
  email: string
  password: string
}

export interface SignUpResponse {
  success: boolean
  message: string
  user?: { id: string; email: string }
}
```

---

## 🔄 Data Flow

### **Authentication Flow Example**

```
1. USER enters email/password in UI
   ↓
2. FRONTEND: auth-form.tsx
   → calls: apiClient.signIn({ email, password })
   ↓
3. FRONTEND: api.client.ts
   → makes: POST /api/auth/signin
   ↓
4. BACKEND: /api/auth/signin/route.ts
   → validates request
   → calls: authService.signIn(body)
   ↓
5. BACKEND: auth.service.ts
   → calls: supabase.auth.signInWithPassword()
   → gets user data from Supabase
   ↓
6. BACKEND: /api/auth/signin/route.ts
   → sets HTTP-only cookies (access_token, refresh_token)
   → returns: { success: true, user: {...} }
   ↓
7. FRONTEND: api.client.ts
   → receives response
   ↓
8. FRONTEND: auth-form.tsx
   → shows success message
   → redirects to /dashboard
```

---

## 🔐 Session Management

### **How It Works**

1. **Sign In**:
   - Backend validates credentials with Supabase
   - Backend receives session tokens
   - Backend sets HTTP-only cookies:
     - `access_token` (7 days)
     - `refresh_token` (30 days)

2. **Authenticated Requests**:
   - Cookies automatically sent with requests
   - Backend reads cookies to validate user
   - No tokens stored in frontend JavaScript

3. **Route Protection**:
   - Middleware checks for `access_token` cookie
   - Redirects to `/auth/signin` if missing
   - Server components validate token with backend service

4. **Sign Out**:
   - POST `/api/auth/signout`
   - Backend clears cookies
   - Redirect to homepage

---

## 📝 API Routes

### **Authentication Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/signin` | Sign in with email/password |
| POST | `/api/auth/signin-otp` | Send magic link to email |
| POST | `/api/auth/oauth` | Initiate OAuth flow |
| POST | `/api/auth/signout` | Sign out current user |
| GET | `/api/auth/user` | Get current user info |

### **Request/Response Examples**

#### Sign In
```typescript
// Request
POST /api/auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "message": "Signed in successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed_at": "2025-01-01T00:00:00Z",
    "created_at": "2025-01-01T00:00:00Z",
    "last_sign_in_at": "2025-01-08T00:00:00Z"
  }
}
```

---

## 🛡️ Security Features

### **1. HTTP-Only Cookies**
- Tokens stored in HTTP-only cookies
- Not accessible to JavaScript
- Prevents XSS attacks

### **2. CSRF Protection**
- SameSite cookie attribute
- Origin validation

### **3. No Client-Side Secrets**
- Service role key ONLY in backend
- Anon key used with RLS policies

### **4. Row Level Security (RLS)**
- Database-level access control
- Policies enforce user permissions

---

## 🔧 Environment Variables

### **Required Variables**

```env
# Supabase Public
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Supabase Backend (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=xxx

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

### **Important Notes**
- `NEXT_PUBLIC_*` variables are exposed to frontend
- `SUPABASE_SERVICE_ROLE_KEY` MUST be kept secret (backend only)
- Never commit `.env` to version control

---

## 📦 Adding New Features

### **Step 1: Define Types (Shared Layer)**

```typescript
// src/shared/types/api.types.ts
export interface CreateProductRequest {
  name: string
  price: number
}

export interface CreateProductResponse {
  success: boolean
  product?: Product
  message?: string
}
```

### **Step 2: Create Backend Service**

```typescript
// src/backend/services/product.service.ts
export class ProductService {
  async createProduct(data: CreateProductRequest) {
    const supabase = getSupabaseClient()
    const { data: product, error } = await supabase
      .from('products')
      .insert(data)
      .select()
      .single()
    
    if (error) return { success: false, message: error.message }
    return { success: true, product }
  }
}
```

### **Step 3: Create API Route**

```typescript
// src/app/api/products/route.ts
import { productService } from '@/backend/services/product.service'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = await productService.createProduct(body)
  return NextResponse.json(result)
}
```

### **Step 4: Add Frontend Client Method**

```typescript
// src/frontend/services/api.client.ts
async createProduct(data: CreateProductRequest): Promise<CreateProductResponse> {
  return this.request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
```

### **Step 5: Use in Components**

```typescript
// src/components/products/create-product.tsx
import { apiClient } from '@/frontend/services/api.client'

const result = await apiClient.createProduct({ name, price })
```

---

## 🧪 Testing

### **Backend Tests**
```typescript
// Test services directly
const result = await authService.signIn({ 
  email: 'test@example.com',
  password: 'password123'
})

expect(result.success).toBe(true)
```

### **API Route Tests**
```typescript
// Test API endpoints
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})

const data = await response.json()
expect(data.success).toBe(true)
```

### **Frontend Tests**
```typescript
// Test API client (with mocked fetch)
const result = await apiClient.signIn({ email, password })
expect(result.success).toBe(true)
```

---

## 📚 Best Practices

### ✅ DO
- Keep backend logic in services
- Validate all API inputs
- Use TypeScript for type safety
- Handle errors gracefully
- Log errors for debugging
- Use HTTP-only cookies for sessions

### ❌ DON'T
- Access Supabase directly from frontend
- Store tokens in localStorage
- Mix frontend and backend concerns
- Expose service role key to client
- Skip input validation
- Hardcode credentials

---

## 🚀 Benefits of This Architecture

1. **Security**: Sensitive operations isolated in backend
2. **Scalability**: Easy to add new features
3. **Maintainability**: Clear separation of concerns
4. **Type Safety**: End-to-end TypeScript support
5. **Testability**: Each layer can be tested independently
6. **Flexibility**: Easy to swap data sources (not tied to Supabase client SDK on frontend)

---

## 📖 Additional Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [TypeScript](https://www.typescriptlang.org/)
- [HTTP-Only Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

**Created**: October 8, 2025  
**Architecture**: Frontend/Backend Separation  
**Status**: ✅ Implemented and Documented

