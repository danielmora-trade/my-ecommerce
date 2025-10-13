'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Eye, ChevronLeft, ChevronRight, Calendar, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { OrderEditModal } from './order-edit-modal'

interface OrderItem {
  id: string
  product_name: string
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
  user_id: string
  shipping_address: ShippingAddress | null
  order_items: OrderItem[]
}

interface OrdersTableProps {
  orders: Order[]
  currentPage: number
  totalPages: number
  total: number
  statusFilter?: string
}

export const OrdersTable = ({ orders, currentPage, totalPages, total, statusFilter }: OrdersTableProps) => {
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedOrder(null), 300)
    router.refresh()
  }

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'En Preparación',
    shipped: 'En Reparto',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  const getCustomerName = (order: Order) => {
    return order.shipping_address?.full_name || 'Cliente'
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            {/* Encabezado de la tabla */}
            <div className="bg-gray-50 px-6 py-3 border-b">
              <div className="grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-2">Pedido</div>
                <div className="col-span-2">Cliente</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-1">Items</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-1 text-right">Acciones</div>
              </div>
            </div>

            {/* Cuerpo de la tabla */}
            <div className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay pedidos para mostrar</p>
                  {statusFilter && (
                    <p className="text-sm text-gray-400 mt-2">
                      Intenta cambiar el filtro de estado
                    </p>
                  )}
                </div>
              ) : (
                orders.map((order) => {
                  const itemCount = order.order_items?.length || 0
                  const customerName = getCustomerName(order)

                  return (
                    <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Pedido */}
                        <div className="col-span-2">
                          <p className="font-mono text-sm font-bold text-brand-600">
                            {order.order_number}
                          </p>
                          {order.tracking_number && (
                            <p className="text-xs text-gray-500 mt-1">
                              Track: {order.tracking_number}
                            </p>
                          )}
                        </div>

                        {/* Cliente */}
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-gray-900">
                            {customerName}
                          </p>
                          {order.shipping_address && (
                            <p className="text-xs text-gray-500">
                              {order.shipping_address.city}
                            </p>
                          )}
                        </div>

                        {/* Fecha */}
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {new Date(order.created_at).toLocaleDateString('es-EC', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          {order.estimated_delivery_date && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                              <Calendar className="h-3 w-3" />
                              Estim: {new Date(order.estimated_delivery_date).toLocaleDateString('es-EC', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          )}
                        </div>

                        {/* Items */}
                        <div className="col-span-1">
                          <span className="text-sm font-medium text-gray-900">
                            {itemCount}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>

                        {/* Total */}
                        <div className="col-span-2">
                          <span className="text-sm font-bold text-gray-900">
                            ${Number(order.total).toFixed(2)}
                          </span>
                        </div>

                        {/* Estado */}
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            statusColors[order.status] || statusColors.pending
                          }`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>

                        {/* Acciones */}
                        <div className="col-span-1 flex justify-end gap-2">
                          <Link href={`/orden-confirmada/${order.order_number}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Ver pedido"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditOrder(order)}
                            title="Editar pedido"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 border-t flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, total)} de {total} pedidos
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/admin/pedidos?page=${currentPage - 1}${statusFilter ? `&status=${statusFilter}` : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                  </Link>
                  
                  <Link href={`/admin/pedidos?page=${currentPage + 1}${statusFilter ? `&status=${statusFilter}` : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <OrderEditModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}

