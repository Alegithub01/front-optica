"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import QRManager from "@/components/qr-manager"

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-slate-300">Gestiona tu tienda</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/10 bg-transparent w-full sm:w-auto"
          >
            Cerrar Sesión
          </Button>
        </div>

        <div className="mb-8 sm:mb-12">
          <QRManager />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 hover:border-sky-500 transition-colors rounded-lg">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Categorías</h2>
                <p className="text-sm sm:text-base text-slate-400">Crear, editar y eliminar categorías</p>
              </div>
              <Link href="/admin/categorias" className="w-full">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white text-sm sm:text-base">Ir a Categorías</Button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 hover:border-amber-500 transition-colors rounded-lg">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Productos</h2>
                <p className="text-sm sm:text-base text-slate-400">Crear, editar y eliminar productos</p>
              </div>
              <Link href="/admin/productos" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base">Ir a Productos</Button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 hover:border-green-500 transition-colors rounded-lg">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Pedidos</h2>
                <p className="text-sm sm:text-base text-slate-400">Ver y gestionar pedidos en tiempo real</p>
              </div>
              <Link href="/admin/pedidos" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base">Ver Pedidos</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <Link href="/" className="w-full sm:w-auto block">
            <Button variant="outline" className="border-slate-600 text-slate-400 hover:text-white bg-transparent w-full sm:w-auto">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
