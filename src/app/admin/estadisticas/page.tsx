import { BarChart3 } from 'lucide-react'

export const metadata = {
  title: 'Estadísticas - Backoffice ACEROMAX',
  description: 'Análisis y estadísticas',
}

export default function StatsAdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-brand-600" />
          Estadísticas
        </h1>
        <p className="text-gray-600 mt-2">
          Analiza el rendimiento de tu negocio
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Sección en Desarrollo
        </h2>
        <p className="text-gray-600">
          Las estadísticas y análisis estarán disponibles próximamente
        </p>
      </div>
    </div>
  )
}

