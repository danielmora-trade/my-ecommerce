'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  Calendar, 
  Truck, 
  Save, 
  Trash2,
  Plus,
  Minus,
  FileText
} from 'lucide-react'
import { 
  updateOrderStatus, 
  updateEstimatedDelivery, 
  updateTrackingNumber,
  updateOrderNotes,
  updateOrderItem,
  removeOrderItem,
  type OrderStatus
} from '@/app/admin/order-actions'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  product_name: string
  product_sku?: string
  quantity: number
  price: number
  total: number
}

interface ShippingAddress {
  full_name: string
  phone: string
  address_line_1: string
  city: string
  state: string
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
  estimated_delivery_date: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  tracking_number: string | null
  notes?: string | null
  user_id: string
  shipping_address: ShippingAddress | null
  order_items: OrderItem[]
}

interface OrderEditModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export const OrderEditModal = ({ order, isOpen, onClose }: OrderEditModalProps) => {
  const [status, setStatus] = useState<OrderStatus>('pending')
  const [estimatedDate, setEstimatedDate] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Reset form cuando cambia el pedido
  useState(() => {
    if (order) {
      setStatus((order.status as OrderStatus) || 'pending')
      setEstimatedDate(order.estimated_delivery_date ? order.estimated_delivery_date.split('T')[0] : '')
      setTrackingNumber(order.tracking_number || '')
      setNotes(order.notes || '')
    }
  })

  if (!order) return null

  const handleSaveChanges = async () => {
    setSaving(true)

    try {
      // Actualizar estado
      if (status !== order.status) {
        const result = await updateOrderStatus(order.id, status)
        if (!result.success) {
          toast.error(result.error || 'Error al actualizar el estado')
          setSaving(false)
          return
        }
      }

      // Actualizar fecha estimada
      if (estimatedDate !== order.estimated_delivery_date?.split('T')[0]) {
        const result = await updateEstimatedDelivery(
          order.id, 
          estimatedDate ? new Date(estimatedDate).toISOString() : null
        )
        if (!result.success) {
          toast.error(result.error || 'Error al actualizar la fecha')
        }
      }

      // Actualizar tracking
      if (trackingNumber !== order.tracking_number) {
        const result = await updateTrackingNumber(order.id, trackingNumber)
        if (!result.success) {
          toast.error(result.error || 'Error al actualizar el tracking')
        }
      }

      // Actualizar notas
      if (notes !== order.notes) {
        const result = await updateOrderNotes(order.id, notes)
        if (!result.success) {
          toast.error(result.error || 'Error al actualizar las notas')
        }
      }

      toast.success('Pedido actualizado exitosamente')
      onClose()
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Error inesperado al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateItemQuantity = async (itemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta
    if (newQty < 1) return

    const result = await updateOrderItem(itemId, newQty)
    if (result.success) {
      toast.success('Cantidad actualizada')
      onClose()
    } else {
      toast.error(result.error || 'Error al actualizar cantidad')
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto del pedido?')) return

    const result = await removeOrderItem(itemId)
    if (result.success) {
      toast.success('Producto eliminado')
      onClose()
    } else {
      toast.error(result.error || 'Error al eliminar producto')
    }
  }

  const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-500' },
    { value: 'processing', label: 'En Preparación', color: 'bg-blue-500' },
    { value: 'shipped', label: 'En Reparto', color: 'bg-purple-500' },
    { value: 'delivered', label: 'Entregado', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-500' },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Package className="h-6 w-6 text-brand-600" />
            Editar Pedido {order.order_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Estado del Pedido */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Estado del Pedido</h3>
              <div className="grid grid-cols-5 gap-3">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatus(option.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      status === option.value
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-3 w-3 rounded-full ${option.color}`} />
                    <span className="text-xs font-medium text-center">{option.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fechas y Tracking */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-600" />
                Información de Envío
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimated_date">Fecha Estimada de Entrega</Label>
                  <Input
                    id="estimated_date"
                    type="date"
                    value={estimatedDate}
                    onChange={(e) => setEstimatedDate(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esta fecha se mostrará al cliente
                  </p>
                </div>

                <div>
                  <Label htmlFor="tracking">
                    <Truck className="h-4 w-4 inline mr-1" />
                    Número de Seguimiento
                  </Label>
                  <Input
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ej: TRACK123456"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productos del Pedido */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Productos del Pedido</h3>
              
              <div className="space-y-3">
                {order.order_items?.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      {item.product_sku && (
                        <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        ${Number(item.price).toFixed(2)} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateItemQuantity(item.id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateItemQuantity(item.id, item.quantity, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${Number(item.total).toFixed(2)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

          {/* Notas */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-600" />
                Notas Internas
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="Agrega notas internas sobre este pedido..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Estas notas son solo visibles para el equipo administrativo
              </p>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


