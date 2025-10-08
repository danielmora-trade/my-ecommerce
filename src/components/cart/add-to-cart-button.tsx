'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { addToCart } from '@/app/cart-actions'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  productId: string
  productName: string
  isAuthenticated: boolean
  disabled?: boolean
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost'
}

export const AddToCartButton = ({ 
  productId, 
  productName,
  isAuthenticated, 
  disabled,
  className,
  size = 'default',
  variant = 'default'
}: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión', {
        description: 'Inicia sesión para agregar productos al carrito',
      })
      router.push('/auth/signin?redirect=/productos')
      return
    }

    setIsLoading(true)

    try {
      const result = await addToCart(productId, 1)
      
      if (result.success) {
        toast.success('Producto agregado', {
          description: `${productName} se agregó al carrito`,
        })
        router.refresh()
      } else {
        toast.error('Error', {
          description: result.error || 'No se pudo agregar el producto',
        })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Error', {
        description: 'Ocurrió un error al agregar el producto',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      className={className}
      size={size}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Agregando...
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar al Carrito
        </>
      )}
    </Button>
  )
}

