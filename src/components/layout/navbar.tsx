import Link from 'next/link'
import Image from 'next/image'
import { Menu, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from './search-bar'
import { NavbarActions } from './navbar-actions'
import { getCategories } from '@/app/actions'
import { getCartCount } from '@/app/cart-actions'
import { createClient } from '@/lib/supabase/server'

export default async function Navbar() {
  const categories = await getCategories()
  
  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get cart count if user is authenticated
  const cartCount = user ? await getCartCount() : 0

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+593-2-1234567" className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">+593 2-123-4567</span>
              </a>
              <a href="mailto:ventas@aceromax.ec" className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">ventas@aceromax.ec</span>
              </a>
            </div>
            <div className="text-xs hidden md:block">
              🚚 Envíos gratis en pedidos mayores a $500
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="ACEROMAX"
              width={160}
              height={48}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Search bar */}
          <SearchBar className="hidden md:flex flex-1 max-w-2xl" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            {/* User account and cart */}
            <NavbarActions 
              isAuthenticated={!!user} 
              cartCount={cartCount}
              userEmail={user?.email}
            />
          </div>
        </div>

        {/* Mobile search */}
        <SearchBar className="md:hidden mt-3" />
      </div>

      {/* Categories navigation */}
      <div className="border-t border-border bg-gray-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 text-sm scrollbar-hide">
            <Link
              href="/productos"
              className="px-4 py-2 hover:bg-white hover:text-brand-600 rounded-md whitespace-nowrap transition-colors font-medium"
            >
              Todos los Productos
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="px-4 py-2 hover:bg-white hover:text-brand-600 rounded-md whitespace-nowrap transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

