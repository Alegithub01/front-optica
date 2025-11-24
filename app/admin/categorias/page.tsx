"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import api from "@/lib/api"
import CategoriaForm from "@/components/admin/categoria-form"
import CategoriaTable from "@/components/admin/categoria-table"

interface Categoria {
  id: number
  name: string
  image: string
}

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      const data = await api.get<Categoria[]>("/categorias")
      setCategorias(data)
      setError(null)
    } catch (err) {
      setError("Error al cargar categorías")
      console.error("[v0]", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  const handleFormSubmit = () => {
    setShowForm(false)
    setEditingCategoria(null)
    fetchCategorias()
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return

    try {
      const categoria = categorias.find((c) => c.id === id)
      if (categoria) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: `${categoria.name}.png`,
            type: "categoria",
          }),
        })
      }

      await api.delete(`/categorias/${id}`)
      setCategorias(categorias.filter((c) => c.id !== id))
    } catch (err) {
      console.error("[v0]", err)
      setError("Error al eliminar categoría")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gestión de Categorías</h1>
            <p className="text-slate-400">Total: {categorias.length} categorías</p>
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
              {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <CategoriaForm
              categoria={editingCategoria}
              onSuccess={handleFormSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingCategoria(null)
              }}
            />
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-8 bg-sky-600 hover:bg-sky-700 text-white">
            + Agregar Categoría
          </Button>
        )}

        {/* Error */}
        {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded mb-6">{error}</div>}

        {/* Loading */}
        {loading && <div className="text-slate-300">Cargando...</div>}

        {/* Table */}
        {!loading && <CategoriaTable categorias={categorias} onEdit={handleEdit} onDelete={handleDelete} />}
      </div>
    </div>
  )
}
