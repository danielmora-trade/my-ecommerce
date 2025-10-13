import { Suspense } from 'react'
import { Package, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getAllOrdersAdmin, getOrderStats, type OrderStatus } from '../order-actions'
import { OrdersTable } from '@/components/admin/orders-table'

export const metadata = {
  title: 'Pedidos - Backoffice ACEROMAX',
  description: 'Gestión de pedidos',
}

interface OrdersPageProps {
  searchParams: Promise<{ page?: string; status?: string }>
}

// Componente para las tarjetas de estadísticas
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'text-gray-600'
}: { 
  title: string
  value: number
  icon: React.ElementType
  color?: string
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )
}

// Filtros de estado
const StatusFilters = ({ currentStatus }: { currentStatus?: string }) => {
  const filters = [
    { value: '', label: 'Todos', color: 'border-gray-300' },
    { value: 'pending', label: 'Pendientes', color: 'border-yellow-500' },
    { value: 'processing', label: 'En Preparación', color: 'border-blue-500' },
    { value: 'shipped', label: 'En Reparto', color: 'border-purple-500' },
    { value: 'delivered', label: 'Entregados', color: 'border-green-500' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <a
          key={filter.value}
          href={`/admin/pedidos${filter.value ? `?status=${filter.value}` : ''}`}
          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
            currentStatus === filter.value
              ? `${filter.color} bg-opacity-10`
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {filter.label}
        </a>
      ))}
    </div>
  )
}

// Componente de contenido de pedidos
async function OrdersContent({ page, statusFilter }: { page: number; statusFilter?: OrderStatus }) {
  const { orders, total, totalPages } = await getAllOrdersAdmin(page, 20, statusFilter)

  return (
    <OrdersTable 
      orders={orders} 
      currentPage={page}
      totalPages={totalPages}
      total={total}
      statusFilter={statusFilter}
    />
  )
}

// Skeleton de carga
function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  )
}

// Componente de estadísticas
async function OrderStatsContent() {
  const stats = await getOrderStats()

  if (!stats) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
      <StatCard
        title="Total Pedidos"
        value={stats.total}
        icon={Package}
        color="text-gray-600"
      />
      <StatCard
        title="Pendientes"
        value={stats.pending}
        icon={Clock}
        color="text-yellow-600"
      />
      <StatCard
        title="En Preparación"
        value={stats.processing}
        icon={TrendingUp}
        color="text-blue-600"
      />
      <StatCard
        title="En Reparto"
        value={stats.shipped}
        icon={Truck}
        color="text-purple-600"
      />
      <StatCard
        title="Entregados"
        value={stats.delivered}
        icon={CheckCircle}
        color="text-green-600"
      />
    </div>
  )
}

export default async function OrdersAdminPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const statusFilter = params.status as OrderStatus | undefined

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-2">
          Gestiona los pedidos de los clientes
        </p>
      </div>

      {/* Estadísticas */}
      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <OrderStatsContent />
      </Suspense>

      {/* Filtros */}
      <div className="mb-6">
        <StatusFilters currentStatus={statusFilter} />
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white rounded-lg shadow">
        <Suspense fallback={<OrdersSkeleton />}>
          <OrdersContent page={page} statusFilter={statusFilter} />
        </Suspense>
      </div>
    </div>
  )
}

