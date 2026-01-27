"use client"

import { Instagram } from "lucide-react"
import { TicketIcon as TikTok } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Óptica Nuevo Estilo</h3>
            <p className="text-sm text-slate-500">Tu destino para lentes de calidad y estilo.</p>
          </div>

          {/* Social */}
          <div className="md:text-right">
            <h4 className="text-white font-semibold mb-3 text-sm">Síguenos</h4>
            <div className="flex gap-3 md:justify-end">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                 <Image
                        src="/redes/insta.png"
                        alt="TikTok"
                        width={24}
                        height={24}
                        className="w-8 h-8"
                        />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <Image
                        src="/redes/tik.png"
                        alt="TikTok"
                        width={24}
                        height={24}
                        className="w-8 h-8"
                        />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
            <p>&copy; 2025 Óptica Nuevo Estilo. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-400 transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-slate-400 transition-colors">
                Términos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
