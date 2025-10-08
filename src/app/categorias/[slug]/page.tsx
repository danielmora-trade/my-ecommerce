import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { ProductGrid } from '@/components/products/product-grid'
import { Pagination } from '@/components/products/pagination'
import { getProductsByCategory } from '@/app/actions'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

const categoryIcons: Record<string, string> = {
  'varillas': '🔩',
  'perfiles': '📐',
  'vigas': '🏗️',
  'laminas': '📋',
  'tubos': '⚙️',
  'mallas': '🔲',
  'alambres': '🧵',
  'accesorios': '🔧',
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const { products, total, totalPages, category } = await getProductsByCategory(resolvedParams.slug, page, 12)

  if (!category) {
    notFound()
  }

  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const categoryIcon = categoryIcons[category.slug] || '🔧'

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand-600">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/productos" className="hover:text-brand-600">
              Productos
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="text-8xl hidden md:block">{categoryIcon}</div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl text-gray-300 mb-6">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-brand-600 px-4 py-2 rounded-full font-semibold">
                  {total} productos disponibles
                </span>
              </div>
            </div>
          </div>
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
            baseUrl={`/categorias/${resolvedParams.slug}`}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const { category } = await getProductsByCategory(resolvedParams.slug, 1, 1)
  
  if (!category) {
    return {
      title: 'Categoría no encontrada',
    }
  }

  return {
    title: `${category.name} - ACEROMAX`,
    description: category.description || `Productos de ${category.name}`,
  }
}

