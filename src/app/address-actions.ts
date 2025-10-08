'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

type Address = Database['public']['Tables']['addresses']['Row']
type AddressInsert = Database['public']['Tables']['addresses']['Insert']

// Obtener todas las direcciones del usuario
export async function getUserAddresses() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching addresses:', error)
    return []
  }

  return data as Address[]
}

// Obtener dirección por defecto del usuario
export async function getDefaultAddress() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_default', true)
    .limit(1)
    .maybeSingle()

  return data as Address | null
}

// Crear nueva dirección
export async function createAddress(addressData: Omit<AddressInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' }
  }

  // Si es la dirección por defecto, quitar el default de las demás
  if (addressData.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      ...addressData,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating address:', error)
    return { success: false, error: 'Error al crear la dirección' }
  }

  revalidatePath('/checkout')
  revalidatePath('/carrito')
  
  return { success: true, data }
}

// Actualizar dirección
export async function updateAddress(addressId: string, addressData: Partial<Omit<AddressInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' }
  }

  // Si es la dirección por defecto, quitar el default de las demás
  if (addressData.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { error } = await supabase
    .from('addresses')
    .update(addressData)
    .eq('id', addressId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating address:', error)
    return { success: false, error: 'Error al actualizar la dirección' }
  }

  revalidatePath('/checkout')
  revalidatePath('/carrito')
  
  return { success: true }
}

// Eliminar dirección
export async function deleteAddress(addressId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)

  if (error) {
    console.error('Error deleting address:', error)
    return { success: false, error: 'Error al eliminar la dirección' }
  }

  revalidatePath('/checkout')
  revalidatePath('/carrito')
  
  return { success: true }
}

// Establecer dirección como predeterminada
export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' }
  }

  // Quitar el default de todas las direcciones
  await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', user.id)

  // Establecer como default la seleccionada
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error setting default address:', error)
    return { success: false, error: 'Error al establecer dirección predeterminada' }
  }

  revalidatePath('/checkout')
  revalidatePath('/carrito')
  
  return { success: true }
}

