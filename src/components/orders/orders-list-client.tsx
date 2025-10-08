'use client'

import { useState } from 'react'
import { OrderCard } from './order-card'
import { OrderDetailsModal } from './order-details-modal'

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

interface OrdersListClientProps {
  orders: Order[]
}

export const OrdersListClient = ({ orders }: OrdersListClientProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedOrder(null), 300)
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            orderNumber={order.order_number}
            total={order.total}
            createdAt={order.created_at}
            status={order.status}
            itemCount={order.order_items?.length || 0}
            onClick={() => handleOrderClick(order)}
          />
        ))}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}

