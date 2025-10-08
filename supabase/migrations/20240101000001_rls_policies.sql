-- ================================================
-- Row Level Security (RLS) Policies
-- ================================================

-- ================================================
-- ENABLE RLS ON ALL TABLES
-- ================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

-- ================================================
-- PROFILES POLICIES
-- ================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ================================================
-- ADDRESSES POLICIES
-- ================================================

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- CATEGORIES POLICIES
-- ================================================

-- Everyone can view active categories
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

-- Only authenticated users can insert categories (admins only in practice)
CREATE POLICY "Authenticated users can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update categories
CREATE POLICY "Authenticated users can update categories"
  ON public.categories FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ================================================
-- SELLERS POLICIES
-- ================================================

-- Anyone can view verified sellers
CREATE POLICY "Anyone can view verified sellers"
  ON public.sellers FOR SELECT
  USING (is_verified = true AND is_active = true);

-- Users can view their own seller profile
CREATE POLICY "Users can view own seller profile"
  ON public.sellers FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own seller profile
CREATE POLICY "Users can insert own seller profile"
  ON public.sellers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own seller profile
CREATE POLICY "Users can update own seller profile"
  ON public.sellers FOR UPDATE
  USING (auth.uid() = user_id);

-- ================================================
-- PRODUCTS POLICIES
-- ================================================

-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM public.sellers
    WHERE sellers.id = products.seller_id
    AND sellers.user_id = auth.uid()
  ));

-- Sellers can insert their own products
CREATE POLICY "Sellers can insert own products"
  ON public.products FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sellers
    WHERE sellers.id = seller_id
    AND sellers.user_id = auth.uid()
  ));

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products"
  ON public.products FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.sellers
    WHERE sellers.id = products.seller_id
    AND sellers.user_id = auth.uid()
  ));

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
  ON public.products FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.sellers
    WHERE sellers.id = products.seller_id
    AND sellers.user_id = auth.uid()
  ));

-- ================================================
-- PRODUCT IMAGES POLICIES
-- ================================================

-- Anyone can view product images for active products
CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.products
    WHERE products.id = product_images.product_id
    AND products.is_active = true
  ));

-- Sellers can manage images for their products
CREATE POLICY "Sellers can insert product images"
  ON public.product_images FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.id = product_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Sellers can delete product images"
  ON public.product_images FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.id = product_id AND s.user_id = auth.uid()
  ));

-- ================================================
-- PRODUCT VARIANTS POLICIES
-- ================================================

-- Anyone can view variants for active products
CREATE POLICY "Anyone can view product variants"
  ON public.product_variants FOR SELECT
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.products
    WHERE products.id = product_variants.product_id
    AND products.is_active = true
  ));

-- Sellers can manage variants for their products
CREATE POLICY "Sellers can insert product variants"
  ON public.product_variants FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.id = product_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Sellers can update product variants"
  ON public.product_variants FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.id = product_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Sellers can delete product variants"
  ON public.product_variants FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.id = product_id AND s.user_id = auth.uid()
  ));

-- ================================================
-- PRODUCT ATTRIBUTES POLICIES
-- ================================================

-- Anyone can view product attributes
CREATE POLICY "Anyone can view product attributes"
  ON public.product_attributes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.products
    WHERE products.id = product_attributes.product_id
    AND products.is_active = true
  ));

-- Sellers can manage attributes
CREATE POLICY "Sellers can manage product attributes"
  ON public.product_attributes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.id = product_id AND s.user_id = auth.uid()
  ));

-- ================================================
-- REVIEWS POLICIES
-- ================================================

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id);

-- Authenticated users can insert reviews
CREATE POLICY "Users can insert own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- REVIEW IMAGES POLICIES
-- ================================================

-- Anyone can view review images for approved reviews
CREATE POLICY "Anyone can view review images"
  ON public.review_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.reviews
    WHERE reviews.id = review_images.review_id
    AND reviews.is_approved = true
  ));

-- Users can manage images for their reviews
CREATE POLICY "Users can manage review images"
  ON public.review_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.reviews
    WHERE reviews.id = review_id AND reviews.user_id = auth.uid()
  ));

-- ================================================
-- CARTS POLICIES
-- ================================================

-- Users can view their own cart
CREATE POLICY "Users can view own cart"
  ON public.carts FOR SELECT
  USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', true));

-- Users can insert their own cart
CREATE POLICY "Users can insert own cart"
  ON public.carts FOR INSERT
  WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

-- Users can update their own cart
CREATE POLICY "Users can update own cart"
  ON public.carts FOR UPDATE
  USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', true));

-- Users can delete their own cart
CREATE POLICY "Users can delete own cart"
  ON public.carts FOR DELETE
  USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', true));

-- ================================================
-- CART ITEMS POLICIES
-- ================================================

-- Users can view items in their cart
CREATE POLICY "Users can view own cart items"
  ON public.cart_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_items.cart_id
    AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('app.session_id', true))
  ));

-- Users can insert items to their cart
CREATE POLICY "Users can insert own cart items"
  ON public.cart_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_id
    AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('app.session_id', true))
  ));

-- Users can update items in their cart
CREATE POLICY "Users can update own cart items"
  ON public.cart_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_id
    AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('app.session_id', true))
  ));

-- Users can delete items from their cart
CREATE POLICY "Users can delete own cart items"
  ON public.cart_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.carts
    WHERE carts.id = cart_id
    AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('app.session_id', true))
  ));

-- ================================================
-- WISHLIST POLICIES
-- ================================================

-- Users can view their own wishlist
CREATE POLICY "Users can view own wishlist"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert to their wishlist
CREATE POLICY "Users can insert own wishlist"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete from their wishlist
CREATE POLICY "Users can delete own wishlist"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- ORDERS POLICIES
-- ================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending orders
CREATE POLICY "Users can update own pending orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- ================================================
-- ORDER ITEMS POLICIES
-- ================================================

-- Users can view items in their orders
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

-- Sellers can view their order items
CREATE POLICY "Sellers can view their order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sellers
    WHERE sellers.id = order_items.seller_id
    AND sellers.user_id = auth.uid()
  ));

-- System can insert order items
CREATE POLICY "System can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_id
    AND orders.user_id = auth.uid()
  ));

-- Sellers can update their order items
CREATE POLICY "Sellers can update their order items"
  ON public.order_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.sellers
    WHERE sellers.id = seller_id
    AND sellers.user_id = auth.uid()
  ));

-- ================================================
-- PAYMENTS POLICIES
-- ================================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payments
CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- PAYMENT METHODS POLICIES
-- ================================================

-- Users can view their own payment methods
CREATE POLICY "Users can view own payment methods"
  ON public.payment_methods FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payment methods
CREATE POLICY "Users can insert own payment methods"
  ON public.payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own payment methods
CREATE POLICY "Users can update own payment methods"
  ON public.payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own payment methods
CREATE POLICY "Users can delete own payment methods"
  ON public.payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- COUPONS POLICIES
-- ================================================

-- Anyone can view active coupons
CREATE POLICY "Anyone can view active coupons"
  ON public.coupons FOR SELECT
  USING (is_active = true AND NOW() BETWEEN valid_from AND valid_to);

-- Authenticated users can insert coupons (admins only in practice)
CREATE POLICY "Authenticated users can insert coupons"
  ON public.coupons FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update coupons
CREATE POLICY "Authenticated users can update coupons"
  ON public.coupons FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ================================================
-- COUPON USAGE POLICIES
-- ================================================

-- Users can view their own coupon usage
CREATE POLICY "Users can view own coupon usage"
  ON public.coupon_usage FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert coupon usage
CREATE POLICY "System can insert coupon usage"
  ON public.coupon_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- SHIPPING METHODS POLICIES
-- ================================================

-- Anyone can view active shipping methods
CREATE POLICY "Anyone can view active shipping methods"
  ON public.shipping_methods FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage shipping methods
CREATE POLICY "Authenticated users can manage shipping methods"
  ON public.shipping_methods FOR ALL
  USING (auth.role() = 'authenticated');

-- ================================================
-- SHIPMENTS POLICIES
-- ================================================

-- Users can view shipments for their orders
CREATE POLICY "Users can view own shipments"
  ON public.shipments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = shipments.order_id
    AND orders.user_id = auth.uid()
  ));

-- Authenticated users can manage shipments
CREATE POLICY "Authenticated users can manage shipments"
  ON public.shipments FOR ALL
  USING (auth.role() = 'authenticated');

-- ================================================
-- NOTIFICATIONS POLICIES
-- ================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert notifications
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- SUPPORT TICKETS POLICIES
-- ================================================

-- Users can view their own tickets
CREATE POLICY "Users can view own support tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = assigned_to);

-- Users can insert their own tickets
CREATE POLICY "Users can insert own support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets
CREATE POLICY "Users can update own support tickets"
  ON public.support_tickets FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = assigned_to);

-- ================================================
-- RETURNS POLICIES
-- ================================================

-- Users can view their own returns
CREATE POLICY "Users can view own returns"
  ON public.returns FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own returns
CREATE POLICY "Users can insert own returns"
  ON public.returns FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_id AND orders.user_id = auth.uid()
  ));

-- Users can update their own returns
CREATE POLICY "Users can update own returns"
  ON public.returns FOR UPDATE
  USING (auth.uid() = user_id);

-- ================================================
-- PRODUCT VIEWS POLICIES
-- ================================================

-- Anyone can insert product views
CREATE POLICY "Anyone can insert product views"
  ON public.product_views FOR INSERT
  WITH CHECK (true);

-- Users can view their own product views
CREATE POLICY "Users can view own product views"
  ON public.product_views FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ================================================
-- SEARCH QUERIES POLICIES
-- ================================================

-- Anyone can insert search queries
CREATE POLICY "Anyone can insert search queries"
  ON public.search_queries FOR INSERT
  WITH CHECK (true);

-- Users can view their own search queries
CREATE POLICY "Users can view own search queries"
  ON public.search_queries FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ================================================
-- INVENTORY TRANSACTIONS POLICIES
-- ================================================

-- Sellers can view inventory for their products
CREATE POLICY "Sellers can view own inventory transactions"
  ON public.inventory_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.id = product_id AND s.user_id = auth.uid()
  ));

-- Sellers can insert inventory transactions
CREATE POLICY "Sellers can insert inventory transactions"
  ON public.inventory_transactions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.id = product_id AND s.user_id = auth.uid()
  ));

