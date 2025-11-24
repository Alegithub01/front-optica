"use client"

import { useState } from "react"
import { ShoppingCart, Heart } from "lucide-react"

interface Producto {
  id: number
  name: string
  price: number
  image: string
  color?: string | string[]
  marca?: string
  descripcion?: string
  categoria: { id: number; name: string }
}

interface ProductCardProps {
  producto: Producto
}

export default function ProductCard({ producto }: ProductCardProps) {
  const [liked, setLiked] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleComprar = () => {
    console.log("[v0] Comprar producto:", producto.id)
    // TODO: Integrar con carrito de compras
  }

  const colors = Array.isArray(producto.color)
    ? producto.color
    : typeof producto.color === "string"
      ? JSON.parse(producto.color)
      : []

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div
        className="relative h-64 bg-slate-100 overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={`/productos/${producto.image}` || "/placeholder.svg"}
          alt={producto.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${hovered ? "scale-110" : "scale-100"}`}
        />
        {/* Wish button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
        >
          <Heart size={20} className={liked ? "fill-red-500 text-red-500" : "text-slate-400"} />
        </button>

        {/* Sale badge if applicable */}
        <div className="absolute top-3 left-3 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
          Nuevo
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col grow">
        {/* Brand */}
        {producto.marca && (
          <p className="text-xs uppercase tracking-wider text-sky-600 font-semibold mb-1">{producto.marca}</p>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{producto.name}</h3>

        {/* Description */}
        {producto.descripcion && <p className="text-sm text-slate-600 mb-3 line-clamp-2">{producto.descripcion}</p>}

        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {colors.map((color: string, index: number) => (
              <span key={index} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {color}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto mb-4 pt-3 border-t border-slate-100">
          <p className="text-2xl font-bold text-sky-600">
            ${producto.price.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
          </p>
        </div>

        {/* Buy Button */}
        <button
          onClick={handleComprar}
          className="w-full bg-linear-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
          Comprar
        </button>
      </div>
    </div>
  )
}
