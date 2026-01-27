"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import api from "@/lib/api"
import ProductoForm from "@/components/admin/producto-form"
import ProductoTable from "@/components/admin/producto-table"

interface Categoria {
  id: number
  name: string
}

interface Producto {
  id: number
  name: string
  price: number
  image: string
  color?: string
  marca?: string
  descripcion?: string
  categoria: Categoria
}

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)

  const fetchProductos = async () => {
    try {
      setLoading(true)
      const data = await api.get<Producto[]>("/productos")
      setProductos(data)
      setError(null)
    } catch (err) {
      setError("Error al cargar productos")
      console.error("[v0]", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const handleFormSubmit = () => {
    setShowForm(false)
    setEditingProducto(null)
    fetchProductos()
  }

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
  if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return

  try {
    const producto = productos.find((p) => p.id === id)
    if (producto) {
      // borrar la imagen del public/productos
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: producto.image,
          type: "producto",
        }),
      })
    }

    // borrar el producto de la DB
    await api.delete(`/productos/${id}`)
    // actualizar UI
    setProductos(productos.filter((p) => p.id !== id))
  } catch (err) {
    console.error("[v0]", err)
    setError("Error al eliminar producto"
      
    )
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gestión de Productos</h1>
            <p className="text-slate-400">Total: {productos.length} productos</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-slate-600 text-slate-400 bg-transparent">
              Volver
            </Button>
          </Link>
        </div>

        {/* Form Section */}
        {showForm && (
          <Card className="bg-slate-800 border-slate-700 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProducto ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <ProductoForm
              producto={editingProducto}
              onSuccess={handleFormSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingProducto(null)
              }}
            />
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-8 bg-amber-600 hover:bg-amber-700 text-white">
            + Agregar Producto
          </Button>
        )}

        {/* Error */}
        {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded mb-6">{error}</div>}

        {/* Loading */}
        {loading && <div className="text-slate-300">Cargando...</div>}

        {/* Table */}
        {!loading && <ProductoTable productos={productos} onEdit={handleEdit} onDelete={handleDelete} />}
      </div>
    </div>
  )
}
