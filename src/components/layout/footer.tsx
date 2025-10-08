import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <Image
              src="/logo.svg"
              alt="ACEROMAX"
              width={160}
              height={48}
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm mb-4">
              Líderes en la distribución de aceros de alta calidad para construcción e industria en Ecuador.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-brand-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-brand-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-brand-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-brand-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Productos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categorias/varillas" className="hover:text-brand-400 transition-colors">Varillas</Link></li>
              <li><Link href="/categorias/perfiles" className="hover:text-brand-400 transition-colors">Perfiles</Link></li>
              <li><Link href="/categorias/vigas" className="hover:text-brand-400 transition-colors">Vigas</Link></li>
              <li><Link href="/categorias/laminas" className="hover:text-brand-400 transition-colors">Láminas</Link></li>
              <li><Link href="/categorias/tubos" className="hover:text-brand-400 transition-colors">Tubos y Cañerías</Link></li>
              <li><Link href="/promociones" className="hover:text-brand-400 transition-colors">Promociones</Link></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ayuda" className="hover:text-brand-400 transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="/cotizar" className="hover:text-brand-400 transition-colors">Solicitar Cotización</Link></li>
              <li><Link href="/seguimiento" className="hover:text-brand-400 transition-colors">Seguimiento de Pedido</Link></li>
              <li><Link href="/devoluciones" className="hover:text-brand-400 transition-colors">Devoluciones</Link></li>
              <li><Link href="/garantia" className="hover:text-brand-400 transition-colors">Garantía</Link></li>
              <li><Link href="/terminos" className="hover:text-brand-400 transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>Av. Panamericana Norte Km 14, Quito - Ecuador</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-brand-400 flex-shrink-0" />
                <a href="tel:+593-2-1234567" className="hover:text-brand-400 transition-colors">
                  +593 2-123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-brand-400 flex-shrink-0" />
                <a href="mailto:ventas@aceromax.ec" className="hover:text-brand-400 transition-colors">
                  ventas@aceromax.ec
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm font-semibold text-white mb-2">Horario de Atención</p>
              <p className="text-sm">Lunes a Viernes: 8:00 - 18:00</p>
              <p className="text-sm">Sábados: 8:00 - 13:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 ACEROMAX. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="/privacidad" className="hover:text-brand-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/cookies" className="hover:text-brand-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

