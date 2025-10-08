import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAllProductsAdmin } from '../product-actions'
import { ProductsTable } from '@/components/admin/products-table'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Productos - Backoffice ACEROMAX',
  description: 'Gestión de productos',
}

interface ProductsPageProps {
  searchParams: Promise<{ page?: string }>
}

async function ProductsContent({ page }: { page: number }) {
  const { products, total, totalPages } = await getAllProductsAdmin(page, 20)

  return (
    <ProductsTable 
      products={products} 
      currentPage={page}
      totalPages={totalPages}
      total={total}
    />
  )
}

function ProductsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default async function ProductsAdminPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona el catálogo de productos
          </p>
        </div>
        
        <Link href="/admin/productos/nuevo">
          <Button className="bg-brand-600 hover:bg-brand-700 gap-2">
            <Plus className="h-5 w-5" />
            Agregar Producto
          </Button>
        </Link>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsContent page={page} />
        </Suspense>
      </div>
    </div>
  )
}

