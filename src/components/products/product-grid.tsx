import { ProductCard } from './product-card'
import { ProductWithRelations } from '@/app/actions'

interface ProductGridProps {
  products: ProductWithRelations[]
  categoryIcons?: Record<string, string>
}

const defaultCategoryIcons: Record<string, string> = {
  'varillas': '🔩',
  'perfiles': '📐',
  'vigas': '🏗️',
  'laminas': '📋',
  'tubos': '⚙️',
  'mallas': '🔲',
  'alambres': '🧵',
  'accesorios': '🔧',
}

export const ProductGrid = ({ products, categoryIcons = defaultCategoryIcons }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No se encontraron productos
        </h3>
        <p className="text-gray-600">
          Intenta con otra búsqueda o categoría
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryIcon={categoryIcons[product.categories?.slug || ''] || '🔧'}
        />
      ))}
    </div>
  )
}

