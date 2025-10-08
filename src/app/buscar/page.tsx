import { Suspense } from 'react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { ProductGrid } from '@/components/products/product-grid'
import { Pagination } from '@/components/products/pagination'
import { searchProducts } from '@/app/actions'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/server'
import { Search } from 'lucide-react'

interface SearchPageProps {
  searchParams: {
    q?: string
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const page = Number(params.page) || 1

  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!query) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <Search className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Buscar Productos
            </h1>
            <p className="text-gray-600">
              Utiliza la barra de búsqueda arriba para encontrar productos
            </p>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  const { products, total, totalPages } = await searchProducts(query, page, 12)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Results Header */}
      <section className="bg-gray-50 border-b py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Resultados de búsqueda
            </h1>
          </div>
          <p className="text-gray-600">
            {total > 0 ? (
              <>
                Se encontraron <span className="font-semibold text-brand-600">{total}</span> resultado{total !== 1 ? 's' : ''} para &ldquo;<span className="font-semibold">{query}</span>&rdquo;
              </>
            ) : (
              <>
                No se encontraron resultados para &ldquo;<span className="font-semibold">{query}</span>&rdquo;
              </>
            )}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductsLoading />}>
            <ProductGrid products={products} isAuthenticated={!!user} />
          </Suspense>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/buscar?q=${encodeURIComponent(query)}`}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  
  if (!query) {
    return {
      title: 'Buscar Productos - ACEROMAX',
    }
  }

  return {
    title: `Buscar: ${query} - ACEROMAX`,
    description: `Resultados de búsqueda para ${query}`,
  }
}

