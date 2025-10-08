'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Power, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleProductStatus } from '@/app/admin/product-actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  discount_percentage: number | null
  quantity: number
  is_active: boolean
  created_at: string
  categories?: {
    name: string
  }
}

interface ProductsTableProps {
  products: Product[]
  currentPage: number
  totalPages: number
  total: number
}

export const ProductsTable = ({ products, currentPage, totalPages, total }: ProductsTableProps) => {
  const router = useRouter()
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    setTogglingId(productId)
    
    const result = await toggleProductStatus(productId, !currentStatus)
    
    if (result.success) {
      toast.success(`Producto ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`)
      router.refresh()
    } else {
      toast.error(result.error || 'Error al cambiar el estado del producto')
    }
    
    setTogglingId(null)
  }

  const getFinalPrice = (price: number, discount: number | null) => {
    if (!discount) return price
    return price - (price * discount / 100)
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          {/* Encabezado de la tabla */}
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Producto</div>
              <div className="col-span-2">Categoría</div>
              <div className="col-span-1">SKU</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-2">Precio</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>
          </div>

          {/* Cuerpo de la tabla */}
          <div className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No hay productos para mostrar</p>
                <Link href="/admin/productos/nuevo" className="mt-4 inline-block">
                  <Button className="bg-brand-600 hover:bg-brand-700">
                    Agregar primer producto
                  </Button>
                </Link>
              </div>
            ) : (
              products.map((product) => {
                const finalPrice = getFinalPrice(product.price, product.discount_percentage)
                const hasDiscount = product.discount_percentage && product.discount_percentage > 0

                return (
                  <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Producto */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center text-xl">
                            🔩
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Categoría */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600">
                          {product.categories?.name || 'Sin categoría'}
                        </span>
                      </div>

                      {/* SKU */}
                      <div className="col-span-1">
                        <span className="text-sm font-mono text-gray-600">
                          {product.sku}
                        </span>
                      </div>

                      {/* Stock */}
                      <div className="col-span-1">
                        <span className={`text-sm font-medium ${
                          product.quantity === 0 
                            ? 'text-red-600' 
                            : product.quantity < 10 
                            ? 'text-yellow-600' 
                            : 'text-green-600'
                        }`}>
                          {product.quantity}
                        </span>
                      </div>

                      {/* Precio */}
                      <div className="col-span-2">
                        {hasDiscount ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              ${finalPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-xs font-medium text-green-600">
                              -{product.discount_percentage}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Estado */}
                      <div className="col-span-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      {/* Acciones */}
                      <div className="col-span-2 flex justify-end gap-2">
                        <Link href={`/productos/${product.sku}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Ver en tienda"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Link href={`/admin/productos/${product.id}/editar`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleToggleStatus(product.id, product.is_active)}
                          disabled={togglingId === product.id}
                          title={product.is_active ? 'Desactivar' : 'Activar'}
                        >
                          <Power className={`h-4 w-4 ${
                            product.is_active ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 border-t flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, total)} de {total} productos
              </div>
              
              <div className="flex gap-2">
                <Link href={`/admin/productos?page=${currentPage - 1}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                </Link>
                
                <Link href={`/admin/productos?page=${currentPage + 1}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

