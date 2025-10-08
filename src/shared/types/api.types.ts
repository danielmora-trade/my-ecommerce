/**
 * Shared API Types
 * These types define the contract between frontend and backend
 */

// ==================== AUTH API TYPES ====================

export interface SignUpRequest {
  email: string
  password: string
}

export interface SignUpResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
  }
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    email_confirmed_at: string | null
    created_at: string
    last_sign_in_at: string | null
  }
  session?: {
    access_token: string
    refresh_token: string
  }
}

export interface SignInWithOTPRequest {
  email: string
}

export interface SignInWithOTPResponse {
  success: boolean
  message: string
}

export interface SignOutRequest {}

export interface SignOutResponse {
  success: boolean
  message: string
}

export interface GetUserResponse {
  success: boolean
  user?: {
    id: string
    email: string
    email_confirmed_at: string | null
    created_at: string
    last_sign_in_at: string | null
  }
  message?: string
}

export interface OAuthSignInRequest {
  provider: 'google' | 'github' | 'facebook'
}

export interface OAuthSignInResponse {
  success: boolean
  url?: string
  message?: string
}

// ==================== PRODUCT API TYPES ====================

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  category_id: string | null
  seller_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GetProductsRequest {
  page?: number
  limit?: number
  category_id?: string
  search?: string
}

export interface GetProductsResponse {
  success: boolean
  products: Product[]
  total: number
  page: number
  limit: number
}

export interface GetProductByIdResponse {
  success: boolean
  product?: Product
  message?: string
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  stock_quantity: number
  category_id?: string
}

export interface CreateProductResponse {
  success: boolean
  product?: Product
  message?: string
}

export interface UpdateProductRequest {
  id: string
  name?: string
  description?: string
  price?: number
  stock_quantity?: number
  category_id?: string
  is_active?: boolean
}

export interface UpdateProductResponse {
  success: boolean
  product?: Product
  message?: string
}

export interface DeleteProductRequest {
  id: string
}

export interface DeleteProductResponse {
  success: boolean
  message: string
}

// ==================== CART API TYPES ====================

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
}

export interface GetCartResponse {
  success: boolean
  items: CartItem[]
  message?: string
}

export interface AddToCartRequest {
  product_id: string
  quantity: number
}

export interface AddToCartResponse {
  success: boolean
  item?: CartItem
  message?: string
}

export interface UpdateCartItemRequest {
  cart_item_id: string
  quantity: number
}

export interface UpdateCartItemResponse {
  success: boolean
  item?: CartItem
  message?: string
}

export interface RemoveFromCartRequest {
  cart_item_id: string
}

export interface RemoveFromCartResponse {
  success: boolean
  message: string
}

// ==================== ORDER API TYPES ====================

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}

export interface GetOrdersResponse {
  success: boolean
  orders: Order[]
  message?: string
}

export interface CreateOrderRequest {
  items: Array<{
    product_id: string
    quantity: number
    price: number
  }>
  shipping_address_id: string
}

export interface CreateOrderResponse {
  success: boolean
  order?: Order
  message?: string
}

// ==================== PROFILE API TYPES ====================

export interface UserProfile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  created_at: string
  updated_at: string
}

export interface GetProfileResponse {
  success: boolean
  profile?: UserProfile
  message?: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  phone_number?: string
}

export interface UpdateProfileResponse {
  success: boolean
  profile?: UserProfile
  message?: string
}

// ==================== ERROR TYPES ====================

export interface APIError {
  success: false
  error: string
  message: string
  statusCode: number
}

// ==================== GENERIC RESPONSE ====================

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

