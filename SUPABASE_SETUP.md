# 🚀 Supabase Database Setup Guide

Complete guide to set up your e-commerce database on Supabase.

## 📋 Prerequisites

- Supabase account ([Sign up here](https://app.supabase.com))
- Supabase CLI installed: `npm install -g supabase`
- Node.js 18+ installed

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: my-ecommerce
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Wait ~2 minutes for project creation

### Step 2: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project Ref** (from URL: `xxxxx.supabase.co`)

### Step 3: Update Environment Variables

```bash
# Update .env.local with your credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-key-here
```

### Step 4: Run Migrations

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click "New Query"
3. Copy content from `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste and click "Run"
5. Repeat for:
   - `20240101000001_rls_policies.sql`
   - `20240101000002_seed_data.sql`

#### Option B: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Step 5: Verify Setup

Run this in SQL Editor:

```sql
-- Check tables
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should return ~28 tables

-- Check seed data
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as category_count FROM categories;

-- Should show 12+ products and 13+ categories
```

### Step 6: Generate TypeScript Types

```bash
# Set your project ref
export SUPABASE_PROJECT_REF=your-project-ref

# Run the script
npm run generate-types

# Or manually
npx supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts
```

### Step 7: Test the Connection

```bash
# Start your dev server
npm run dev

# Visit http://localhost:3000
# You should see "Supabase Connected" ✅
```

## 📊 Database Schema Overview

### Core Tables Created

✅ **User Management** (2 tables)
- `profiles` - User profiles
- `addresses` - Shipping/billing addresses

✅ **Product Catalog** (5 tables)
- `categories` - Product categories
- `products` - Main products
- `product_images` - Product images
- `product_variants` - Variants (sizes, colors)
- `product_attributes` - Custom attributes

✅ **Shopping & Orders** (5 tables)
- `carts` - Shopping carts
- `cart_items` - Items in cart
- `wishlist` - User wishlists
- `orders` - Customer orders
- `order_items` - Order line items

✅ **Payments** (2 tables)
- `payments` - Payment transactions
- `payment_methods` - Saved payment methods

✅ **Marketing** (2 tables)
- `coupons` - Discount coupons
- `coupon_usage` - Usage tracking

✅ **Reviews** (2 tables)
- `reviews` - Product reviews
- `review_images` - Review photos

✅ **Seller Management** (1 table)
- `sellers` - Vendor accounts

✅ **Shipping** (2 tables)
- `shipping_methods` - Shipping options
- `shipments` - Tracking info

✅ **Support** (3 tables)
- `notifications` - User notifications
- `support_tickets` - Customer support
- `returns` - Return requests

✅ **Analytics** (2 tables)
- `product_views` - View tracking
- `search_queries` - Search analytics

✅ **Inventory** (1 table)
- `inventory_transactions` - Stock movements

**Total: 28 tables** with full RLS policies!

## 🔐 Security Features

All tables have Row Level Security (RLS) enabled:

- ✅ Users can only access their own data
- ✅ Public can view active products/categories
- ✅ Sellers can manage their own products
- ✅ Orders are private to buyers
- ✅ Admin operations use service role

## 📦 Seed Data Included

- **6 main categories**: Electronics, Clothing, Home, Sports, Books, Beauty
- **13 subcategories**: Smartphones, Laptops, Tablets, etc.
- **3 demo sellers**: TechStore, Fashion Hub, HomeStyle
- **12+ products**: iPhone, MacBook, AirPods, Clothing, etc.
- **Product images**: Real images from Unsplash
- **Variants**: Size, color, storage options
- **5 sample reviews**: Real product reviews
- **4 coupons**: WELCOME10, SAVE50, FREESHIP, TECH20
- **4 shipping methods**: Standard, Express, Overnight, Free

## 🧪 Testing Your Setup

### Query Active Products

```sql
SELECT 
  p.name,
  p.price,
  c.name as category,
  s.business_name as seller
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN sellers s ON p.seller_id = s.id
WHERE p.is_active = true;
```

### Query Products with Images

```sql
SELECT 
  p.name,
  array_agg(pi.url) as images
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, p.name;
```

### Test RLS

```sql
-- Should work (public read)
SELECT * FROM products WHERE is_active = true;

-- Should work (public read)
SELECT * FROM categories WHERE is_active = true;
```

## 🔄 Updating the Schema

To modify the schema:

1. Create a new migration file in `supabase/migrations/`
2. Name it with timestamp: `20240102000000_description.sql`
3. Run it via Dashboard SQL Editor or CLI

Example:

```sql
-- supabase/migrations/20240102000000_add_product_badges.sql
ALTER TABLE products ADD COLUMN badge TEXT;
```

## 🐛 Troubleshooting

### "Permission denied for table"
**Solution**: RLS is blocking. Use service role key or add RLS policy.

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### "Relation does not exist"
**Solution**: Migrations didn't run. Re-run migrations in order.

### "Foreign key constraint fails"
**Solution**: Reference data missing. Check seed data ran successfully.

### Can't see products in app
**Solution**: 
1. Verify seed data: `SELECT COUNT(*) FROM products;`
2. Check RLS policies allow public read
3. Verify Supabase URL in `.env.local`

## 📚 Next Steps

After setup:

1. ✅ **Test queries** in SQL Editor
2. ✅ **Generate types**: `npm run generate-types`
3. ✅ **Create API routes** to fetch products
4. ✅ **Build UI components** for product display
5. ✅ **Test authentication** flow
6. ✅ **Add products** via seller dashboard

## 🎓 Learn More

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 📞 Support

If you encounter issues:

1. Check Supabase logs: Dashboard → Logs
2. Verify environment variables
3. Review migration order
4. Check RLS policies
5. Test with service role key

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Environment variables set
- [ ] All 3 migrations executed
- [ ] 28 tables created
- [ ] RLS enabled on all tables
- [ ] Seed data loaded (12+ products)
- [ ] TypeScript types generated
- [ ] Test connection successful
- [ ] Can query products from app

**Your database is ready! Start building your e-commerce platform! 🚀**

