# E-Commerce Schema Documentation

Comprehensive type definitions for building an Amazon-like e-commerce platform.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Entities](#core-entities)
3. [Entity Relationships](#entity-relationships)
4. [Usage Examples](#usage-examples)
5. [Database Schema](#database-schema)

---

## Overview

The e-commerce schema provides TypeScript type definitions for all core entities in a full-featured e-commerce platform. This schema is designed to support:

- Multi-vendor marketplace (like Amazon)
- Product catalog with variants
- Shopping cart and checkout
- Order management
- Payment processing
- Reviews and ratings
- Shipping and tracking
- Inventory management
- Coupon system
- User management

---

## Core Entities

### 👤 User Management

#### `User`
Main user account entity
- Supports both customers and sellers
- Email-based authentication
- Profile information

#### `Address`
Shipping and billing addresses
- Supports multiple addresses per user
- Separate shipping/billing types
- Default address support

---

### 🛍️ Product Catalog

#### `Category`
Product categories with hierarchy
- Nested categories (parent/child)
- Slug for SEO-friendly URLs
- Sort ordering

#### `Product`
Main product entity
- Rich product information
- Pricing and inventory
- SEO optimization (slug, metadata)
- Featured products support
- Flexible metadata for custom attributes

#### `ProductVariant`
Product variations (size, color, etc.)
- Independent pricing and inventory
- Flexible attributes system
- Can have own images

#### `ProductImage`
Product images gallery
- Multiple images per product
- Sort ordering
- Primary image designation

#### `ProductAttribute`
Custom product attributes
- Flexible key-value pairs
- Examples: Material, Brand, Model

---

### 🛒 Shopping & Orders

#### `Cart`
Shopping cart for users
- Persistent carts for logged-in users
- Session-based carts for guests

#### `CartItem`
Items in shopping cart
- Product and variant references
- Quantity and price snapshot

#### `Wishlist`
User wishlist/favorites
- Simple product bookmarking

#### `Order`
Main order entity
- Complete order lifecycle tracking
- Payment status tracking
- Shipping information
- Discounts and taxes

#### `OrderItem`
Individual items in an order
- Product snapshot at time of purchase
- Per-item status tracking
- Individual seller reference

---

### 💳 Payments

#### `Payment`
Payment transactions
- Multiple payment methods support
- Payment provider integration
- Transaction tracking

#### `PaymentMethod`
Saved payment methods
- Credit/debit cards
- PayPal, Stripe, etc.
- Default payment method support

---

### 🎟️ Marketing

#### `Coupon`
Discount coupons and promotions
- Percentage or fixed amount
- Usage limits (global and per-user)
- Time-based validity
- Applicable to specific products/categories

#### `CouponUsage`
Track coupon usage
- Links to user and order
- Discount amount applied

---

### ⭐ Reviews & Ratings

#### `Review`
Product reviews
- 1-5 star rating
- Title and comment
- Verified purchase indicator
- Helpful vote count
- Admin approval system

#### `ReviewImage`
Images attached to reviews
- Customer-uploaded photos

---

### 🏪 Seller/Vendor

#### `Seller`
Vendor/seller accounts
- Business information
- Verification status
- Commission rate
- Performance metrics

---

### 📦 Shipping & Fulfillment

#### `ShippingMethod`
Available shipping options
- Carrier information
- Cost calculation
- Delivery estimates

#### `Shipment`
Shipment tracking
- Tracking numbers
- Status updates
- Delivery confirmation

---

### 🔔 Communication

#### `Notification`
User notifications
- Order updates
- Promotional messages
- System notifications
- Read/unread status

---

### 🎫 Support

#### `SupportTicket`
Customer support tickets
- Priority levels
- Status tracking
- Assignment to support staff

#### `Return`
Product returns and refunds
- Return reason
- Approval workflow
- Refund processing

---

### 📊 Analytics

#### `ProductView`
Track product page views
- User and session tracking
- Referrer information

#### `SearchQuery`
Search analytics
- Query tracking
- Results count
- Click-through tracking

---

### 📦 Inventory

#### `InventoryTransaction`
Inventory movement tracking
- Purchase, sale, return, adjustment
- Quantity tracking
- Audit trail

---

## Entity Relationships

### User → Orders
```
User (1) ──→ (Many) Order
User (1) ──→ (Many) Address
User (1) ──→ (Many) Review
User (1) ──→ (Many) Wishlist
User (1) ──→ (1) Cart
User (1) ──→ (Many) PaymentMethod
```

### Product → Orders
```
Category (1) ──→ (Many) Product
Product (1) ──→ (Many) ProductImage
Product (1) ──→ (Many) ProductVariant
Product (1) ──→ (Many) ProductAttribute
Product (1) ──→ (Many) Review
Product (1) ──→ (Many) CartItem
Product (1) ──→ (Many) OrderItem
```

### Order → Items
```
Order (1) ──→ (Many) OrderItem
Order (1) ──→ (Many) Payment
Order (1) ──→ (1) Shipment
Order (1) ──→ (0..1) Return
```

### Seller → Products
```
Seller (1) ──→ (Many) Product
Seller (1) ──→ (Many) OrderItem
```

---

## Usage Examples

### Creating a Product with Variants

```typescript
import type { Product, ProductVariant, ProductImage } from './ecommerce-schema'

// Main product
const tshirt: Product = {
  id: 'prod-tshirt-001',
  seller_id: 'seller-001',
  category_id: 'cat-clothing',
  name: 'Classic Cotton T-Shirt',
  slug: 'classic-cotton-tshirt',
  description: 'Comfortable 100% cotton t-shirt',
  sku: 'TSHIRT-CLASSIC',
  price: 29.99, // Base price
  quantity: 100, // Total quantity across all variants
  is_active: true,
  is_featured: false,
  created_at: new Date(),
  updated_at: new Date(),
}

// Variants for different sizes and colors
const variants: ProductVariant[] = [
  {
    id: 'var-001',
    product_id: 'prod-tshirt-001',
    name: 'Size: M, Color: Blue',
    sku: 'TSHIRT-CLASSIC-M-BLUE',
    price: 29.99,
    quantity: 25,
    attributes: { size: 'M', color: 'Blue' },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'var-002',
    product_id: 'prod-tshirt-001',
    name: 'Size: L, Color: Blue',
    sku: 'TSHIRT-CLASSIC-L-BLUE',
    price: 29.99,
    quantity: 25,
    attributes: { size: 'L', color: 'Blue' },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
]
```

### Processing an Order

```typescript
import type { Order, OrderItem, Payment } from './ecommerce-schema'

// Create order
const order: Order = {
  id: 'order-001',
  order_number: 'ORD-2024-00001',
  user_id: 'user-001',
  status: 'pending',
  payment_status: 'pending',
  subtotal: 59.98,
  tax: 4.80,
  shipping_cost: 10.00,
  discount_amount: 5.00,
  total: 69.78,
  currency: 'USD',
  shipping_address_id: 'addr-001',
  billing_address_id: 'addr-001',
  shipping_method: 'standard',
  created_at: new Date(),
  updated_at: new Date(),
}

// Add order items
const orderItems: OrderItem[] = [
  {
    id: 'item-001',
    order_id: 'order-001',
    product_id: 'prod-tshirt-001',
    variant_id: 'var-001',
    seller_id: 'seller-001',
    product_name: 'Classic Cotton T-Shirt',
    product_sku: 'TSHIRT-CLASSIC-M-BLUE',
    variant_name: 'Size: M, Color: Blue',
    quantity: 2,
    price: 29.99,
    tax: 4.80,
    discount_amount: 5.00,
    total: 59.78,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

// Process payment
const payment: Payment = {
  id: 'payment-001',
  order_id: 'order-001',
  user_id: 'user-001',
  payment_method: 'credit_card',
  payment_provider: 'stripe',
  transaction_id: 'txn_123456789',
  amount: 69.78,
  currency: 'USD',
  status: 'completed',
  created_at: new Date(),
  updated_at: new Date(),
}
```

### Applying a Coupon

```typescript
import type { Coupon, CouponUsage } from './ecommerce-schema'

// Check if coupon is valid
function validateCoupon(coupon: Coupon, userId: string, cartTotal: number): boolean {
  const now = new Date()
  
  // Check if active
  if (!coupon.is_active) return false
  
  // Check date validity
  if (now < coupon.valid_from || now > coupon.valid_to) return false
  
  // Check minimum purchase
  if (coupon.min_purchase_amount && cartTotal < coupon.min_purchase_amount) {
    return false
  }
  
  // Check usage limit
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return false
  }
  
  return true
}

// Calculate discount amount
function calculateDiscount(coupon: Coupon, subtotal: number): number {
  let discount = 0
  
  if (coupon.type === 'percentage') {
    discount = subtotal * (coupon.value / 100)
  } else if (coupon.type === 'fixed_amount') {
    discount = coupon.value
  }
  
  // Apply max discount limit if exists
  if (coupon.max_discount_amount) {
    discount = Math.min(discount, coupon.max_discount_amount)
  }
  
  return discount
}
```

---

## Database Schema

### Recommended Supabase Schema

When implementing this in Supabase, use the following SQL to create tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_seller BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER,
  weight DECIMAL(10, 3),
  dimensions JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
```

---

## Best Practices

### 1. **Use Type Guards**
```typescript
function isValidOrder(order: any): order is Order {
  return (
    typeof order.id === 'string' &&
    typeof order.user_id === 'string' &&
    typeof order.total === 'number'
  )
}
```

### 2. **Price Precision**
Always use `number` type but round to 2 decimal places when displaying:
```typescript
const price = Math.round(product.price * 100) / 100
```

### 3. **Status Enums**
Use the provided constants for consistency:
```typescript
import { ORDER_STATUS } from './ecommerce-schema'

order.status = ORDER_STATUS.PROCESSING // ✅ Good
order.status = 'processing' // ❌ Avoid
```

### 4. **Timestamps**
Always use `Date` objects, not strings:
```typescript
product.created_at = new Date() // ✅ Good
product.created_at = '2024-01-01' // ❌ Wrong type
```

---

## Contributing

When adding new entities or modifying existing ones:

1. Update `ecommerce-schema.ts`
2. Add examples to `ecommerce-schema.examples.ts`
3. Document the changes in this file
4. Run type checking: `npm run build`

---

## License

MIT

