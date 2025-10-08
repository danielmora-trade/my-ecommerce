'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarActionsProps {
  isAuthenticated: boolean
  cartCount: number
  userEmail?: string | null
}

export const NavbarActions = ({ isAuthenticated, cartCount, userEmail }: NavbarActionsProps) => {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      })
      
      if (response.ok) {
        router.push('/auth/signin')
        router.refresh()
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/signin">
          <Button className="bg-brand-600 hover:bg-brand-700 gap-2">
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">Iniciar Sesión</span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* User account */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 hidden sm:flex">
            <User className="h-5 w-5" />
            <span className="hidden lg:inline">Mi Cuenta</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm">
            <p className="text-xs text-gray-500">Conectado como</p>
            <p className="font-medium truncate">{userEmail}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Mi Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/mis-pedidos" className="cursor-pointer">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Mis Pedidos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Shopping cart */}
      <Link href="/carrito">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Button>
      </Link>
    </div>
  )
}

