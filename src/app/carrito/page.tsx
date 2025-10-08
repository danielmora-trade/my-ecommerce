import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getCartSummary } from '@/app/cart-actions'
import { createClient } from '@/lib/supabase/server'
import { CartItemsList } from '@/components/cart/cart-items-list'
import { ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default async function CartPage() {
  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin?redirect=/carrito')
  }

  const summary = await getCartSummary()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/productos">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Carrito de Compras
          </h1>
          <p className="text-gray-600 mt-2">
            {summary.itemCount === 0 
              ? 'Tu carrito está vacío' 
              : `${summary.itemCount} ${summary.itemCount === 1 ? 'artículo' : 'artículos'} en tu carrito`
            }
          </p>
        </div>

        {summary.itemCount === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              Agrega productos para comenzar tu compra
            </p>
            <Link href="/productos">
              <Button className="bg-brand-600 hover:bg-brand-700">
                Explorar Productos
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart with items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Productos</h2>
                  <CartItemsList items={summary.items} />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({summary.itemCount} {summary.itemCount === 1 ? 'artículo' : 'artículos'})</span>
                      <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>IVA (12%)</span>
                      <span className="font-medium">${summary.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-brand-600">${summary.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-brand-600 hover:bg-brand-700 mb-3" size="lg">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Realizar Pedido
                    </Button>
                  </Link>

                  <Link href="/productos">
                    <Button variant="outline" className="w-full">
                      Continuar Comprando
                    </Button>
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Envío seguro y confiable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Garantía de devolución</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Pago seguro SSL</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export const metadata = {
  title: 'Carrito de Compras - ACEROMAX',
  description: 'Revisa y completa tu compra',
}

