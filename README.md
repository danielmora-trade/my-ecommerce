# My E-Commerce

A modern e-commerce application built with Next.js, Supabase, and Tailwind CSS.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Supabase** - Backend as a Service (Database, Auth, Storage)
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/
│   └── supabase/          # Supabase client utilities
└── types/
    ├── ecommerce-schema.ts         # Core e-commerce type definitions
    ├── ecommerce-schema.examples.ts # Usage examples
    ├── SCHEMA_DOCUMENTATION.md     # Detailed schema docs
    └── database.types.ts           # Supabase generated types
```

## E-Commerce Schema

This project includes a comprehensive type system for building an Amazon-like e-commerce platform. The schema includes:

- 👤 **User Management** - Users, addresses, authentication
- 🛍️ **Product Catalog** - Products, categories, variants, images
- 🛒 **Shopping & Orders** - Cart, wishlist, orders, order items
- 💳 **Payments** - Payment processing, saved payment methods
- 🎟️ **Marketing** - Coupons, discounts, promotions
- ⭐ **Reviews & Ratings** - Product reviews with images
- 🏪 **Seller/Vendor** - Multi-vendor marketplace support
- 📦 **Shipping** - Shipping methods, tracking, fulfillment
- 🔔 **Notifications** - User notifications system
- 🎫 **Support** - Customer support, returns, refunds
- 📊 **Analytics** - Product views, search tracking
- 📦 **Inventory** - Inventory transaction tracking

See `src/types/SCHEMA_DOCUMENTATION.md` for detailed documentation and examples.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)