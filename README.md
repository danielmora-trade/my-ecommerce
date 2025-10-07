# My E-Commerce

A modern e-commerce application built with Next.js, Supabase, and Tailwind CSS.

## 🚀 Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[Supabase](https://supabase.com/)** - Backend as a Service (Database, Auth, Storage)
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

## 📋 Prerequisites

- Node.js 18.17 or later
- A Supabase account (free tier available)

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://app.supabase.com)
2. Go to Settings > API
3. Copy your project URL and anon public key

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
my-ecommerce/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   └── lib/
│       └── supabase/          # Supabase client utilities
│           ├── client.ts      # Browser client
│           ├── server.ts      # Server client
│           └── middleware.ts  # Session management
├── middleware.ts              # Next.js middleware
├── .env.example              # Environment variables template
└── README.md
```

## 🔒 Supabase Setup

### Using Supabase Client

#### In Client Components

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [data, setData] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from('your_table').select()
      setData(data)
    }
    getData()
  }, [])

  return <div>{/* Your component */}</div>
}
```

#### In Server Components

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  const { data } = await supabase.from('your_table').select()

  return <div>{/* Your component */}</div>
}
```

#### In API Routes

```tsx
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.from('your_table').select()
  
  return NextResponse.json(data)
}
```

## 🎨 Tailwind CSS

Tailwind CSS is already configured. You can use utility classes in your components:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  Hello, Tailwind!
</div>
```

## 🔐 Authentication Example

### Sign Up

```tsx
const supabase = createClient()

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign In

```tsx
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign Out

```tsx
const { error } = await supabase.auth.signOut()
```

### Get Current User

```tsx
const { data: { user } } = await supabase.auth.getUser()
```

## 🗄️ Database Example

### Create a Table in Supabase

Go to your Supabase dashboard and run this SQL:

```sql
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table products enable row level security;

-- Create a policy that allows anyone to read products
create policy "Allow public read access"
  on products for select
  to public
  using (true);
```

### Query Data

```tsx
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false })
```

### Insert Data

```tsx
const { data, error } = await supabase
  .from('products')
  .insert([
    { name: 'Product 1', price: 29.99, description: 'A great product' }
  ])
  .select()
```

### Update Data

```tsx
const { data, error } = await supabase
  .from('products')
  .update({ price: 24.99 })
  .eq('id', productId)
  .select()
```

### Delete Data

```tsx
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId)
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy!

### Environment Variables in Production

Make sure to add these in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js with Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
