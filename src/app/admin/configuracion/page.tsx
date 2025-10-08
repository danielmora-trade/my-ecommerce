import { Settings } from 'lucide-react'

export const metadata = {
  title: 'Configuración - Backoffice ACEROMAX',
  description: 'Configuración del sistema',
}

export default function SettingsAdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="h-8 w-8 text-brand-600" />
          Configuración
        </h1>
        <p className="text-gray-600 mt-2">
          Ajusta la configuración del sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Sección en Desarrollo
        </h2>
        <p className="text-gray-600">
          Las opciones de configuración estarán disponibles próximamente
        </p>
      </div>
    </div>
  )
}

