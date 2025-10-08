-- ================================================
-- Seed Data for E-Commerce Platform
-- ================================================

-- ================================================
-- SHIPPING METHODS
-- ================================================

INSERT INTO public.shipping_methods (name, description, carrier, estimated_days_min, estimated_days_max, base_cost, cost_per_kg, free_shipping_threshold, is_active)
VALUES
  ('Standard Shipping', 'Standard delivery 5-7 business days', 'USPS', 5, 7, 5.99, 0.50, 50.00, true),
  ('Express Shipping', 'Fast delivery 2-3 business days', 'FedEx', 2, 3, 15.99, 1.00, 100.00, true),
  ('Overnight', 'Next day delivery', 'UPS', 1, 1, 29.99, 2.00, NULL, true),
  ('Free Shipping', 'Free standard shipping on orders over $50', 'USPS', 5, 7, 0.00, 0.00, 50.00, true);

-- ================================================
-- CATEGORIES
-- ================================================

-- Main Categories
INSERT INTO public.categories (id, name, slug, description, parent_id, image_url, is_active, sort_order)
VALUES
  ('cat-electronics', 'Electronics', 'electronics', 'Electronic devices and accessories', NULL, 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800', true, 1),
  ('cat-clothing', 'Clothing & Fashion', 'clothing-fashion', 'Apparel and fashion accessories', NULL, 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', true, 2),
  ('cat-home', 'Home & Kitchen', 'home-kitchen', 'Home decor, furniture, and kitchen essentials', NULL, 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800', true, 3),
  ('cat-sports', 'Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', NULL, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', true, 4),
  ('cat-books', 'Books & Media', 'books-media', 'Books, movies, music, and games', NULL, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800', true, 5),
  ('cat-beauty', 'Beauty & Personal Care', 'beauty-personal-care', 'Cosmetics, skincare, and personal care products', NULL, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800', true, 6);

-- Electronics Subcategories
INSERT INTO public.categories (id, name, slug, description, parent_id, is_active, sort_order)
VALUES
  ('cat-smartphones', 'Smartphones', 'smartphones', 'Latest smartphones and mobile devices', 'cat-electronics', true, 1),
  ('cat-laptops', 'Laptops & Computers', 'laptops-computers', 'Laptops, desktops, and computer accessories', 'cat-electronics', true, 2),
  ('cat-tablets', 'Tablets', 'tablets', 'iPads and Android tablets', 'cat-electronics', true, 3),
  ('cat-audio', 'Audio & Headphones', 'audio-headphones', 'Headphones, earbuds, and speakers', 'cat-electronics', true, 4),
  ('cat-cameras', 'Cameras & Photography', 'cameras-photography', 'Digital cameras and photography equipment', 'cat-electronics', true, 5);

-- Clothing Subcategories
INSERT INTO public.categories (id, name, slug, description, parent_id, is_active, sort_order)
VALUES
  ('cat-mens', 'Men\'s Clothing', 'mens-clothing', 'Men\'s apparel and accessories', 'cat-clothing', true, 1),
  ('cat-womens', 'Women\'s Clothing', 'womens-clothing', 'Women\'s apparel and accessories', 'cat-clothing', true, 2),
  ('cat-shoes', 'Shoes', 'shoes', 'Footwear for men, women, and children', 'cat-clothing', true, 3);

-- ================================================
-- CREATE DEMO SELLER ACCOUNTS
-- Note: These will need real auth.users entries in production
-- For now, we'll create placeholder sellers
-- ================================================

-- First, let's create some demo user IDs (in production, these would come from auth.users)
-- We'll use fixed UUIDs for demo purposes

INSERT INTO public.sellers (id, user_id, business_name, business_email, business_phone, description, is_verified, is_active, commission_rate)
VALUES
  (
    'seller-techstore',
    '00000000-0000-0000-0000-000000000001',
    'TechStore Pro',
    'contact@techstore.com',
    '+1-555-0101',
    'Your trusted source for the latest technology and electronics',
    true,
    true,
    12.00
  ),
  (
    'seller-fashionhub',
    '00000000-0000-0000-0000-000000000002',
    'Fashion Hub',
    'hello@fashionhub.com',
    '+1-555-0102',
    'Trendy fashion and accessories for everyone',
    true,
    true,
    15.00
  ),
  (
    'seller-homestyle',
    '00000000-0000-0000-0000-000000000003',
    'HomeStyle Living',
    'info@homestyle.com',
    '+1-555-0103',
    'Beautiful home decor and kitchen essentials',
    true,
    true,
    13.00
  );

-- ================================================
-- PRODUCTS - ELECTRONICS
-- ================================================

-- Smartphones
INSERT INTO public.products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, is_active, is_featured, tags)
VALUES
  (
    'prod-iphone-15-pro',
    'seller-techstore',
    'cat-smartphones',
    'iPhone 15 Pro Max',
    'iphone-15-pro-max',
    'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system. Features ProMotion display with up to 120Hz refresh rate, all-day battery life, and iOS 17.',
    'Flagship iPhone with titanium design and A17 Pro chip',
    'IPHONE-15-PRO-256',
    1199.99,
    1299.99,
    50,
    true,
    true,
    ARRAY['smartphone', 'apple', 'ios', '5g', 'pro', 'featured']
  ),
  (
    'prod-samsung-s24',
    'seller-techstore',
    'cat-smartphones',
    'Samsung Galaxy S24 Ultra',
    'samsung-galaxy-s24-ultra',
    'Premium Android flagship with S Pen, 200MP camera, Snapdragon 8 Gen 3, and stunning 6.8" Dynamic AMOLED display. Built-in AI features for enhanced productivity.',
    'Premium Android flagship with S Pen and AI features',
    'SAMSUNG-S24-ULTRA-512',
    1299.99,
    1399.99,
    35,
    true,
    true,
    ARRAY['smartphone', 'samsung', 'android', '5g', 'flagship']
  ),
  (
    'prod-pixel-8-pro',
    'seller-techstore',
    'cat-smartphones',
    'Google Pixel 8 Pro',
    'google-pixel-8-pro',
    'Google\'s best smartphone with advanced AI capabilities, exceptional camera system, and pure Android experience. Features Google Tensor G3 chip and 7 years of updates.',
    'Google flagship with AI-powered photography',
    'PIXEL-8-PRO-256',
    999.99,
    1099.99,
    40,
    true,
    false,
    ARRAY['smartphone', 'google', 'android', '5g', 'ai']
  );

-- Laptops
INSERT INTO public.products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, is_active, is_featured, tags)
VALUES
  (
    'prod-macbook-pro-14',
    'seller-techstore',
    'cat-laptops',
    'MacBook Pro 14" M3 Pro',
    'macbook-pro-14-m3-pro',
    'Powerful MacBook Pro with M3 Pro chip, stunning Liquid Retina XDR display, and up to 18 hours of battery life. Perfect for professionals and creators.',
    'Professional laptop with M3 Pro chip',
    'MACBOOK-PRO-14-M3-512',
    1999.99,
    2199.99,
    25,
    true,
    true,
    ARRAY['laptop', 'apple', 'macbook', 'professional']
  ),
  (
    'prod-dell-xps-15',
    'seller-techstore',
    'cat-laptops',
    'Dell XPS 15',
    'dell-xps-15',
    'Premium Windows laptop with Intel Core i7, NVIDIA RTX 4050, and stunning 15.6" OLED display. Ideal for content creation and productivity.',
    'Premium Windows laptop with OLED display',
    'DELL-XPS-15-I7-1TB',
    1799.99,
    1999.99,
    30,
    true,
    false,
    ARRAY['laptop', 'dell', 'windows', 'gaming']
  );

-- Audio
INSERT INTO public.products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, is_active, is_featured, tags)
VALUES
  (
    'prod-airpods-pro-2',
    'seller-techstore',
    'cat-audio',
    'AirPods Pro (2nd generation)',
    'airpods-pro-2nd-generation',
    'Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio. Up to 6 hours of listening time. MagSafe charging case included.',
    'Premium wireless earbuds with ANC',
    'AIRPODS-PRO-2',
    249.99,
    279.99,
    100,
    true,
    true,
    ARRAY['audio', 'apple', 'wireless', 'anc']
  ),
  (
    'prod-sony-wh1000xm5',
    'seller-techstore',
    'cat-audio',
    'Sony WH-1000XM5',
    'sony-wh-1000xm5',
    'Industry-leading noise cancellation with Auto NC Optimizer, exceptional sound quality with LDAC, and 30-hour battery life. Perfect for travel and commuting.',
    'Premium noise-cancelling headphones',
    'SONY-WH1000XM5-BLACK',
    399.99,
    449.99,
    45,
    true,
    false,
    ARRAY['audio', 'sony', 'wireless', 'anc', 'headphones']
  );

-- ================================================
-- PRODUCTS - CLOTHING
-- ================================================

INSERT INTO public.products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, is_active, is_featured, tags)
VALUES
  (
    'prod-classic-tshirt',
    'seller-fashionhub',
    'cat-mens',
    'Classic Cotton T-Shirt',
    'classic-cotton-tshirt',
    'Premium 100% cotton t-shirt with comfortable fit. Perfect for everyday wear. Available in multiple colors and sizes.',
    'Comfortable 100% cotton t-shirt',
    'TSHIRT-CLASSIC-M',
    29.99,
    39.99,
    200,
    true,
    false,
    ARRAY['clothing', 'tshirt', 'cotton', 'mens']
  ),
  (
    'prod-denim-jeans',
    'seller-fashionhub',
    'cat-mens',
    'Slim Fit Denim Jeans',
    'slim-fit-denim-jeans',
    'Modern slim fit jeans made from premium denim. Comfortable stretch fabric with classic 5-pocket design. Perfect for any occasion.',
    'Modern slim fit denim jeans',
    'JEANS-SLIM-M-32X32',
    79.99,
    99.99,
    150,
    true,
    true,
    ARRAY['clothing', 'jeans', 'denim', 'mens']
  ),
  (
    'prod-sneakers-running',
    'seller-fashionhub',
    'cat-shoes',
    'Performance Running Sneakers',
    'performance-running-sneakers',
    'Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for comfort and performance.',
    'Lightweight running shoes',
    'SNEAKERS-RUN-M-10',
    119.99,
    149.99,
    80,
    true,
    false,
    ARRAY['shoes', 'sneakers', 'running', 'sports']
  );

-- ================================================
-- PRODUCTS - HOME & KITCHEN
-- ================================================

INSERT INTO public.products (id, seller_id, category_id, name, slug, description, short_description, sku, price, compare_at_price, quantity, is_active, is_featured, tags)
VALUES
  (
    'prod-coffee-maker',
    'seller-homestyle',
    'cat-home',
    'Premium Coffee Maker',
    'premium-coffee-maker',
    'Programmable coffee maker with thermal carafe, brew strength control, and auto shut-off. Makes up to 12 cups of perfect coffee.',
    'Programmable 12-cup coffee maker',
    'COFFEE-MAKER-12CUP',
    89.99,
    119.99,
    60,
    true,
    false,
    ARRAY['kitchen', 'appliance', 'coffee']
  ),
  (
    'prod-cookware-set',
    'seller-homestyle',
    'cat-home',
    'Non-Stick Cookware Set (10-Piece)',
    'nonstick-cookware-set-10piece',
    'Complete cookware set with aluminum construction and premium non-stick coating. Includes pots, pans, and lids. Dishwasher safe.',
    'Complete 10-piece cookware set',
    'COOKWARE-SET-10PC',
    149.99,
    199.99,
    40,
    true,
    true,
    ARRAY['kitchen', 'cookware', 'cooking']
  );

-- ================================================
-- PRODUCT IMAGES
-- ================================================

-- iPhone 15 Pro Images
INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
VALUES
  ('prod-iphone-15-pro', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'iPhone 15 Pro Max front view', 1, true),
  ('prod-iphone-15-pro', 'https://images.unsplash.com/photo-1695048133364-169fadf3326c?w=800', 'iPhone 15 Pro Max back view', 2, false),
  ('prod-iphone-15-pro', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'iPhone 15 Pro Max titanium design', 3, false);

-- Samsung S24 Images
INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
VALUES
  ('prod-samsung-s24', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', 'Samsung Galaxy S24 Ultra', 1, true),
  ('prod-samsung-s24', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', 'Samsung Galaxy S24 Ultra with S Pen', 2, false);

-- MacBook Pro Images
INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
VALUES
  ('prod-macbook-pro-14', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'MacBook Pro 14 inch', 1, true),
  ('prod-macbook-pro-14', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 'MacBook Pro display', 2, false);

-- AirPods Pro Images
INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
VALUES
  ('prod-airpods-pro-2', 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', 'AirPods Pro 2nd generation', 1, true);

-- Denim Jeans Images
INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
VALUES
  ('prod-denim-jeans', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'Slim fit denim jeans', 1, true);

-- Cookware Set Images
INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
VALUES
  ('prod-cookware-set', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', 'Non-stick cookware set', 1, true);

-- ================================================
-- PRODUCT VARIANTS
-- ================================================

-- iPhone 15 Pro Variants (Storage options)
INSERT INTO public.product_variants (product_id, name, sku, price, quantity, attributes, is_active)
VALUES
  ('prod-iphone-15-pro', '256GB - Natural Titanium', 'IPHONE-15-PRO-256-NAT', 1199.99, 20, '{"storage": "256GB", "color": "Natural Titanium"}', true),
  ('prod-iphone-15-pro', '512GB - Natural Titanium', 'IPHONE-15-PRO-512-NAT', 1399.99, 15, '{"storage": "512GB", "color": "Natural Titanium"}', true),
  ('prod-iphone-15-pro', '256GB - Blue Titanium', 'IPHONE-15-PRO-256-BLUE', 1199.99, 15, '{"storage": "256GB", "color": "Blue Titanium"}', true);

-- T-Shirt Variants (Sizes and Colors)
INSERT INTO public.product_variants (product_id, name, sku, price, quantity, attributes, is_active)
VALUES
  ('prod-classic-tshirt', 'Medium - Black', 'TSHIRT-CLASSIC-M-BLACK', 29.99, 50, '{"size": "M", "color": "Black"}', true),
  ('prod-classic-tshirt', 'Large - Black', 'TSHIRT-CLASSIC-L-BLACK', 29.99, 50, '{"size": "L", "color": "Black"}', true),
  ('prod-classic-tshirt', 'Medium - White', 'TSHIRT-CLASSIC-M-WHITE', 29.99, 50, '{"size": "M", "color": "White"}', true),
  ('prod-classic-tshirt', 'Large - White', 'TSHIRT-CLASSIC-L-WHITE', 29.99, 50, '{"size": "L", "color": "White"}', true);

-- ================================================
-- PRODUCT ATTRIBUTES
-- ================================================

-- iPhone attributes
INSERT INTO public.product_attributes (product_id, name, value)
VALUES
  ('prod-iphone-15-pro', 'Brand', 'Apple'),
  ('prod-iphone-15-pro', 'Operating System', 'iOS 17'),
  ('prod-iphone-15-pro', 'Screen Size', '6.7 inches'),
  ('prod-iphone-15-pro', 'RAM', '8GB'),
  ('prod-iphone-15-pro', 'Warranty', '1 year');

-- MacBook attributes
INSERT INTO public.product_attributes (product_id, name, value)
VALUES
  ('prod-macbook-pro-14', 'Brand', 'Apple'),
  ('prod-macbook-pro-14', 'Processor', 'Apple M3 Pro'),
  ('prod-macbook-pro-14', 'RAM', '18GB'),
  ('prod-macbook-pro-14', 'Storage', '512GB SSD'),
  ('prod-macbook-pro-14', 'Screen Size', '14.2 inches');

-- ================================================
-- COUPONS
-- ================================================

INSERT INTO public.coupons (code, type, value, min_purchase_amount, max_discount_amount, usage_limit, valid_from, valid_to, is_active, applicable_to)
VALUES
  ('WELCOME10', 'percentage', 10.00, 50.00, 50.00, 1000, NOW(), NOW() + INTERVAL '1 year', true, 'all'),
  ('SAVE50', 'fixed_amount', 50.00, 100.00, 50.00, 500, NOW(), NOW() + INTERVAL '6 months', true, 'all'),
  ('FREESHIP', 'free_shipping', 0.00, 25.00, NULL, NULL, NOW(), NOW() + INTERVAL '1 year', true, 'all'),
  ('TECH20', 'percentage', 20.00, 200.00, 100.00, 200, NOW(), NOW() + INTERVAL '3 months', true, 'categories');

-- ================================================
-- SAMPLE REVIEWS (using demo user IDs)
-- ================================================

INSERT INTO public.reviews (product_id, user_id, rating, title, comment, is_verified_purchase, helpful_count, is_approved)
VALUES
  (
    'prod-iphone-15-pro',
    '00000000-0000-0000-0000-000000000001',
    5,
    'Best iPhone yet!',
    'The iPhone 15 Pro Max is absolutely incredible. The camera quality is outstanding, battery life is excellent, and the titanium design feels premium. Highly recommended!',
    true,
    42,
    true
  ),
  (
    'prod-iphone-15-pro',
    '00000000-0000-0000-0000-000000000002',
    4,
    'Great phone, pricey though',
    'Amazing phone with top-notch features. The only downside is the price, but you get what you pay for. The A17 Pro chip is blazingly fast.',
    true,
    28,
    true
  ),
  (
    'prod-airpods-pro-2',
    '00000000-0000-0000-0000-000000000003',
    5,
    'Perfect for daily use',
    'These AirPods are perfect! The noise cancellation is incredible, sound quality is excellent, and they fit comfortably for hours. Worth every penny.',
    true,
    35,
    true
  ),
  (
    'prod-macbook-pro-14',
    '00000000-0000-0000-0000-000000000001',
    5,
    'Professional powerhouse',
    'As a developer, this MacBook Pro is perfect. The M3 Pro chip handles everything I throw at it, battery life is amazing, and the display is gorgeous.',
    true,
    51,
    true
  ),
  (
    'prod-denim-jeans',
    '00000000-0000-0000-0000-000000000002',
    4,
    'Great fit and quality',
    'These jeans fit perfectly and the quality is excellent. The stretch fabric is comfortable for all-day wear. True to size.',
    true,
    18,
    true
  );

-- ================================================
-- STATISTICS UPDATE
-- ================================================

-- Update seller statistics based on products
UPDATE public.sellers SET total_sales = 50000.00, rating = 4.8 WHERE id = 'seller-techstore';
UPDATE public.sellers SET total_sales = 35000.00, rating = 4.6 WHERE id = 'seller-fashionhub';
UPDATE public.sellers SET total_sales = 25000.00, rating = 4.7 WHERE id = 'seller-homestyle';

