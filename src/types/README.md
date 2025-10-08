# E-Commerce Type Definitions

This directory contains comprehensive TypeScript type definitions for building a full-featured e-commerce platform.

## Files Overview

### 📄 `ecommerce-schema.ts`
**Main schema file** - Contains all core type definitions for the e-commerce platform.

**Includes 30+ entity types:**
- User Management (User, Address)
- Product Catalog (Product, Category, ProductVariant, ProductImage, ProductAttribute)
- Shopping (Cart, CartItem, Wishlist)
- Orders (Order, OrderItem)
- Payments (Payment, PaymentMethod)
- Marketing (Coupon, CouponUsage)
- Reviews (Review, ReviewImage)
- Sellers (Seller)
- Shipping (ShippingMethod, Shipment)
- Support (SupportTicket, Return)
- Analytics (ProductView, SearchQuery)
- Inventory (InventoryTransaction)
- Notifications
- And more...

### 📄 `ecommerce-schema.examples.ts`
**Usage examples** - Real-world examples showing how to use the types.

Includes examples for:
- Creating products with variants
- Processing orders
- Applying coupons
- Managing inventory
- Utility functions

### 📄 `SCHEMA_DOCUMENTATION.md`
**Comprehensive documentation** - Detailed guide to the schema.

Includes:
- Entity descriptions
- Relationship diagrams
- Usage examples
- Database schema SQL
- Best practices

### 📄 `database.types.ts`
**Supabase types** - Auto-generated types from your Supabase database.

Generate with:
```bash
npx supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts
```

## Quick Start

### Import Types
```typescript
import type { Product, Order, User, Cart } from '@/types/ecommerce-schema'
```

### Use in Components
```typescript
interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  )
}
```

### Use in API Routes
```typescript
import type { Order, ApiResponse } from '@/types/ecommerce-schema'

export async function POST(request: Request) {
  const order: Order = await request.json()
  
  const response: ApiResponse<Order> = {
    success: true,
    data: order,
  }
  
  return Response.json(response)
}
```

## Schema Features

✅ **Type-safe** - Full TypeScript support with strict typing
✅ **Comprehensive** - Covers all aspects of e-commerce
✅ **Flexible** - Metadata fields for custom attributes
✅ **Scalable** - Supports multi-vendor marketplaces
✅ **Production-ready** - Based on real-world e-commerce platforms

## Key Entities

| Entity | Description | Key Features |
|--------|-------------|--------------|
| `Product` | Core product entity | Variants, pricing, inventory |
| `Order` | Customer orders | Status tracking, payments |
| `User` | User accounts | Customer/Seller support |
| `Cart` | Shopping cart | Guest & logged-in users |
| `Payment` | Payment processing | Multiple providers |
| `Review` | Product reviews | Ratings, verified purchases |
| `Seller` | Vendor accounts | Multi-vendor marketplace |
| `Coupon` | Discounts & promotions | Flexible rules |

## Entity Relationships

```
User ──→ Cart ──→ CartItem ──→ Product
  │
  ├──→ Order ──→ OrderItem ──→ Product
  │      │
  │      └──→ Payment
  │      └──→ Shipment
  │
  ├──→ Address
  ├──→ Review ──→ Product
  ├──→ Wishlist ──→ Product
  └──→ PaymentMethod

Seller ──→ Product
Category ──→ Product ──→ ProductVariant
                   ├──→ ProductImage
                   └──→ ProductAttribute
```

## Common Patterns

### Product with Variants
```typescript
// Main product
const product: Product = {
  id: 'prod-001',
  name: 'T-Shirt',
  price: 29.99,
  quantity: 100,
  // ... other fields
}

// Variants (size, color, etc.)
const variants: ProductVariant[] = [
  { id: 'var-001', product_id: 'prod-001', attributes: { size: 'M', color: 'Blue' } },
  { id: 'var-002', product_id: 'prod-001', attributes: { size: 'L', color: 'Blue' } },
]
```

### Order Flow
```typescript
1. User adds items to Cart → CartItem[]
2. User checks out → Create Order
3. Process Payment → Payment
4. Create OrderItem[] from CartItem[]
5. Ship Order → Shipment
6. Deliver Order → Update Order.status
```

### Discount Calculation
```typescript
1. Check Coupon validity
2. Apply discount to Order.subtotal
3. Calculate tax on discounted amount
4. Add shipping cost
5. Calculate Order.total
```

## Constants & Enums

Use provided constants for consistency:

```typescript
import { ORDER_STATUS, PAYMENT_STATUS, USER_ROLES } from '@/types/ecommerce-schema'

order.status = ORDER_STATUS.PROCESSING
payment.status = PAYMENT_STATUS.PAID
user.role = USER_ROLES.CUSTOMER
```

## Learn More

- See `SCHEMA_DOCUMENTATION.md` for detailed documentation
- See `ecommerce-schema.examples.ts` for code examples
- Check Next.js docs for App Router patterns

## Contributing

When modifying the schema:

1. Update `ecommerce-schema.ts`
2. Add examples to `ecommerce-schema.examples.ts`
3. Update `SCHEMA_DOCUMENTATION.md`
4. Run `npm run build` to verify

---

**Ready to build your e-commerce platform! 🚀**

