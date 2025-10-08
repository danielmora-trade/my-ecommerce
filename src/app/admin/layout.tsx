import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminOrManager } from './auth-actions'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar autenticación
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin?redirect=/admin')
  }

  // Verificar permisos
  const hasPermission = await isAdminOrManager()
  
  if (!hasPermission) {
    redirect('/?error=unauthorized')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="lg:pl-64">
        <AdminHeader />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Backoffice - ACEROMAX',
  description: 'Panel de administración',
}

