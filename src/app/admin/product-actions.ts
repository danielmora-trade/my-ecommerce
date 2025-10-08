'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isAdminOrManager } from './auth-actions'
import { Database } from '@/types/database.types'

type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

// Obtener todos los productos (para admin)
export async function getAllProductsAdmin(page = 1, limit = 20) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { products: [], total: 0, totalPages: 0 }
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  // Obtener total de productos
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // Obtener productos con paginación
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      sellers (
        id,
        business_name
      )
    `)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0, totalPages: 0 }
  }

  return {
    products: products || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

// Obtener un producto por ID
export async function getProductById(productId: string) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return null
  }

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('id', productId)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return product
}

// Crear un nuevo producto
export async function createProduct(productData: Omit<ProductInsert, 'id' | 'created_at' | 'updated_at' | 'seller_id'>) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para crear productos' }
  }

  // Obtener o crear un seller por defecto (sistema)
  const { data: seller } = await supabase
    .from('sellers')
    .select('id')
    .limit(1)
    .single()

  if (!seller) {
    return { success: false, error: 'No hay vendedores configurados en el sistema' }
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      seller_id: seller.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Error al crear el producto' }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  
  return { success: true, data }
}

// Actualizar un producto
export async function updateProduct(productId: string, productData: ProductUpdate) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para actualizar productos' }
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      ...productData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Error al actualizar el producto' }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  revalidatePath(`/productos/${data.slug}`)
  
  return { success: true, data }
}

// Deshabilitar/habilitar un producto
export async function toggleProductStatus(productId: string, isActive: boolean) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para cambiar el estado de productos' }
  }

  const { error } = await supabase
    .from('products')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)

  if (error) {
    console.error('Error toggling product status:', error)
    return { success: false, error: 'Error al cambiar el estado del producto' }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/productos')
  
  return { success: true }
}

// Eliminar un producto (soft delete - deshabilitar)
export async function deleteProduct(productId: string) {
  return toggleProductStatus(productId, false)
}

// Buscar productos
export async function searchProductsAdmin(query: string) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return []
  }

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .or(`name.ilike.%${query}%,sku.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }

  return products || []
}

// Obtener estadísticas de productos
export async function getProductStats() {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return null
  }

  // Total de productos
  const { count: total } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // Productos activos
  const { count: active } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Productos con bajo stock
  const { count: lowStock } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .lt('quantity', 10)
    .eq('is_active', true)

  // Productos sin stock
  const { count: outOfStock } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('quantity', 0)

  return {
    total: total || 0,
    active: active || 0,
    inactive: (total || 0) - (active || 0),
    lowStock: lowStock || 0,
    outOfStock: outOfStock || 0,
  }
}

