'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react'
import { updateCartItemQuantity, removeFromCart, type CartItemWithProduct } from '@/app/cart-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CartItemsListProps {
  items: CartItemWithProduct[]
}

export const CartItemsList = ({ items }: CartItemsListProps) => {
  const router = useRouter()
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())

  const setItemLoading = (itemId: string, isLoading: boolean) => {
    setLoadingItems(prev => {
      const newSet = new Set(prev)
      if (isLoading) {
        newSet.add(itemId)
      } else {
        newSet.delete(itemId)
      }
      return newSet
    })
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setItemLoading(itemId, true)
    
    try {
      const result = await updateCartItemQuantity(itemId, newQuantity)
      
      if (result.success) {
        router.refresh()
      } else {
        toast.error('Error', {
          description: result.error || 'No se pudo actualizar la cantidad',
        })
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Error', {
        description: 'Ocurrió un error al actualizar la cantidad',
      })
    } finally {
      setItemLoading(itemId, false)
    }
  }

  const handleRemove = async (itemId: string, productName: string) => {
    setItemLoading(itemId, true)
    
    try {
      const result = await removeFromCart(itemId)
      
      if (result.success) {
        toast.success('Producto eliminado', {
          description: `${productName} se eliminó del carrito`,
        })
        router.refresh()
      } else {
        toast.error('Error', {
          description: result.error || 'No se pudo eliminar el producto',
        })
        setItemLoading(itemId, false)
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Error', {
        description: 'Ocurrió un error al eliminar el producto',
      })
      setItemLoading(itemId, false)
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const product = item.products
        const isLoading = loadingItems.has(item.id)
        const itemTotal = Number(item.price) * item.quantity

        return (
          <div key={item.id}>
            <div className="flex gap-4">
              {/* Product Image Placeholder */}
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">
                  {product.categories?.slug === 'varillas' ? '🔩' :
                   product.categories?.slug === 'perfiles' ? '📐' :
                   product.categories?.slug === 'vigas' ? '🏗️' :
                   product.categories?.slug === 'laminas' ? '📋' :
                   product.categories?.slug === 'tubos' ? '⚙️' :
                   product.categories?.slug === 'mallas' ? '🔲' :
                   product.categories?.slug === 'alambres' ? '🧵' : '🔧'}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/productos/${product.slug}`}
                  className="font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  SKU: {product.sku}
                </p>
                {product.categories && (
                  <p className="text-xs text-brand-600 mt-1">
                    {product.categories.name}
                  </p>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={isLoading || item.quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-3 py-1 min-w-[3rem] text-center font-medium">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading || item.quantity >= product.quantity}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(item.id, product.name)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>

                {product.quantity < 10 && (
                  <p className="text-xs text-yellow-600 mt-2">
                    ⚠️ Solo {product.quantity} disponibles
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm text-gray-500">Precio unitario</p>
                <p className="font-semibold text-gray-900">
                  ${Number(item.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-2">Total</p>
                <p className="text-lg font-bold text-brand-600">
                  ${itemTotal.toFixed(2)}
                </p>
              </div>
            </div>

            {index < items.length - 1 && <Separator className="mt-4" />}
          </div>
        )
      })}
    </div>
  )
}

