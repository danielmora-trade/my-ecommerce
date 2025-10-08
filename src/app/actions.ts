'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']
type Product = Database['public']['Tables']['products']['Row']

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

  return data as (Product & { categories: Category | null })[]
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

