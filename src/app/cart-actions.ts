'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

type CartItem = Database['public']['Tables']['cart_items']['Row']

export interface CartItemWithProduct extends CartItem {
  products: {
    id: string
    name: string
    slug: string
    price: number
    quantity: number
    sku: string
    categories: {
      name: string
      slug: string
    } | null
  }
}

// Obtener o crear carrito del usuario
export async function getOrCreateCart() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Buscar carrito existente (obtener el más reciente si hay múltiples)
  const { data: carts } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  // Si existe, usar el más reciente
  if (carts && carts.length > 0) {
    return carts[0]
  }

  // Si no existe, crear uno
  const { data: newCart, error: insertError } = await supabase
    .from('carts')
    .insert({ user_id: user.id })
    .select()
    .single()

  if (insertError) {
    console.error('Error creating cart:', insertError)
    return null
  }
  
  return newCart
}

// Obtener items del carrito con información de productos
export async function getCartItems() {
  const supabase = await createClient()
  
  const cart = await getOrCreateCart()
  
  if (!cart) {
    return []
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products (
        id,
        name,
        slug,
        price,
        quantity,
        sku,
        categories (
          name,
          slug
        )
      )
    `)
    .eq('cart_id', cart.id)

  if (error) {
    console.error('Error fetching cart items:', error)
    return []
  }

  return data as CartItemWithProduct[]
}

// Obtener cantidad total de items en el carrito
export async function getCartCount() {
  const supabase = await createClient()
  
  const cart = await getOrCreateCart()
  
  if (!cart) {
    return 0
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('cart_id', cart.id)

  if (error) {
    console.error('Error fetching cart count:', error)
    return 0
  }

  return data.reduce((total, item) => total + item.quantity, 0)
}

// Agregar producto al carrito
export async function addToCart(productId: string, quantity: number = 1) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' }
  }

  const cart = await getOrCreateCart()
  
  if (!cart) {
    return { success: false, error: 'No se pudo crear el carrito' }
  }

  // Obtener información del producto
  const { data: product } = await supabase
    .from('products')
    .select('price, quantity')
    .eq('id', productId)
    .single()

  if (!product) {
    return { success: false, error: 'Producto no encontrado' }
  }

  // Verificar si el producto ya está en el carrito
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .single()

  if (existingItem) {
    // Actualizar cantidad
    const newQuantity = existingItem.quantity + quantity
    
    // Verificar stock
    if (newQuantity > product.quantity) {
      return { success: false, error: 'No hay suficiente stock disponible' }
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingItem.id)

    if (error) {
      console.error('Error updating cart item:', error)
      return { success: false, error: 'Error al actualizar el carrito' }
    }
  } else {
    // Verificar stock
    if (quantity > product.quantity) {
      return { success: false, error: 'No hay suficiente stock disponible' }
    }

    // Agregar nuevo item
    const { error } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        price: product.price
      })

    if (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error: 'Error al agregar al carrito' }
    }
  }

  revalidatePath('/carrito')
  revalidatePath('/', 'layout')
  
  return { success: true }
}

// Actualizar cantidad de un item
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = await createClient()
  
  if (quantity < 1) {
    return { success: false, error: 'La cantidad debe ser al menos 1' }
  }

  // Obtener el item para verificar stock
  const { data: item } = await supabase
    .from('cart_items')
    .select('*, products(quantity)')
    .eq('id', itemId)
    .single()

  if (!item) {
    return { success: false, error: 'Item no encontrado' }
  }

  const product = item.products as { quantity: number }
  if (quantity > product.quantity) {
    return { success: false, error: 'No hay suficiente stock disponible' }
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', itemId)

  if (error) {
    console.error('Error updating cart item:', error)
    return { success: false, error: 'Error al actualizar cantidad' }
  }

  revalidatePath('/carrito')
  revalidatePath('/', 'layout')
  
  return { success: true }
}

// Eliminar item del carrito
export async function removeFromCart(itemId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: 'Error al eliminar del carrito' }
  }

  revalidatePath('/carrito')
  revalidatePath('/', 'layout')
  
  return { success: true }
}

// Vaciar carrito
export async function clearCart() {
  const supabase = await createClient()
  
  const cart = await getOrCreateCart()
  if (!cart) {
    return { success: false, error: 'No se encontró el carrito' }
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id)

  if (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: 'Error al vaciar el carrito' }
  }

  revalidatePath('/carrito')
  revalidatePath('/', 'layout')
  
  return { success: true }
}

// Obtener resumen del carrito
export async function getCartSummary() {
  const items = await getCartItems()
  
  const subtotal = items.reduce((total, item) => {
    return total + (Number(item.price) * item.quantity)
  }, 0)

  const tax = subtotal * 0.12 // 12% IVA Ecuador
  const total = subtotal + tax

  return {
    items,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotal,
    tax,
    total
  }
}

