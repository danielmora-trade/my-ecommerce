'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Package, ChevronRight } from 'lucide-react'

interface OrderCardProps {
  orderNumber: string
  total: number
  createdAt: string
  status: string
  itemCount: number
  onClick: () => void
}

export const OrderCard = ({
  orderNumber,
  total,
  createdAt,
  status,
  itemCount,
  onClick
}: OrderCardProps) => {
  const statusLabels: Record<string, string> = {
    pending: 'En Preparación',
    processing: 'En Proceso',
    shipped: 'Enviado',
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

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-brand-600 group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
              <Package className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                {orderNumber}
              </h3>
              <p className="text-sm text-gray-600">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(createdAt).toLocaleDateString('es-EC', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-600">
              ${Number(total).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || statusColors.pending}`}>
            {statusLabels[status] || status}
          </span>
          
          <span className="text-sm text-brand-600 font-medium group-hover:underline">
            Ver detalles →
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

