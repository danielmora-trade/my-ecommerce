// Usage examples for the e-commerce schema types
// This file demonstrates how to use the types defined in ecommerce-schema.ts

import type {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Address,
  Review,
  Seller,
  Coupon,
} from './ecommerce-schema'

// ==================== Example: Creating a User ====================

export const exampleUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'john.doe@example.com',
  password_hash: '$2b$10$...',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
  avatar_url: 'https://example.com/avatars/johndoe.jpg',
  is_seller: false,
  is_verified: true,
  is_active: true,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-15'),
  last_login_at: new Date('2024-01-15'),
}

// ==================== Example: Creating a Category ====================

export const exampleCategory: Category = {
  id: 'cat-001',
  name: 'Electronics',
  slug: 'electronics',
  description: 'Electronic devices and accessories',
  parent_id: undefined, // Top-level category
  image_url: 'https://example.com/categories/electronics.jpg',
  is_active: true,
  sort_order: 1,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
}

export const exampleSubCategory: Category = {
  id: 'cat-002',
  name: 'Smartphones',
  slug: 'smartphones',
  description: 'Latest smartphones and mobile devices',
  parent_id: 'cat-001', // Child of Electronics
  image_url: 'https://example.com/categories/smartphones.jpg',
  is_active: true,
  sort_order: 1,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
}

// ==================== Example: Creating a Product ====================

export const exampleProduct: Product = {
  id: 'prod-001',
  seller_id: 'seller-001',
  category_id: 'cat-002',
  name: 'iPhone 15 Pro Max',
  slug: 'iphone-15-pro-max',
  description: 'The most powerful iPhone ever with A17 Pro chip',
  short_description: 'Latest flagship iPhone with titanium design',
  sku: 'IPHONE-15-PRO-MAX-256',
  price: 1199.99,
  compare_at_price: 1299.99,
  cost_price: 900.00,
  quantity: 50,
  low_stock_threshold: 10,
  weight: 0.221, // kg
  dimensions: {
    length: 16.0,
    width: 7.7,
    height: 0.83,
    unit: 'cm',
  },
  is_active: true,
  is_featured: true,
  tags: ['smartphone', 'apple', 'ios', '5g', 'pro'],
  metadata: {
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    color: 'Natural Titanium',
    storage: '256GB',
    warranty: '1 year',
  },
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-15'),
}

// ==================== Example: Creating an Address ====================

export const exampleAddress: Address = {
  id: 'addr-001',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  type: 'shipping',
  is_default: true,
  full_name: 'John Doe',
  phone: '+1234567890',
  address_line_1: '123 Main Street',
  address_line_2: 'Apt 4B',
  city: 'New York',
  state: 'NY',
  postal_code: '10001',
  country: 'USA',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
}

// ==================== Example: Creating a Cart ====================

export const exampleCart: Cart = {
  id: 'cart-001',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: new Date('2024-01-15'),
  updated_at: new Date('2024-01-15'),
}

export const exampleCartItem: CartItem = {
  id: 'cart-item-001',
  cart_id: 'cart-001',
  product_id: 'prod-001',
  variant_id: undefined,
  quantity: 1,
  price: 1199.99,
  created_at: new Date('2024-01-15'),
  updated_at: new Date('2024-01-15'),
}

// ==================== Example: Creating an Order ====================

export const exampleOrder: Order = {
  id: 'order-001',
  order_number: 'ORD-2024-00001',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  status: 'processing',
  payment_status: 'paid',
  subtotal: 1199.99,
  tax: 96.00,
  shipping_cost: 15.00,
  discount_amount: 50.00,
  total: 1260.99,
  currency: 'USD',
  shipping_address_id: 'addr-001',
  billing_address_id: 'addr-001',
  shipping_method: 'standard',
  tracking_number: '1Z999AA10123456784',
  notes: 'Please deliver between 9 AM - 5 PM',
  metadata: {
    gift_message: 'Happy Birthday!',
    gift_wrap: true,
  },
  created_at: new Date('2024-01-15'),
  updated_at: new Date('2024-01-16'),
  shipped_at: new Date('2024-01-16'),
}

export const exampleOrderItem: OrderItem = {
  id: 'order-item-001',
  order_id: 'order-001',
  product_id: 'prod-001',
  variant_id: undefined,
  seller_id: 'seller-001',
  product_name: 'iPhone 15 Pro Max',
  product_sku: 'IPHONE-15-PRO-MAX-256',
  variant_name: undefined,
  quantity: 1,
  price: 1199.99,
  tax: 96.00,
  discount_amount: 50.00,
  total: 1245.99,
  status: 'processing',
  created_at: new Date('2024-01-15'),
  updated_at: new Date('2024-01-16'),
}

// ==================== Example: Creating a Review ====================

export const exampleReview: Review = {
  id: 'review-001',
  product_id: 'prod-001',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  order_id: 'order-001',
  rating: 5,
  title: 'Amazing phone!',
  comment: 'The iPhone 15 Pro Max exceeded my expectations. The camera is incredible and the battery life is fantastic.',
  is_verified_purchase: true,
  helpful_count: 42,
  is_approved: true,
  created_at: new Date('2024-01-20'),
  updated_at: new Date('2024-01-20'),
}

// ==================== Example: Creating a Seller ====================

export const exampleSeller: Seller = {
  id: 'seller-001',
  user_id: 'user-002',
  business_name: 'Tech Gadgets Store',
  business_email: 'contact@techgadgets.com',
  business_phone: '+1234567890',
  description: 'Your trusted source for the latest technology products',
  logo_url: 'https://example.com/sellers/techgadgets-logo.jpg',
  banner_url: 'https://example.com/sellers/techgadgets-banner.jpg',
  tax_id: '12-3456789',
  business_address: '456 Commerce Blvd, Tech City, TC 12345',
  is_verified: true,
  is_active: true,
  rating: 4.8,
  total_sales: 15000,
  commission_rate: 15, // 15%
  created_at: new Date('2023-06-01'),
  updated_at: new Date('2024-01-15'),
}

// ==================== Example: Creating a Coupon ====================

export const exampleCoupon: Coupon = {
  id: 'coupon-001',
  code: 'SAVE50',
  type: 'fixed_amount',
  value: 50.00,
  min_purchase_amount: 100.00,
  max_discount_amount: 50.00,
  usage_limit: 1000,
  usage_count: 234,
  per_user_limit: 1,
  valid_from: new Date('2024-01-01'),
  valid_to: new Date('2024-12-31'),
  is_active: true,
  applicable_to: 'all',
  applicable_ids: undefined,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-15'),
}

// ==================== Example: Query Functions ====================

// Example of a function that would fetch products with filters
export interface GetProductsParams {
  category_id?: string
  min_price?: number
  max_price?: number
  search?: string
  page?: number
  limit?: number
}

// Example return type for a products list
export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Example of a function that would create an order
export interface CreateOrderParams {
  user_id: string
  cart_items: {
    product_id: string
    variant_id?: string
    quantity: number
  }[]
  shipping_address_id: string
  billing_address_id: string
  payment_method_id: string
  coupon_code?: string
}

// Example of an order summary
export interface OrderSummary {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  items_count: number
}

// ==================== Example: Utility Functions ====================

// Example function to calculate order total
export function calculateOrderTotal(
  subtotal: number,
  taxRate: number,
  shippingCost: number,
  discountAmount: number
): number {
  const tax = subtotal * (taxRate / 100)
  return subtotal + tax + shippingCost - discountAmount
}

// Example function to check if product is in stock
export function isProductInStock(product: Product): boolean {
  return product.quantity > 0 && product.is_active
}

// Example function to check if product is low in stock
export function isProductLowStock(product: Product): boolean {
  if (!product.low_stock_threshold) return false
  return product.quantity <= product.low_stock_threshold && product.quantity > 0
}

// Example function to calculate discount percentage
export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

