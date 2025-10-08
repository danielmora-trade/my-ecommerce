'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart,
  Settings,
  BarChart3,
  Tags,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Productos', href: '/admin/productos', icon: Package },
  { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart },
  { name: 'Categorías', href: '/admin/categorias', icon: Tags },
  { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
  { name: 'Estadísticas', href: '/admin/estadisticas', icon: BarChart3 },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
]

export const AdminSidebar = () => {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center border-b border-gray-800">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">ACEROMAX</h1>
                <p className="text-gray-400 text-xs">Backoffice</p>
              </div>
            </Link>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/admin' && pathname.startsWith(item.href))
                    
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-all',
                            isActive
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          )}
                        >
                          <item.icon
                            className={cn(
                              'h-5 w-5 shrink-0',
                              isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              
              <li className="mt-auto">
                <Link
                  href="/"
                  className="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <Home className="h-5 w-5 shrink-0" aria-hidden="true" />
                  Volver al sitio
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar mobile */}
      <div className="lg:hidden">
        {/* TODO: Implementar sidebar móvil con drawer */}
      </div>
    </>
  )
}

