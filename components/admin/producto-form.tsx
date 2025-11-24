"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import api from "@/lib/api"

interface Categoria {
  id: number
  name: string
}

interface Producto {
  id: number
  name: string
  price: number
  image: string
  color?: string | string[]
  marca?: string
  descripcion?: string
  categoria: Categoria
}

interface Props {
  producto?: Producto | null
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductoForm({ producto, onSuccess, onCancel }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    colors: [] as string[],
    marca: "",
    descripcion: "",
    categoriaId: "",
  })
  const [colorInput, setColorInput] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategorias()
    if (producto) {
      const colors = Array.isArray(producto.color) ? producto.color : producto.color ? [producto.color] : []
      setFormData({
        name: producto.name,
        price: producto.price.toString(),
        colors: colors,
        marca: producto.marca || "",
        descripcion: producto.descripcion || "",
        categoriaId: producto.categoria.id.toString(),
      })
      setImagePreview(`/productos/${producto.image}`)
    }
  }, [producto])

  const fetchCategorias = async () => {
    try {
      const data = await api.get<Categoria[]>("/categorias")
      setCategorias(data)
    } catch (err) {
      console.error("[v0] Error fetching categorias:", err)
    }
  }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }))
      setColorInput("")
    }
  }

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let imagePath = producto?.image

      if (image) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", image)

        const uploadResponse = await fetch("/api/upload/producto", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Error al subir imagen")
        }

        const uploadData = await uploadResponse.json()
        imagePath = uploadData.filename

        if (producto?.image) {
          await fetch("/api/upload/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: producto.image, type: "producto" }),
          })
        }
      }

      const form = new FormData()
      form.append("name", formData.name)
      form.append("price", formData.price)
      form.append("color", JSON.stringify(formData.colors))
      form.append("marca", formData.marca)
      form.append("descripcion", formData.descripcion)
      form.append("categoria_id", formData.categoriaId)
      form.append("image", imagePath || "")

      if (producto) {
        await api.patch(`/productos/${producto.id}`, form)
      } else {
        await api.post("/productos", form)
      }

      onSuccess()
    } catch (err) {
      setError("Error al guardar producto")
      console.error("[v0] Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 mb-2">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            placeholder="Nombre del producto"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">Marca</label>
          <input
            type="text"
            name="marca"
            value={formData.marca}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            placeholder="Marca"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-slate-300 mb-2">Categoría</label>
          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-slate-300 mb-2">Colores Disponibles</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddColor()}
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            placeholder="Escribir color y presionar Enter"
          />
          <Button type="button" onClick={handleAddColor} className="bg-sky-600 hover:bg-sky-700 text-white px-4">
            Agregar
          </Button>
        </div>
        {formData.colors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.colors.map((color, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded-full text-sm text-slate-200"
              >
                <span>{color}</span>
                <button type="button" onClick={() => handleRemoveColor(index)} className="hover:text-red-400">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-slate-300 mb-2">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 h-24"
          placeholder="Descripción del producto"
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
        <p className="text-xs text-slate-400 mt-1">Selecciona una imagen para el producto</p>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
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
