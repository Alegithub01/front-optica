"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import QRManager from "@/components/qr-manager"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
        <p className="text-slate-300 mb-12">Gestiona tu tienda</p>

        <div className="mb-12">
          <QRManager />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 border-slate-700 p-8 hover:border-sky-500 transition-colors rounded-lg">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Categorías</h2>
                <p className="text-slate-400">Crear, editar y eliminar categorías</p>
              </div>
              <Link href="/admin/categorias">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">Ir a Categorías</Button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-800 border-slate-700 p-8 hover:border-amber-500 transition-colors rounded-lg">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Productos</h2>
                <p className="text-slate-400">Crear, editar y eliminar productos</p>
              </div>
              <Link href="/admin/productos">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Ir a Productos</Button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-800 border-slate-700 p-8 hover:border-green-500 transition-colors rounded-lg">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Pedidos</h2>
                <p className="text-slate-400">Ver y gestionar pedidos en tiempo real</p>
              </div>
              <Link href="/admin/pedidos">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Ver Pedidos</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link href="/">
            <Button variant="outline" className="border-slate-600 text-slate-400 hover:text-white bg-transparent">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
