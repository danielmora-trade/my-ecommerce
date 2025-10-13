'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isAdminOrManager } from './auth-actions'

export type OrderStatus = 
  | 'pending'      // Pendiente
  | 'processing'   // En preparación
  | 'shipped'      // En reparto/enviado
  | 'delivered'    // Entregado
  | 'cancelled'    // Cancelado
  | 'refunded'     // Reembolsado

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

interface OrderWithDetails {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: number
  tax: number
  shipping_cost: number
  total: number
  created_at: string
  estimated_delivery_date: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  tracking_number: string | null
  notes: string | null
  user_id: string
  user_email: string | null
  user_profile: {
    first_name: string | null
    last_name: string | null
  } | null
  shipping_address: {
    full_name: string
    phone: string
    address_line_1: string
    city: string
    state: string
  } | null
  order_items: {
    id: string
    product_name: string
    product_sku?: string
    quantity: number
    price: number
    total: number
  }[]
}

// Obtener todos los pedidos para admin
export async function getAllOrdersAdmin(page = 1, limit = 20, statusFilter?: OrderStatus) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { orders: [], total: 0, totalPages: 0 }
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  // Construir query
  let query = supabase
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
      estimated_delivery_date,
      shipped_at,
      delivered_at,
      cancelled_at,
      tracking_number,
      notes,
      user_id,
      shipping_address:addresses!orders_shipping_address_id_fkey(
        full_name,
        phone,
        address_line_1,
        city,
        state
      ),
      order_items(
        id,
        product_name,
        product_sku,
        quantity,
        price,
        total
      )
    `, { count: 'exact' })

  // Aplicar filtro de estado si existe
  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  // Ordenar y paginar
  const { data: orders, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching orders:', error)
    return { orders: [], total: 0, totalPages: 0 }
  }

  // Obtener los emails de los usuarios usando la función RPC
  const ordersWithEmails = await Promise.all(
    (orders || []).map(async (order) => {
      const { data: email } = await supabase.rpc('get_user_email', { 
        user_id: order.user_id 
      })
      
      return {
        ...order,
        user_email: email || null,
        user_profile: null, // Por ahora null, podríamos agregarlo después
      }
    })
  )

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orders: ordersWithEmails as any as OrderWithDetails[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

// Obtener un pedido por ID
export async function getOrderByIdAdmin(orderId: string) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return null
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      shipping_address:addresses!orders_shipping_address_id_fkey(*),
      billing_address:addresses!orders_billing_address_id_fkey(*),
      order_items(*),
      profiles(
        first_name,
        last_name,
        email
      )
    `)
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return order
}

// Actualizar estado del pedido
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para actualizar pedidos' }
  }

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  // Actualizar timestamps según el estado
  if (status === 'shipped' && !updateData.shipped_at) {
    updateData.shipped_at = new Date().toISOString()
  } else if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString()
  } else if (status === 'cancelled') {
    updateData.cancelled_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Error al actualizar el estado del pedido' }
  }

  revalidatePath('/admin/pedidos')
  revalidatePath('/pedidos')
  
  return { success: true }
}

// Actualizar fecha estimada de entrega
export async function updateEstimatedDelivery(orderId: string, estimatedDate: string | null) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para actualizar pedidos' }
  }

  const { error } = await supabase
    .from('orders')
    .update({
      estimated_delivery_date: estimatedDate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating estimated delivery:', error)
    return { success: false, error: 'Error al actualizar la fecha estimada' }
  }

  revalidatePath('/admin/pedidos')
  
  return { success: true }
}

// Actualizar número de seguimiento
export async function updateTrackingNumber(orderId: string, trackingNumber: string) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para actualizar pedidos' }
  }

  const { error } = await supabase
    .from('orders')
    .update({
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating tracking number:', error)
    return { success: false, error: 'Error al actualizar el número de seguimiento' }
  }

  revalidatePath('/admin/pedidos')
  
  return { success: true }
}

// Agregar/actualizar notas del pedido
export async function updateOrderNotes(orderId: string, notes: string) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para actualizar pedidos' }
  }

  const { error } = await supabase
    .from('orders')
    .update({
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order notes:', error)
    return { success: false, error: 'Error al actualizar las notas' }
  }

  revalidatePath('/admin/pedidos')
  
  return { success: true }
}

// Actualizar items del pedido (cantidades)
export async function updateOrderItem(itemId: string, quantity: number) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para actualizar items' }
  }

  // Obtener el item para recalcular el total
  const { data: item, error: fetchError } = await supabase
    .from('order_items')
    .select('price')
    .eq('id', itemId)
    .single()

  if (fetchError || !item) {
    return { success: false, error: 'Item no encontrado' }
  }

  const newTotal = item.price * quantity

  const { error } = await supabase
    .from('order_items')
    .update({
      quantity,
      total: newTotal,
    })
    .eq('id', itemId)

  if (error) {
    console.error('Error updating order item:', error)
    return { success: false, error: 'Error al actualizar el item' }
  }

  // Recalcular totales del pedido
  // Esto debería hacerse en un trigger, pero por ahora lo hacemos manualmente
  await recalculateOrderTotals(itemId)

  revalidatePath('/admin/pedidos')
  
  return { success: true }
}

// Eliminar item del pedido
export async function removeOrderItem(itemId: string) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return { success: false, error: 'No tienes permisos para eliminar items' }
  }

  const { error } = await supabase
    .from('order_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    console.error('Error removing order item:', error)
    return { success: false, error: 'Error al eliminar el item' }
  }

  // Recalcular totales del pedido
  await recalculateOrderTotals(itemId)

  revalidatePath('/admin/pedidos')
  
  return { success: true }
}

// Función auxiliar para recalcular totales del pedido
async function recalculateOrderTotals(itemId: string) {
  const supabase = await createClient()

  // Obtener el order_id del item
  const { data: item } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('id', itemId)
    .single()

  if (!item) return

  // Sumar todos los items del pedido
  const { data: items } = await supabase
    .from('order_items')
    .select('total')
    .eq('order_id', item.order_id)

  if (!items) return

  const subtotal = items.reduce((sum, item) => sum + Number(item.total), 0)
  const tax = subtotal * 0.12 // 12% IVA
  const total = subtotal + tax

  // Actualizar el pedido
  await supabase
    .from('orders')
    .update({
      subtotal,
      tax,
      total,
      updated_at: new Date().toISOString(),
    })
    .eq('id', item.order_id)
}

// Obtener estadísticas de pedidos
export async function getOrderStats() {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return null
  }

  // Total de pedidos
  const { count: total } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  // Pedidos pendientes
  const { count: pending } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Pedidos en proceso
  const { count: processing } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'processing')

  // Pedidos enviados
  const { count: shipped } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'shipped')

  // Pedidos entregados
  const { count: delivered } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'delivered')

  return {
    total: total || 0,
    pending: pending || 0,
    processing: processing || 0,
    shipped: shipped || 0,
    delivered: delivered || 0,
  }
}

// Buscar pedidos
export async function searchOrdersAdmin(query: string) {
  const supabase = await createClient()
  
  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  if (!hasPermission) {
    return []
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total,
      created_at,
      shipping_address:addresses!orders_shipping_address_id_fkey(full_name)
    `)
    .or(`order_number.ilike.%${query}%,tracking_number.ilike.%${query}%`)
    .limit(10)

  if (error) {
    console.error('Error searching orders:', error)
    return []
  }

  return orders || []
}

