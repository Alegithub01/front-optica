"use client"

import { MessageCircle } from "lucide-react"
import Image from "next/image"

export default function WhatsAppFloatingButton() {
  const phoneNumber = "59172733229" // Reemplaza con tu número de WhatsApp
  const message = "Hola, me gustaría más información"

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
    >
      <Image
        src="/redes/what.png"
        alt="TikTok"
        width={24}
        height={24}
        className="w-8 h-8"
        />
    </a>
  )
}
