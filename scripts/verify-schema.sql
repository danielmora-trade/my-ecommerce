-- ================================================
-- Schema Verification Script
-- Run this in Supabase SQL Editor to verify schema
-- ================================================

-- Check all tables exist
SELECT 
  'Tables' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 28 THEN '✅ Pass' 
    ELSE '❌ Fail' 
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- Check RLS is enabled
SELECT 
  'RLS Enabled' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 28 THEN '✅ Pass' 
    ELSE '❌ Fail' 
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- Check foreign keys
SELECT 
  'Foreign Keys' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 20 THEN '✅ Pass' 
    ELSE '❌ Fail' 
  END as status
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public';

-- Check indexes
SELECT 
  'Indexes' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 30 THEN '✅ Pass' 
    ELSE '❌ Fail' 
  END as status
FROM pg_indexes
WHERE schemaname = 'public';

-- Check triggers
SELECT 
  'Triggers' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 10 THEN '✅ Pass' 
    ELSE '❌ Fail' 
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- List all tables
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count,
  (SELECT COUNT(*) FROM pg_indexes WHERE tablename = t.table_name AND schemaname = 'public') as index_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check seed data
SELECT 'Categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Product Images', COUNT(*) FROM product_images
UNION ALL
SELECT 'Product Variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'Sellers', COUNT(*) FROM sellers
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'Shipping Methods', COUNT(*) FROM shipping_methods
ORDER BY table_name;

-- Check entity relationships match schema
SELECT 
  'Schema Verification' as check_type,
  'All core entities present' as description,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles')
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products')
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders')
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories')
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sellers')
    THEN '✅ Pass'
    ELSE '❌ Fail'
  END as status;

-- Sample product query to verify data
SELECT 
  p.name as product_name,
  p.price,
  p.quantity,
  c.name as category,
  s.business_name as seller,
  COUNT(DISTINCT pi.id) as image_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sellers s ON p.seller_id = s.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.price, p.quantity, c.name, s.business_name
ORDER BY p.name
LIMIT 5;

