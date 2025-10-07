# 🚀 Quick Start Guide

Get your Next.js + Supabase + Tailwind CSS project up and running in minutes!

## ⚡ Setup in 3 Minutes

### 1️⃣ Install Dependencies (if not already done)
```bash
npm install
```

### 2️⃣ Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: My E-Commerce (or any name)
   - **Database Password**: (choose a strong password)
   - **Region**: (choose closest to you)
4. Wait for the project to be created (~2 minutes)

### 3️⃣ Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** (⚙️) > **API**
2. Find these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API key** → `anon` `public` (starts with `eyJ...`)

### 4️⃣ Create Environment File

Create a `.env.local` file in the root directory:

```bash
# On macOS/Linux:
cp ENV_TEMPLATE.md .env.local

# On Windows:
copy ENV_TEMPLATE.md .env.local
```

Then edit `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...your-key-here...xxx
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you should see:
- ✅ A green "Supabase Connected" message if everything is configured correctly
- ❌ A red error message if credentials are missing or incorrect

---

## 🎯 Next Steps

### Create Your First Table

1. Go to your Supabase Dashboard
2. Click on **Table Editor** (📊)
3. Click **"New Table"**
4. Try this example for a products table:

```sql
-- Create products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table products enable row level security;

-- Allow anyone to read products
create policy "Allow public read access"
  on products for select
  to public
  using (true);

-- Optional: Allow authenticated users to insert
create policy "Allow authenticated insert"
  on products for insert
  to authenticated
  with check (true);
```

### Test Your Database Connection

Create a new file `src/app/products/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-2xl font-bold mt-4">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

Visit [http://localhost:3000/products](http://localhost:3000/products) to see your products!

---

## 🔑 Enable Authentication (Optional)

### Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Ensure **Email** is enabled (it's on by default)
3. Configure settings as needed

### Add Sign Up/Login

Create `src/app/auth/page.tsx`:

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email for confirmation!')
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else alert('Signed in successfully!')
  }

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Sign In / Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />
      <div className="flex gap-4">
        <button onClick={handleSignUp} className="flex-1 bg-blue-500 text-white p-3 rounded">
          Sign Up
        </button>
        <button onClick={handleSignIn} className="flex-1 bg-green-500 text-white p-3 rounded">
          Sign In
        </button>
      </div>
    </div>
  )
}
```

---

## 📚 Useful Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 🐛 Troubleshooting

### ❌ "Supabase Not Configured" Error

1. Make sure `.env.local` exists in the root directory
2. Check that the values are correct (no spaces, no quotes)
3. Restart the dev server after changing `.env.local`

### ❌ "Invalid API Key" Error

1. Go to Supabase Dashboard > Settings > API
2. Copy the **anon/public** key (not the service_role key!)
3. Make sure you copied the entire key (it's very long)

### ❌ Database Queries Failing

1. Check that Row Level Security (RLS) policies are set up
2. Make sure your table exists
3. Check the Supabase logs in the Dashboard

---

## 🎉 You're All Set!

Your Next.js + Supabase + Tailwind CSS project is ready to build!

**Next Steps:**
- Read the full [README.md](README.md) for detailed examples
- Check out [Supabase Docs](https://supabase.com/docs)
- Explore [Next.js Docs](https://nextjs.org/docs)
- Learn [Tailwind CSS](https://tailwindcss.com/docs)

Happy coding! 🚀

