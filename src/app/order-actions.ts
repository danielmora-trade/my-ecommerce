'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCartItems, clearCart } from './cart-actions'

interface CreateOrderParams {
  shipping_address_id: string
  billing_address_id: string
  payment_method: 'cash_on_delivery' | 'credit_card'
  payment_method_id?: string
  notes?: string
}

// Generar número de orden único
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ACR-${timestamp}-${random}`
}

// Crear pedido
export async function createOrder(params: CreateOrderParams) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' }
  }

  // Obtener items del carrito
  const cartItems = await getCartItems()
  
  if (cartItems.length === 0) {
    return { success: false, error: 'El carrito está vacío' }
  }

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (Number(item.price) * item.quantity)
  }, 0)

  const tax = subtotal * 0.12 // 12% IVA Ecuador
  const shipping_cost = 0 // Envío gratuito por ahora
  const total = subtotal + tax + shipping_cost

  // Generar número de orden
  const order_number = generateOrderNumber()

  try {
    // Crear el pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number,
        user_id: user.id,
        status: 'pending',
        payment_status: params.payment_method === 'cash_on_delivery' ? 'pending' : 'paid',
        subtotal,
        tax,
        shipping_cost,
        discount_amount: 0,
        total,
        currency: 'USD',
        shipping_address_id: params.shipping_address_id,
        billing_address_id: params.billing_address_id,
        shipping_method: 'delivery',
        notes: params.notes || null,
        metadata: {
          payment_method: params.payment_method,
          payment_method_id: params.payment_method_id || null,
        },
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return { success: false, error: 'Error al crear el pedido' }
    }

    // Obtener el seller_id del primer producto (asumiendo que todos son del mismo vendedor)
    const { data: firstProduct } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', cartItems[0].product_id)
      .single()

    if (!firstProduct) {
      return { success: false, error: 'Error al obtener información del producto' }
    }

    // Crear los order_items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      seller_id: firstProduct.seller_id,
      product_name: item.products?.name || '',
      product_sku: item.products?.sku || '',
      quantity: item.quantity,
      price: Number(item.price),
      tax: Number(item.price) * 0.12,
      discount_amount: 0,
      total: Number(item.price) * item.quantity,
      status: 'pending',
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Revertir la orden si falla la creación de items
      await supabase.from('orders').delete().eq('id', order.id)
      return { success: false, error: 'Error al crear los items del pedido' }
    }

    // Crear registro de pago (si es pago con tarjeta)
    if (params.payment_method === 'credit_card' && params.payment_method_id) {
      await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          user_id: user.id,
          payment_method: 'credit_card',
          payment_provider: 'manual', // Por ahora es manual, sin pasarela real
          transaction_id: `TXN-${order_number}`,
          amount: total,
          currency: 'USD',
          status: 'completed',
          metadata: {
            payment_method_id: params.payment_method_id,
          },
        })
    }

    // Limpiar el carrito
    await clearCart()

    revalidatePath('/carrito')
    revalidatePath('/checkout')
    
    return { 
      success: true, 
      order: {
        id: order.id,
        order_number: order.order_number,
        total: order.total,
        status: order.status,
      }
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Error inesperado al crear el pedido' }
  }
}

// Obtener pedido por número
export async function getOrderByNumber(orderNumber: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      shipping_address:addresses!orders_shipping_address_id_fkey(*),
      order_items(
        *,
        products(name, slug, sku)
      )
    `)
    .eq('order_number', orderNumber)
    .eq('user_id', user.id)
    .single()

  return order
}

// Obtener todos los pedidos del usuario
export async function getUserOrders() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      subtotal,
      tax,
      shipping_cost,
      total,
      created_at,
      shipping_method,
      metadata,
      shipping_address:addresses!orders_shipping_address_id_fkey(
        full_name,
        phone,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country
      ),
      order_items(
        id,
        product_name,
        product_sku,
        quantity,
        price,
        total
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return orders
}

