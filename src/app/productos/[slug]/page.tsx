import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getProductBySlug, getRelatedProducts, ReviewWithProfile } from '@/app/actions'
import { ProductGrid } from '@/components/products/product-grid'
import Link from 'next/link'
import { 
  ChevronRight, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Star,
  Package,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

interface ProductDetailPageProps {
  params: {
    slug: string
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

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params
  const productData = await getProductBySlug(resolvedParams.slug)

  if (!productData) {
    notFound()
  }

  const product = productData as typeof productData & { reviews: ReviewWithProfile[] }

  const relatedProducts = product.category_id 
    ? await getRelatedProducts(product.id, product.category_id, 4)
    : []

  const categoryIcon = categoryIcons[product.categories?.slug || ''] || '🔧'
  const stockStatus = product.quantity > 100 ? 'En stock' : product.quantity > 0 ? 'Stock limitado' : 'Agotado'
  const stockColor = product.quantity > 100 ? 'text-green-600' : product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'
  
  // Calculate average rating from reviews
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc: number, review) => acc + review.rating, 0) / product.reviews.length
    : 4.8

  const hasDiscount = product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
  const discountPercentage = hasDiscount 
    ? Math.round((1 - Number(product.price) / Number(product.compare_at_price!)) * 100)
    : 0

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
            {product.categories && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/categorias/${product.categories.slug}`} className="hover:text-brand-600">
                  {product.categories.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl">{categoryIcon}</div>
                </div>
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                    -{discountPercentage}%
                  </div>
                )}
                {product.quantity < 100 && product.quantity > 0 && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                    Stock Limitado
                  </div>
                )}
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-brand-600" />
                  <p className="text-xs font-medium">Calidad Garantizada</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-brand-600" />
                  <p className="text-xs font-medium">Envío Rápido</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Package className="h-8 w-8 mx-auto mb-2 text-brand-600" />
                  <p className="text-xs font-medium">Empaque Seguro</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              {product.categories && (
                <p className="text-sm text-brand-600 font-semibold mb-2">
                  {product.categories.name}
                </p>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({product.reviews?.length || 0} reseñas)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-brand-600">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-500 line-through">
                      ${Number(product.compare_at_price).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Precio por unidad</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.quantity > 0 ? (
                  <CheckCircle2 className={`h-5 w-5 ${stockColor}`} />
                ) : (
                  <AlertTriangle className={`h-5 w-5 ${stockColor}`} />
                )}
                <span className={`font-semibold ${stockColor}`}>
                  {stockStatus}
                </span>
                {product.quantity > 0 && product.quantity <= 100 && (
                  <span className="text-sm text-gray-600">
                    ({product.quantity} disponibles)
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.short_description && (
                <p className="text-lg text-gray-700 mb-6">
                  {product.short_description}
                </p>
              )}

              {/* SKU */}
              <p className="text-sm text-gray-600 mb-6">
                SKU: <span className="font-mono font-semibold">{product.sku}</span>
              </p>

              <Separator className="my-6" />

              {/* Actions */}
              <div className="space-y-3 mb-8">
                <Button 
                  className="w-full h-14 text-lg bg-brand-600 hover:bg-brand-700"
                  disabled={product.quantity === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Agregar al Carrito
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    <Heart className="h-5 w-5 mr-2" />
                    Favoritos
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Share2 className="h-5 w-5 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">
                        Envío disponible
                      </p>
                      <p className="text-blue-700">
                        Envío gratis en pedidos mayores a $500. Entrega en 24-48h en Quito.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b mb-8">
              <h2 className="text-2xl font-bold pb-4">Descripción del Producto</h2>
            </div>
            
            <div className="prose max-w-none mb-12">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Attributes */}
            {product.product_attributes && product.product_attributes.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Especificaciones Técnicas</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {product.product_attributes.map((attr) => (
                        <div key={attr.id} className="grid grid-cols-2 gap-4 p-4">
                          <span className="font-semibold text-gray-900">{attr.name}</span>
                          <span className="text-gray-700">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6">Reseñas de Clientes</h3>
                <div className="space-y-4">
                  {product.reviews.slice(0, 5).map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <h4 className="font-semibold text-gray-900">{review.title}</h4>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.created_at && new Date(review.created_at).toLocaleDateString('es-EC')}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        {review.is_verified_purchase && (
                          <p className="text-sm text-green-600 font-medium">
                            ✓ Compra verificada
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Productos Relacionados</h2>
              <ProductGrid products={relatedProducts} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)
  
  if (!product) {
    return {
      title: 'Producto no encontrado',
    }
  }

  return {
    title: `${product.name} - ACEROMAX`,
    description: product.short_description || product.description,
  }
}

