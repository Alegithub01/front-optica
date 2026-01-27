"use client"

import { CardDescription } from "@/components/ui/card"
import { X } from "lucide-react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { Pedido, PedidoDetalle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentVerificationModal } from "@/components/payment-verification-modal"
import { ArrowLeft, RefreshCw, Package, Clock, CheckCircle2, Eye, Loader2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all")
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const { toast } = useToast()
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null)

  const fetchPedidos = async () => {
    try {
      setLoading(true)
      let data: Pedido[]

      switch (filter) {
        case "today":
          const today = new Date().toISOString().split("T")[0]
          data = await api.get<Pedido[]>(`/pedidos/dia?fecha=${today}`)
          break
        case "week":
          const weekDate = new Date().toISOString().split("T")[0]
          data = await api.get<Pedido[]>(`/pedidos/semana?fecha=${weekDate}`)
          break
        case "month":
          const now = new Date()
          data = await api.get<Pedido[]>(`/pedidos/mes?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
          break
        default:
          data = await api.get<Pedido[]>("/pedidos")
      }

      setPedidos(data)
    } catch (error) {
      console.error("Error fetching pedidos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPedidos()
    const interval = setInterval(fetchPedidos, 30000)
    return () => clearInterval(interval)
  }, [filter])

  const handleVerifyPayment = (pedido: Pedido) => {
    setSelectedPedido(pedido)
    setModalOpen(true)
  }

  const handleApprovePayment = async (id: number, observacion?: string) => {
    try {
      setVerifying(true)
      await api.patch(`/pedidos/${id}/confirmar-pago`, {
        pago_estado: "pagado",
        observacion,
      })
      toast({
        title: "Éxito",
        description: "Pago aceptado correctamente",
      })
      await fetchPedidos()
    } catch (error) {
      console.error("Error al aceptar pago:", error)
      toast({
        title: "Error",
        description: "No se pudo aceptar el pago",
        variant: "destructive",
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleRejectPayment = async (id: number, observacion: string) => {
    try {
      setVerifying(true)
      await api.patch(`/pedidos/${id}/confirmar-pago`, {
        pago_estado: "rechazado",
        observacion,
      })
      toast({
        title: "Éxito",
        description: "Pago rechazado",
      })
      await fetchPedidos()
    } catch (error) {
      console.error("Error al rechazar pago:", error)
      toast({
        title: "Error",
        description: "No se pudo rechazar el pago",
        variant: "destructive",
      })
    } finally {
      setVerifying(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPagoEstadoBadge = (pago_estado?: string) => {
    switch (pago_estado) {
      case "pagado":
        return <Badge className="bg-green-500">Pagado</Badge>
      case "rechazado":
        return <Badge className="bg-red-500">Rechazado</Badge>
      case "en_revision":
        return <Badge className="bg-amber-500">En Revisión</Badge>
      default:
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  const stats = {
    total: pedidos.length,
    pendientes: pedidos.filter((p) => !p.pago_estado || p.pago_estado === "pendiente").length,
    enRevision: pedidos.filter((p) => p.pago_estado === "en_revision").length,
    pagados: pedidos.filter((p) => p.pago_estado === "pagado").length,
    rechazados: pedidos.filter((p) => p.pago_estado === "rechazado").length,
    totalVentas: pedidos
      .filter((p) => p.pago_estado === "pagado")
      .reduce((sum: number, p: Pedido) => sum + (Number(p.total) || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div className="flex-1">
            <Link href="/admin" className="inline-flex items-center text-slate-400 hover:text-white mb-3 text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Gestión de Pedidos</h1>
            <p className="text-slate-300 text-sm lg:text-base mt-1">Verifica y aprueba los comprobantes de pago</p>
          </div>
          <Button
            onClick={fetchPedidos}
            disabled={loading}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white bg-transparent w-full sm:w-auto"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Total</CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-slate-300">{stats.pendientes}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">En Revisión</CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{stats.enRevision}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Pagados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.pagados}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 col-span-2 sm:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Rechazados</CardTitle>
              <CardDescription className="text-slate-400">
                {stats.rechazados}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.rechazados}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-white font-semibold text-sm">Filtrar por período:</h2>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList className="bg-slate-900 w-full sm:w-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm">Todos</TabsTrigger>
                <TabsTrigger value="today" className="text-xs sm:text-sm">Hoy</TabsTrigger>
                <TabsTrigger value="week" className="text-xs sm:text-sm">Esta Semana</TabsTrigger>
                <TabsTrigger value="month" className="text-xs sm:text-sm">Este Mes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tabla/Lista */}
        {loading ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12">
              <div className="flex items-center justify-center text-slate-400">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Cargando pedidos...
              </div>
            </CardContent>
          </Card>
        ) : pedidos.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12">
              <div className="text-center text-slate-400">No hay pedidos para este período</div>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Fecha</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Total</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Estado Pago</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-slate-700/50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-white">#{pedido.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        <div>{pedido.nombre_destinatario}</div>
                        <div className="text-slate-500 text-xs">{pedido.numero_celular}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{formatDate(pedido.fecha)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-white text-right">${pedido.total}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          {getPagoEstadoBadge(pedido.pago_estado)}
                          {pedido.comprobante_url && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {pedido.pago_estado === "pendiente" || pedido.pago_estado === "en_revision" ? (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyPayment(pedido)}
                            disabled={!pedido.comprobante_url}
                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Verificar
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {pedido.pago_estado === "pagado" ? "✓ Aprobado" : "✗ Rechazado"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden divide-y divide-slate-700">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="p-4 hover:bg-slate-700/50 transition cursor-pointer" onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white">Pedido #{pedido.id}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">{formatDate(pedido.fecha)}</p>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{pedido.nombre_destinatario}</p>
                      <p className="text-xs text-slate-500">{pedido.numero_celular}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-base sm:text-lg font-bold text-white whitespace-nowrap">${pedido.total}</div>
                      {getPagoEstadoBadge(pedido.pago_estado)}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedPedido === pedido.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                      {(pedido.detalles || []).map((detalle: PedidoDetalle) => (
                        <div key={detalle.id} className="bg-slate-700/50 rounded p-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white font-medium">{detalle.producto.name}</span>
                            <span className="text-white font-semibold">${detalle.subtotal}</span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1">
                            {detalle.cantidad}x ${detalle.precio_unitario}
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        {pedido.pago_estado === "pendiente" || pedido.pago_estado === "en_revision" ? (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyPayment(pedido)}
                            disabled={!pedido.comprobante_url}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Verificar Comprobante
                          </Button>
                        ) : (
                          <div className="flex-1 text-center text-xs text-slate-400">
                            {pedido.pago_estado === "pagado" ? "✓ Aprobado" : "✗ Rechazado"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <PaymentVerificationModal
          pedido={selectedPedido}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
          loading={verifying}
        />
      </div>
    </div>
  )
}
