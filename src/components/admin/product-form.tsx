'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createProduct, updateProduct } from '@/app/admin/product-actions'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormData {
  id?: string
  name: string
  slug: string
  sku: string
  description: string | null
  short_description: string | null
  price: number
  discount_percentage: number | null
  quantity: number
  weight: number | null
  category_id: string | null
  is_active: boolean
}

interface ProductFormProps {
  product?: ProductFormData
  categories: Category[]
  isEditing?: boolean
}

export const ProductForm = ({ product, categories, isEditing = false }: ProductFormProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    id: product?.id,
    name: product?.name || '',
    slug: product?.slug || '',
    sku: product?.sku || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price || 0,
    discount_percentage: product?.discount_percentage || null,
    quantity: product?.quantity || 0,
    weight: product?.weight || null,
    category_id: product?.category_id || null,
    is_active: product?.is_active ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }))

    // Auto-generar slug desde el nombre
    if (name === 'name' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones
      if (!formData.name || !formData.slug || !formData.sku) {
        toast.error('Por favor completa los campos obligatorios')
        setLoading(false)
        return
      }

      if (formData.price <= 0) {
        toast.error('El precio debe ser mayor a 0')
        setLoading(false)
        return
      }

      const productData = {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        description: formData.description || formData.short_description || '',
        short_description: formData.short_description || undefined,
        price: formData.price,
        discount_percentage: formData.discount_percentage || undefined,
        quantity: formData.quantity,
        weight: formData.weight || undefined,
        category_id: formData.category_id || undefined,
        is_active: formData.is_active,
      }

      let result
      if (isEditing && formData.id) {
        result = await updateProduct(formData.id, productData)
      } else {
        result = await createProduct(productData)
      }

      if (result.success) {
        toast.success(`Producto ${isEditing ? 'actualizado' : 'creado'} exitosamente`)
        router.push('/admin/productos')
        router.refresh()
      } else {
        toast.error(result.error || 'Error al guardar el producto')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error inesperado al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/productos">
            <Button type="button" variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Actualiza la información del producto' : 'Agrega un nuevo producto al catálogo'}
            </p>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 gap-2"
        >
          <Save className="h-5 w-5" />
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </div>

      {/* Formulario */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Tubo de Acero 2 pulgadas"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="tubo-acero-2-pulgadas"
                    required
                    disabled={isEditing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se genera automáticamente desde el nombre
                  </p>
                </div>

                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="ACR-TUB-002"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="short_description">Descripción Corta</Label>
                <Input
                  id="short_description"
                  name="short_description"
                  value={formData.short_description || ''}
                  onChange={handleChange}
                  placeholder="Breve descripción del producto"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción Completa</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="Descripción detallada del producto"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precios e Inventario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discount_percentage">Descuento (%)</Label>
                  <Input
                    id="discount_percentage"
                    name="discount_percentage"
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={formData.discount_percentage || ''}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Cantidad en Stock *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="category_id">Categoría del Producto</Label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id || ''}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="">Sin categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                />
                <Label htmlFor="is_active" className="font-normal">
                  Producto activo (visible en la tienda)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

