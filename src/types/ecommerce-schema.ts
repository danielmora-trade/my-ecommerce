// Core E-Commerce Schema Types
// Comprehensive type definitions for an Amazon-like e-commerce platform

// ==================== User & Authentication ====================

export interface User {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  is_seller: boolean
  is_verified: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
  last_login_at?: Date
}

export interface Address {
  id: string
  user_id: string
  type: 'shipping' | 'billing'
  is_default: boolean
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  created_at: Date
  updated_at: Date
}

// ==================== Product Catalog ====================

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string // For nested categories
  image_url?: string
  is_active: boolean
  sort_order: number
  created_at: Date
  updated_at: Date
}

export interface Product {
  id: string
  seller_id: string
  category_id: string
  name: string
  slug: string
  description: string
  short_description?: string
  sku: string
  price: number
  compare_at_price?: number // Original price for discount display
  cost_price?: number // For seller's reference
  quantity: number
  low_stock_threshold?: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'in'
  }
  is_active: boolean
  is_featured: boolean
  tags?: string[]
  metadata?: Record<string, unknown> // Flexible field for custom attributes
  created_at: Date
  updated_at: Date
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
  created_at: Date
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string // e.g., "Size: Large, Color: Blue"
  sku: string
  price: number
  quantity: number
  attributes: Record<string, string> // e.g., { "size": "L", "color": "blue" }
  image_url?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface ProductAttribute {
  id: string
  product_id: string
  name: string // e.g., "Color", "Size", "Material"
  value: string
  created_at: Date
}

// ==================== Reviews & Ratings ====================

export interface Review {
  id: string
  product_id: string
  user_id: string
  order_id?: string // Link to verified purchase
  rating: number // 1-5
  title: string
  comment: string
  is_verified_purchase: boolean
  helpful_count: number
  is_approved: boolean
  created_at: Date
  updated_at: Date
}

export interface ReviewImage {
  id: string
  review_id: string
  url: string
  created_at: Date
}

// ==================== Shopping Cart ====================

export interface Cart {
  id: string
  user_id?: string // Optional for guest carts
  session_id?: string // For guest users
  created_at: Date
  updated_at: Date
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  variant_id?: string
  quantity: number
  price: number // Price at time of adding to cart
  created_at: Date
  updated_at: Date
}

// ==================== Wishlist ====================

export interface Wishlist {
  id: string
  user_id: string
  product_id: string
  created_at: Date
}

// ==================== Orders ====================

export interface Order {
  id: string
  order_number: string // Human-readable order number
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  tax: number
  shipping_cost: number
  discount_amount: number
  total: number
  currency: string
  
  // Shipping information
  shipping_address_id: string
  billing_address_id: string
  shipping_method: string
  tracking_number?: string
  
  // Additional info
  notes?: string
  metadata?: Record<string, unknown>
  
  created_at: Date
  updated_at: Date
  shipped_at?: Date
  delivered_at?: Date
  cancelled_at?: Date
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id?: string
  seller_id: string
  
  // Product details (snapshot at time of order)
  product_name: string
  product_sku: string
  variant_name?: string
  
  quantity: number
  price: number // Price per unit
  tax: number
  discount_amount: number
  total: number
  
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  
  created_at: Date
  updated_at: Date
}

// ==================== Payments ====================

export interface Payment {
  id: string
  order_id: string
  user_id: string
  payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'cash_on_delivery'
  payment_provider: string
  transaction_id?: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  metadata?: Record<string, unknown>
  created_at: Date
  updated_at: Date
}

export interface PaymentMethod {
  id: string
  user_id: string
  type: 'credit_card' | 'debit_card' | 'paypal'
  is_default: boolean
  
  // Card details (if applicable)
  card_last_four?: string
  card_brand?: string
  card_exp_month?: number
  card_exp_year?: number
  
  // Provider details
  provider: string
  provider_payment_method_id: string
  
  created_at: Date
  updated_at: Date
}

// ==================== Coupons & Discounts ====================

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping'
  value: number
  min_purchase_amount?: number
  max_discount_amount?: number
  usage_limit?: number
  usage_count: number
  per_user_limit?: number
  valid_from: Date
  valid_to: Date
  is_active: boolean
  applicable_to: 'all' | 'categories' | 'products'
  applicable_ids?: string[] // Category or product IDs
  created_at: Date
  updated_at: Date
}

export interface CouponUsage {
  id: string
  coupon_id: string
  user_id: string
  order_id: string
  discount_amount: number
  created_at: Date
}

// ==================== Seller/Vendor Management ====================

export interface Seller {
  id: string
  user_id: string
  business_name: string
  business_email: string
  business_phone: string
  description?: string
  logo_url?: string
  banner_url?: string
  
  // Business details
  tax_id?: string
  business_address: string
  
  // Status
  is_verified: boolean
  is_active: boolean
  rating: number
  total_sales: number
  
  // Commission
  commission_rate: number // Percentage
  
  created_at: Date
  updated_at: Date
}

// ==================== Shipping ====================

export interface ShippingMethod {
  id: string
  name: string
  description?: string
  carrier: string
  estimated_days_min: number
  estimated_days_max: number
  base_cost: number
  cost_per_kg?: number
  free_shipping_threshold?: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Shipment {
  id: string
  order_id: string
  shipping_method_id: string
  tracking_number?: string
  carrier: string
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  shipped_at?: Date
  estimated_delivery_at?: Date
  delivered_at?: Date
  created_at: Date
  updated_at: Date
}

// ==================== Notifications ====================

export interface Notification {
  id: string
  user_id: string
  type: 'order' | 'payment' | 'shipping' | 'review' | 'promotion' | 'system'
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: Date
  read_at?: Date
}

// ==================== Analytics & Reporting ====================

export interface ProductView {
  id: string
  product_id: string
  user_id?: string
  session_id?: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  viewed_at: Date
}

export interface SearchQuery {
  id: string
  user_id?: string
  query: string
  results_count: number
  clicked_product_id?: string
  searched_at: Date
}

// ==================== Support & Returns ====================

export interface SupportTicket {
  id: string
  user_id: string
  order_id?: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  created_at: Date
  updated_at: Date
  resolved_at?: Date
}

export interface Return {
  id: string
  order_id: string
  order_item_id: string
  user_id: string
  reason: string
  description: string
  status: 'requested' | 'approved' | 'rejected' | 'received' | 'refunded'
  refund_amount: number
  images?: string[]
  created_at: Date
  updated_at: Date
  approved_at?: Date
  refunded_at?: Date
}

// ==================== Inventory Management ====================

export interface InventoryTransaction {
  id: string
  product_id: string
  variant_id?: string
  type: 'purchase' | 'sale' | 'return' | 'adjustment' | 'damage'
  quantity_change: number
  quantity_after: number
  reference_id?: string // Order ID, etc.
  notes?: string
  created_at: Date
}

// ==================== Helper Types ====================

export interface PaginationParams {
  page: number
  limit: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface FilterParams {
  category_id?: string
  min_price?: number
  max_price?: number
  rating?: number
  in_stock?: boolean
  is_featured?: boolean
  search?: string
  tags?: string[]
}

// ==================== API Response Types ====================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    timestamp: Date
    request_id: string
  }
}

// ==================== Enums & Constants ====================

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const USER_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const

export const PRODUCT_CONDITION = {
  NEW: 'new',
  REFURBISHED: 'refurbished',
  USED: 'used',
} as const

