'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Package, MapPin, CreditCard, Calendar, Hash, Banknote } from 'lucide-react'

interface OrderItem {
  id: string
  product_name: string
  product_sku: string
  quantity: number
  price: number
  total: number
}

interface ShippingAddress {
  full_name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  postal_code: string
  country: string
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: number
  tax: number
  shipping_cost: number
  total: number
  created_at: string
  shipping_method: string
  metadata: {
    payment_method?: string
  }
  shipping_address: ShippingAddress | null
  order_items: OrderItem[]
}

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export const OrderDetailsModal = ({ order, isOpen, onClose }: OrderDetailsModalProps) => {
  if (!order) return null

  const paymentMethod = order.metadata?.payment_method || 'unknown'
  const statusLabels: Record<string, string> = {
    pending: 'En Preparación',
    processing: 'En Proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Package className="h-6 w-6 text-brand-600" />
            Detalles del Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Header Info */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Hash className="h-4 w-4" />
                    Número de Pedido
                  </div>
                  <p className="text-xl font-bold text-brand-600">{order.order_number}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    Fecha del Pedido
                  </div>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('es-EC', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado del Pedido</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || statusColors.pending}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-brand-600" />
                Productos ({order.order_items?.length || 0})
              </h3>
              <div className="space-y-3">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-2xl flex-shrink-0">
                      🔩
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: <span className="font-medium">{item.quantity}</span> × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${Number(item.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (12%)</span>
                  <span className="font-medium">${Number(order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="font-medium text-green-600">
                    {Number(order.shipping_cost) === 0 ? 'GRATIS' : `$${Number(order.shipping_cost).toFixed(2)}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-brand-600">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shipping_address && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand-600" />
                  Dirección de Envío
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">{order.shipping_address.full_name}</p>
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
                  <p className="text-sm text-gray-700">
                    {order.shipping_address.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-600" />
                Método de Pago
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {paymentMethod === 'cash_on_delivery' ? (
                  <div className="flex items-center gap-3">
                    <Banknote className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Pago Contra Entrega</p>
                      <p className="text-sm text-gray-600">
                        {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente de pago'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Pago con Tarjeta</p>
                      <p className="text-sm text-gray-600">
                        {order.payment_status === 'paid' ? '✓ Pago completado' : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

