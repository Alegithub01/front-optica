"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface Categoria {
  id: number
  name: string
  image: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await api.get<Categoria[]>("/categorias")
        setCategories(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Nuestras <span className="text-amber-400">Categorías</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Encuentra exactamente lo que buscas en nuestra amplia colección de lentes y accesorios
        </p>
      </div>

      {loading && <div className="text-center text-gray-600">Cargando categorías...</div>}
      {error && <div className="text-center text-red-600">Error: {error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative h-64 rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
            >
              <img
                src={`/categorias/${category.image}`}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h3 className="text-2xl font-bold text-white mb-4">{category.name}</h3>
                <button className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors">
                  Explorar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
