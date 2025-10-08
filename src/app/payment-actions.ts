'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']
type PaymentMethodInsert = Database['public']['Tables']['payment_methods']['Insert']

// Obtener todos los métodos de pago del usuario
export async function getUserPaymentMethods() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching payment methods:', error)
    return []
  }

  return data as PaymentMethod[]
}

// Obtener método de pago por defecto
export async function getDefaultPaymentMethod() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_default', true)
    .limit(1)
    .maybeSingle()

  return data as PaymentMethod | null
}

// Crear nuevo método de pago
export async function createPaymentMethod(
  paymentData: Omit<PaymentMethodInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' }
  }

  // Si es el método de pago por defecto, quitar el default de los demás
  if (paymentData.is_default) {
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      ...paymentData,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating payment method:', error)
    return { success: false, error: 'Error al guardar el método de pago' }
  }

  revalidatePath('/checkout')
  
  return { success: true, data }
}

// Eliminar método de pago
export async function deletePaymentMethod(paymentMethodId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', paymentMethodId)

  if (error) {
    console.error('Error deleting payment method:', error)
    return { success: false, error: 'Error al eliminar el método de pago' }
  }

  revalidatePath('/checkout')
  
  return { success: true }
}

// Establecer método de pago como predeterminado
export async function setDefaultPaymentMethod(paymentMethodId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' }
  }

  // Quitar el default de todos los métodos
  await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', user.id)

  // Establecer como default el seleccionado
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', paymentMethodId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error setting default payment method:', error)
    return { success: false, error: 'Error al establecer método de pago predeterminado' }
  }

  revalidatePath('/checkout')
  
  return { success: true }
}


