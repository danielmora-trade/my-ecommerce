import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getOrderByNumber } from '@/app/order-actions'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Truck, MapPin, CreditCard, ArrowRight } from 'lucide-react'

interface OrderConfirmationPageProps {
  params: Promise<{
    orderNumber: string
  }>
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const resolvedParams = await params
  
  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Get order details
  const order = await getOrderByNumber(resolvedParams.orderNumber)

  if (!order) {
    notFound()
  }

  const itemCount = order.order_items?.length || 0
  const paymentMethod = order.metadata as { payment_method?: string }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-gray-600 text-lg">
              Tu pedido ha sido recibido y está siendo procesado
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Número de Orden</h3>
                  <p className="text-2xl font-bold text-brand-600">{order.order_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Estado del Pedido</h3>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-semibold capitalize">
                      {order.status === 'pending' ? 'En Preparación' : order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha del Pedido</h3>
                  <p className="text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('es-EC', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-600" />
                Dirección de Envío
              </h3>
              {order.shipping_address && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{order.shipping_address.full_name}</p>
                  <p className="text-sm text-gray-600">{order.shipping_address.phone}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {order.shipping_address.address_line_1}
                  </p>
                  {order.shipping_address.address_line_2 && (
                    <p className="text-sm text-gray-600">{order.shipping_address.address_line_2}</p>
                  )}
                  <p className="text-sm text-gray-700">
                    {order.shipping_address.city}, {order.shipping_address.state}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-600" />
                Método de Pago
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {paymentMethod?.payment_method === 'cash_on_delivery' ? (
                  <>
                    <p className="font-medium">Pago Contra Entrega</p>
                    <p className="text-sm text-gray-600">
                      Pagarás en efectivo cuando recibas tu pedido
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Pago con Tarjeta</p>
                    <p className="text-sm text-green-600">✓ Pago procesado exitosamente</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Productos ({itemCount})</h3>
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-3xl flex-shrink-0">
                      🔩
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${Number(item.total).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${Number(item.price).toFixed(2)} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (12%)</span>
                  <span>${Number(order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600">GRATIS</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-brand-600">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                ¿Qué sigue?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">1.</span>
                  <span>Recibirás un correo de confirmación con los detalles de tu pedido.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">2.</span>
                  <span>Prepararemos tu pedido y te notificaremos cuando esté listo para envío.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">3.</span>
                  <span>Te enviaremos un número de seguimiento para rastrear tu envío.</span>
                </li>
                {paymentMethod?.payment_method === 'cash_on_delivery' && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">4.</span>
                    <span className="font-medium">Ten preparado el monto exacto en efectivo al recibir tu pedido.</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/productos" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Continuar Comprando
              </Button>
            </Link>
            <Link href="/pedidos" className="flex-1">
              <Button className="w-full bg-brand-600 hover:bg-brand-700" size="lg">
                Ver Mis Pedidos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: OrderConfirmationPageProps) {
  const resolvedParams = await params
  
  return {
    title: `Pedido ${resolvedParams.orderNumber} - ACEROMAX`,
    description: 'Confirmación de tu pedido',
  }
}

