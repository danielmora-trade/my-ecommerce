import { Suspense } from 'react'
import { Package, ShoppingCart, AlertCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProductStats } from './product-actions'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Dashboard - Backoffice ACEROMAX',
  description: 'Panel de administración',
}

// Componente para las tarjetas de estadísticas
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend 
}: { 
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  trend?: string
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
        {trend && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Componente de contenido del dashboard
async function DashboardContent() {
  const stats = await getProductStats()

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
      </div>
    )
  }

  return (
    <>
      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Productos"
          value={stats.total}
          icon={Package}
          description={`${stats.active} activos, ${stats.inactive} inactivos`}
        />
        
        <StatCard
          title="Productos Activos"
          value={stats.active}
          icon={Package}
          description="Disponibles para venta"
        />
        
        <StatCard
          title="Stock Bajo"
          value={stats.lowStock}
          icon={AlertCircle}
          description="Productos con menos de 10 unidades"
        />
        
        <StatCard
          title="Sin Stock"
          value={stats.outOfStock}
          icon={ShoppingCart}
          description="Productos agotados"
        />
      </div>

      {/* Acciones rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-brand-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-600">
              <Package className="h-5 w-5" />
              Gestionar Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Agrega, edita o deshabilita productos del catálogo
            </p>
            <a 
              href="/admin/productos" 
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Ir a productos →
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <ShoppingCart className="h-5 w-5" />
              Ver Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Revisa y gestiona los pedidos de los clientes
            </p>
            <a 
              href="/admin/pedidos" 
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Ir a pedidos →
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Analiza el rendimiento de tu negocio
            </p>
            <a 
              href="/admin/estadisticas" 
              className="text-sm font-medium text-green-600 hover:underline"
            >
              Ver estadísticas →
            </a>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Skeleton de carga
function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Resumen general de tu negocio
        </p>
      </div>

      {/* Contenido con Suspense */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

