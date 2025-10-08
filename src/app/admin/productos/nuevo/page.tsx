import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/product-form'

export const metadata = {
  title: 'Nuevo Producto - Backoffice ACEROMAX',
  description: 'Agregar nuevo producto',
}

export default async function NewProductPage() {
  const supabase = await createClient()

  // Obtener categorías
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name')

  return (
    <ProductForm 
      categories={categories || []} 
      isEditing={false}
    />
  )
}

