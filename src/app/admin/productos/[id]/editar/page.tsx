import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/product-form'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Editar Producto - Backoffice ACEROMAX',
  description: 'Editar producto',
}

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Obtener producto
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  // Obtener categorías
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name')

  return (
    <ProductForm 
      product={product}
      categories={categories || []} 
      isEditing={true}
    />
  )
}

