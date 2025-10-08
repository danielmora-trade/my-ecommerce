'use server'

import { createClient } from '@/lib/supabase/server'

export type UserRole = 'admin' | 'manager' | 'customer'

// Verificar si el usuario actual es admin
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
    return false
  }
  
  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user role:', error)
    return false
  }

  return data?.role === 'admin'
}

// Verificar si el usuario tiene un rol específico
export async function hasRole(role: UserRole): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return data?.role === role
}

// Verificar si el usuario es admin o manager
export async function isAdminOrManager(): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
    return false
  }
  
  if (!user) {
    console.log('No user found')
    return false
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user role:', error)
    console.log('User ID:', user.id)
    return false
  }

  if (!data) {
    console.log('No role data found for user:', user.id)
    return false
  }

  console.log('User role:', data.role)
  return data.role === 'admin' || data.role === 'manager'
}

// Obtener el rol del usuario actual
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return (data?.role as UserRole) || null
}

// Asignar rol a un usuario (solo admin)
export async function assignRole(userId: string, role: UserRole) {
  const supabase = await createClient()
  
  // Verificar que el usuario actual es admin
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    return { success: false, error: 'No tienes permisos para asignar roles' }
  }

  const { error } = await supabase
    .from('user_roles')
    .upsert({
      user_id: userId,
      role,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error assigning role:', error)
    return { success: false, error: 'Error al asignar rol' }
  }

  return { success: true }
}

// Obtener todos los usuarios con sus roles (solo admin)
export async function getAllUsersWithRoles() {
  const supabase = await createClient()
  
  // Verificar que el usuario actual es admin
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    return []
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      role,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users with roles:', error)
    return []
  }

  return data || []
}

