import { Tags } from 'lucide-react'

export const metadata = {
  title: 'Categorías - Backoffice ACEROMAX',
  description: 'Gestión de categorías',
}

export default function CategoriesAdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Tags className="h-8 w-8 text-brand-600" />
          Categorías
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona las categorías de productos
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Tags className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Sección en Desarrollo
        </h2>
        <p className="text-gray-600">
          La gestión de categorías estará disponible próximamente
        </p>
      </div>
    </div>
  )
}

