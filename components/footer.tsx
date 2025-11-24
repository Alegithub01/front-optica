"use client"

import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Óptica Nuevo Estilo</h3>
            <p className="text-sm">Tu destino para lentes de calidad y estilo.</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Lentes de Lectura
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Lentes Solares
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Accesorios
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-4">Compañía</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 Óptica Nuevo Estilo. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-amber-400 transition">
                Privacidad
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                Términos
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
