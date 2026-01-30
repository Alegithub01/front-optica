import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { ToastProvider, ToastViewport, Toast } from "@/components/ui/toast"
import WhatsAppFloatingButton from "@/components/whatsapp-floating-button"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Óptica Nuevo Estilo",
    template: "%s | Óptica Nuevo Estilo",
  },
   description:
    "Óptica Nuevo Estilo: lentes ópticos, monturas modernas, cristales de alta calidad y cuidado profesional de tu salud visual. Atención personalizada.",
  
   keywords: [
    "óptica",
    "lentes",
    "lentes ópticos",
    "monturas",
    "cristales",
    "salud visual",
    "examen visual",
    "Óptica Nuevo Estilo",
  ],
  authors: [{ name: "Óptica Nuevo Estilo" }],
  creator: "Óptica Nuevo Estilo",
  publisher: "Óptica Nuevo Estilo",

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.optica-nuevo-estilo.com",
    siteName: "Óptica Nuevo Estilo",
    title: "Óptica Nuevo Estilo",
    description:
      "Lentes ópticos, monturas modernas y cristales de calidad. Cuidamos tu salud visual con atención profesional.",
    images: [
      {
        url: "/logo.png", // ideal una imagen de la óptica o logo
        width: 1200,
        height: 630,
        alt: "Óptica Nuevo Estilo",
      },
    ],
  },
  icons: {
    icon: [
      {
        url: "/logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <CartProvider>
          <ToastProvider>
            {children}
            <WhatsAppFloatingButton />
            <ToastViewport />
            <Toast /> {/* aquí solo para pruebas o si quieres toast global */}
          </ToastProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
