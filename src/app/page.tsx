import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  Clock, 
  Phone, 
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle2
} from 'lucide-react'
import { getCategories, getFeaturedProducts, getProductStats } from './actions'

// Mapeo de iconos para categorías
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

const categoryColors: Record<string, string> = {
  'varillas': 'from-red-500 to-red-600',
  'perfiles': 'from-blue-500 to-blue-600',
  'vigas': 'from-green-500 to-green-600',
  'laminas': 'from-purple-500 to-purple-600',
  'tubos': 'from-orange-500 to-orange-600',
  'mallas': 'from-cyan-500 to-cyan-600',
  'alambres': 'from-pink-500 to-pink-600',
  'accesorios': 'from-indigo-500 to-indigo-600',
}

export default async function Home() {
  // Obtener datos dinámicamente desde Supabase
  const categories = await getCategories()
  const featuredProducts = await getFeaturedProducts()
  const stats = await getProductStats()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-block px-4 py-2 bg-brand-600/20 border border-brand-600/30 rounded-full text-brand-400 text-sm font-medium mb-6">
                🏗️ Materiales de Construcción Profesional
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Aceros de Alta Calidad para tus
                <span className="text-brand-500 block">Proyectos Industriales</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Distribuidor líder en Ecuador. Varillas, perfiles, vigas, láminas y más. 
                Entrega rápida, precios competitivos y asesoría técnica especializada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 shadow-xl">
                  Ver Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                  <Phone className="mr-2 h-5 w-5" />
                  Cotizar Ahora
                </Button>
              </div>
              
              {/* Trust badges - Dinámicos */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-500 mb-1">25+</div>
                  <div className="text-sm text-gray-400">Años de Experiencia</div>
                </div>
                <div className="text-center border-x border-gray-700">
                  <div className="text-3xl font-bold text-brand-500 mb-1">{stats.totalProducts}+</div>
                  <div className="text-sm text-gray-400">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-500 mb-1">98%</div>
                  <div className="text-sm text-gray-400">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden md:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-brand-600/30 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-8xl mb-4">🏗️</div>
                    <p className="text-2xl font-bold">Aceros de Calidad</p>
                    <p className="text-gray-400 mt-2">Para construcción profesional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - DINÁMICO */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categorías de Productos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Amplio stock de aceros y materiales para construcción
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => {
              const icon = categoryIcons[category.slug] || '🔧'
              const color = categoryColors[category.slug] || 'from-gray-500 to-gray-600'
              
              return (
                <Link key={category.id} href={`/categorias/${category.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-brand-600 h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}>
                        {icon}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products - DINÁMICO */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Productos Destacados
              </h2>
              <p className="text-gray-600">Los más vendidos de la semana</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              // Calcular rating promedio (placeholder por ahora)
              const rating = 4.8
              const stockStatus = product.quantity < 100 ? 'Limitado' : 'En stock'
              
              return (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-brand-600">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {categoryIcons[product.categories?.slug || ''] || '🔩'}
                      </div>
                      {stockStatus === 'Limitado' && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Stock Limitado
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white font-semibold text-sm">{rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-brand-600">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                          <span className="text-sm text-gray-500 line-through">
                            ${Number(product.compare_at_price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button className="w-full bg-brand-600 hover:bg-brand-700">
                        Agregar al Carrito
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay productos destacados disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Envíos Rápidos</h3>
              <p className="text-gray-600 text-sm">
                Entrega en 24-48h en Quito y hasta 5 días a nivel nacional
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600 text-sm">
                Productos certificados con garantía de calidad y certificados de origen
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">25+ Años</h3>
              <p className="text-gray-600 text-sm">
                Experiencia en el mercado ecuatoriano de aceros y construcción
              </p>
            </div>

        <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Asesoría 24/7</h3>
              <p className="text-gray-600 text-sm">
                Equipo técnico disponible para ayudarte con tu proyecto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="h-16 w-16 mx-auto mb-6 text-brand-500" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              ¿Necesitas una Cotización para tu Proyecto?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Nuestro equipo de expertos te ayudará a encontrar los materiales perfectos 
              para tu construcción. Cotizaciones rápidas y personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-lg px-8">
                <Phone className="mr-2 h-5 w-5" />
                Solicitar Cotización
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                Ver Catálogo Completo
              </Button>
            </div>

            {/* Features list */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-700">
              {[
                'Precios competitivos al por mayor',
                'Asesoría técnica especializada',
                'Entrega a obra disponible'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 justify-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
        </div>
      </div>
      </section>

      <Footer />
    </div>
  )
}
