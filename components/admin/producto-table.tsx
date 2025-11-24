"use client"

import { Button } from "@/components/ui/button"

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

interface Props {
  productos: Producto[]
  onEdit: (producto: Producto) => void
  onDelete: (id: number) => void
}

export default function ProductoTable({ productos, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-900">
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">ID</th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">Producto</th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">Categoría</th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">Precio</th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">Imagen</th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="border-b border-slate-700 hover:bg-slate-700/50">
              <td className="px-6 py-4 text-slate-300">{producto.id}</td>
              <td className="px-6 py-4 text-slate-300">{producto.name}</td>
              <td className="px-6 py-4 text-slate-300">{producto.categoria.name}</td>
              <td className="px-6 py-4 text-slate-300">${Number(producto.price).toFixed(2)}</td>
              <td className="px-6 py-4">
                <img
                  src={`/productos/${producto.image}`}
                  alt={producto.name}
                  className="h-12 w-12 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 flex gap-2">
                <Button
                  onClick={() => onEdit(producto)}
                  variant="outline"
                  size="sm"
                  className="border-sky-600 text-sky-400 hover:bg-sky-600/20"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => onDelete(producto.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-600/20"
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
