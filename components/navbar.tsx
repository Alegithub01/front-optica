"use client"

import { ShoppingCart, Search, Menu } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">Ó</span>
              </div>
              <span className="hidden sm:block font-bold text-lg bg-gradient-to-r from-amber-400 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Óptica Nuevo Estilo
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-blue-600 font-medium transition">
              Catálogo
            </a>
            <a href="#" className="text-foreground hover:text-blue-600 font-medium transition">
              Sobre Nosotros
            </a>
            <a href="#" className="text-foreground hover:text-blue-600 font-medium transition">
              Contacto
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Search className="w-5 h-5 text-foreground" />
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full text-xs flex items-center justify-center text-blue-700 font-bold">
                0
              </span>
            </button>
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <a href="#" className="text-foreground hover:text-blue-600 font-medium px-2 py-2">
              Catálogo
            </a>
            <a href="#" className="text-foreground hover:text-blue-600 font-medium px-2 py-2">
              Sobre Nosotros
            </a>
            <a href="#" className="text-foreground hover:text-blue-600 font-medium px-2 py-2">
              Contacto
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
