"use client"

import Link from "next/link"
import Image from "next/image"
import { CartSheet } from "@/components/cart-sheet"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* LOGO + TEXTO */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            
            {/* Icono circular */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-400 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Óptica Nuevo Estilo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>

            {/* Texto */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight hidden sm:block">
              Opti<span className="text-amber-400">ca</span>{" "}
              <span className="text-amber-400">Nue</span>vo{" "}
              <span className="text-amber-400">Esti</span>lo
            </h1>
            
            {/* Texto corto para móvil */}
            <h1 className="text-sm sm:hidden font-bold text-foreground leading-tight">
              Opti<span className="text-amber-400">ca</span>
            </h1>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <CartSheet />
          </div>

        </div>
      </div>
    </nav>
  )
}
