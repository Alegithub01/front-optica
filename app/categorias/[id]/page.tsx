"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/api"
import ProductGrid from "@/components/product-grid"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Producto {
  id: number
  name: string
  price: number
  image: string
  color?: string
  marca?: string
  descripcion?: string
  categoria: { id: number; name: string }
}

export default function CategoriaPage() {
  const params = useParams()
  const categoriaId = params.id as string
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoriaNombre, setCategoriaNombre] = useState("")

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        const data = await api.get<Producto[]>(`/productos/categoria/${categoriaId}`)
        setProductos(data)
        if (data.length > 0) {
          setCategoriaNombre(data[0].categoria.name)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar productos")
        console.log("[v0] Error fetching productos:", err)
      } finally {
        setLoading(false)
      }
    }

    if (categoriaId) {
      fetchProductos()
    }
  }, [categoriaId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-sky-600 hover:text-sky-700 underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-4">
            <ArrowLeft size={20} />
            Volver
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">{categoriaNombre}</h1>
          <p className="text-slate-600 mt-1">{productos.length} productos disponibles</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No hay productos en esta categoría</p>
          </div>
        ) : (
          <ProductGrid productos={productos} />
        )}
      </div>
    </main>
  )
}
