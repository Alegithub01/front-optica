"use client"

import { Button } from "@/components/ui/button"

interface Categoria {
  id: number
  name: string
  image: string
}

interface Props {
  categorias: Categoria[]
  onEdit: (categoria: Categoria) => void
  onDelete: (id: number) => void
}

export default function CategoriaTable({ categorias, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-900">
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">ID</th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">Nombre</th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">Imagen</th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id} className="border-b border-slate-700 hover:bg-slate-700/50">
              <td className="px-6 py-4 text-slate-300">{categoria.id}</td>
              <td className="px-6 py-4 text-slate-300">{categoria.name}</td>
              <td className="px-6 py-4">
                <img
                  src={`/categorias/${categoria.image}`}
                  alt={categoria.name}
                  className="h-12 w-12 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 flex gap-2">
                <Button
                  onClick={() => onEdit(categoria)}
                  variant="outline"
                  size="sm"
                  className="border-sky-600 text-sky-400 hover:bg-sky-600/20"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => onDelete(categoria.id)}
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
