import { Users } from 'lucide-react'

export const metadata = {
  title: 'Usuarios - Backoffice ACEROMAX',
  description: 'Gestión de usuarios y roles',
}

export default function UsersAdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-brand-600" />
          Usuarios
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona usuarios y sus roles de acceso
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Sección en Desarrollo
        </h2>
        <p className="text-gray-600 mb-6">
          La gestión de usuarios y roles estará disponible próximamente
        </p>
        <div className="max-w-2xl mx-auto text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Gestión Manual de Roles</h3>
          <p className="text-sm text-blue-800">
            Por ahora, los roles se gestionan directamente desde Supabase. 
            Consulta la documentación para aprender cómo asignar roles de admin o manager.
          </p>
        </div>
      </div>
    </div>
  )
}

