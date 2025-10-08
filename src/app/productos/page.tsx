import { Suspense } from 'react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { ProductGrid } from '@/components/products/product-grid'
import { Pagination } from '@/components/products/pagination'
import { getAllProducts } from '@/app/actions'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductsPageProps {
  searchParams: {
    page?: string
  }
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const { products, total, totalPages } = await getAllProducts(page, 12)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Catálogo de Productos
            </h1>
            <p className="text-xl text-gray-300">
              Explora nuestra amplia gama de productos de acero y materiales de construcción
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm">
              <span className="bg-brand-600 px-4 py-2 rounded-full font-semibold">
                {total} productos disponibles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductsLoading />}>
            <ProductGrid products={products} />
          </Suspense>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/productos"
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}

