"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

interface Categoria {
  id: number
  name: string
  image: string
}

interface Props {
  categoria?: Categoria | null
  onSuccess: () => void
  onCancel: () => void
}

export default function CategoriaForm({ categoria, onSuccess, onCancel }: Props) {
  const [name, setName] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (categoria) {
      setName(categoria.name)
      setImagePreview(`/categorias/${categoria.image}`)
    }
  }, [categoria])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let imagePath = categoria?.image

      if (image) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", image)
        uploadFormData.append("name", name)

        const uploadResponse = await fetch("/api/upload/categoria", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Error al subir imagen")
        }

        const uploadData = await uploadResponse.json()
        imagePath = uploadData.filename
      }

      const formData = new FormData()
      formData.append("name", name)
      formData.append("image", imagePath || "")

      if (categoria) {
        await api.patch(`/categorias/${categoria.id}`, formData)
      } else {
        await api.post("/categorias", formData)
      }

      onSuccess()
    } catch (err) {
      setError("Error al guardar categoría")
      console.error("[v0]", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="block text-slate-300 mb-2">Nombre de la Categoría</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
          placeholder="Ej: Lentes de Sol"
        />
      </div>

      <div>
        <label className="block text-slate-300 mb-2">Imagen</label>
        {imagePreview && (
          <div className="mb-4">
            <img src={imagePreview || "/placeholder.svg"} alt="preview" className="h-32 w-32 object-cover rounded" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-300 focus:outline-none focus:border-sky-500"
        />
        <p className="text-xs text-slate-400 mt-1">La imagen se guardará como {name}.png</p>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-slate-600 text-slate-400 bg-transparent"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
