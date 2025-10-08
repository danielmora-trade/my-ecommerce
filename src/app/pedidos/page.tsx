import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserOrders } from '@/app/order-actions'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { OrdersListClient } from '@/components/orders/orders-list-client'
import { Package, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Mis Pedidos - ACEROMAX',
  description: 'Historial de pedidos',
}

export default async function OrdersPage() {
  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin?redirect=/pedidos')
  }

  // Get all orders
  const orders = await getUserOrders()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-8 w-8 text-brand-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Mis Pedidos
              </h1>
            </div>
            <p className="text-gray-600">
              Revisa el estado y detalles de todos tus pedidos
            </p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Aún no tienes pedidos
              </h2>
              <p className="text-gray-600 mb-8">
                Explora nuestro catálogo y realiza tu primera compra
              </p>
              <Link href="/productos">
                <Button className="bg-brand-600 hover:bg-brand-700">
                  Explorar Productos
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {orders.length} {orders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
              </p>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <OrdersListClient orders={orders as any} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

