'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']
type Product = Database['public']['Tables']['products']['Row']
type ProductAttribute = Database['public']['Tables']['product_attributes']['Row']
type ProductImage = Database['public']['Tables']['product_images']['Row']
type Review = Database['public']['Tables']['reviews']['Row']

export type ProductWithRelations = Product & {
  categories: Category | null
  product_images?: ProductImage[]
  product_attributes?: ProductAttribute[]
  reviews?: Review[]
}

export type ReviewWithProfile = Review & {
  profiles: {
    first_name: string | null
    last_name: string | null
  } | null
}

export async function getCategories() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data as Category
}

export async function getFeaturedProducts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return data as ProductWithRelations[]
}

export async function getAllProducts(page = 1, limit = 12) {
  const supabase = await createClient()
  const offset = (page - 1) * limit
  
  const { data, error, count } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `, { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0, totalPages: 0 }
  }

  return {
    products: data as ProductWithRelations[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function getProductsByCategory(categorySlug: string, page = 1, limit = 12) {
  const supabase = await createClient()
  const offset = (page - 1) * limit
  
  // First get the category
  const category = await getCategoryBySlug(categorySlug)
  if (!category) {
    return { products: [], total: 0, totalPages: 0, category: null }
  }

  // Get products for this category and its subcategories
  const { data: subcategories } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', category.id)
    .eq('is_active', true)

  const categoryIds = [category.id, ...(subcategories?.map(c => c.id) || [])]

  const { data, error, count } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `, { count: 'exact' })
    .eq('is_active', true)
    .in('category_id', categoryIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by category:', error)
    return { products: [], total: 0, totalPages: 0, category }
  }

  return {
    products: data as ProductWithRelations[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    category
  }
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        url,
        alt_text,
        sort_order,
        is_primary
      ),
      product_attributes (
        id,
        name,
        value
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  // Get reviews separately with user info
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name
      )
    `)
    .eq('product_id', data.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    ...data,
    reviews: reviews || []
  } as ProductWithRelations & { reviews: ReviewWithProfile[] }
}

export async function searchProducts(query: string, page = 1, limit = 12) {
  const supabase = await createClient()
  const offset = (page - 1) * limit
  
  const searchTerm = `%${query}%`
  
  const { data, error, count } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `, { count: 'exact' })
    .eq('is_active', true)
    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm},tags.cs.{${query}}`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error searching products:', error)
    return { products: [], total: 0, totalPages: 0 }
  }

  // Log search query
  await supabase.from('search_queries').insert({
    query,
    results_count: count || 0
  })

  return {
    products: data as ProductWithRelations[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .neq('id', productId)
    .limit(limit)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return data as ProductWithRelations[]
}

export async function getProductStats() {
  const supabase = await createClient()
  
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .is('parent_id', null)

  return {
    totalProducts: totalProducts || 0,
    totalCategories: totalCategories || 0,
  }
}

