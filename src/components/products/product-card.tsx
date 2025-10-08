import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { ProductWithRelations } from '@/app/actions'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'

interface ProductCardProps {
  product: ProductWithRelations
  categoryIcon?: string
  isAuthenticated?: boolean
}

export const ProductCard = ({ product, categoryIcon, isAuthenticated = false }: ProductCardProps) => {
  const rating = 4.8
  const stockStatus = product.quantity < 100 ? 'Limitado' : 'En stock'
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-brand-600 h-full">
      <CardContent className="p-0">
        {/* Product Image */}
        <Link href={`/productos/${product.slug}`} className="block">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              {categoryIcon || '🔩'}
            </div>
            {stockStatus === 'Limitado' && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Stock Limitado
              </div>
            )}
            {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                OFERTA
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold text-sm">{rating}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          {product.categories && (
            <p className="text-xs text-brand-600 font-medium mb-1">
              {product.categories.name}
            </p>
          )}
          <Link href={`/productos/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-2 hover:text-brand-600 transition-colors line-clamp-2 min-h-[3rem] cursor-pointer">
              {product.name}
            </h3>
          </Link>
          {product.short_description && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
              {product.short_description}
            </p>
          )}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-brand-600">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
              <span className="text-sm text-gray-500 line-through">
                ${Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            isAuthenticated={isAuthenticated}
            disabled={product.quantity === 0}
            className="w-full bg-brand-600 hover:bg-brand-700 group-hover:shadow-lg transition-shadow"
          />
        </div>
      </CardContent>
    </Card>
  )
}

