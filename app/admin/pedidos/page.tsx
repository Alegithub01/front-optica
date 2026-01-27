"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { Pedido, PedidoDetalle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentVerificationModal } from "@/components/payment-verification-modal"
import { ArrowLeft, RefreshCw, Package, Clock, CheckCircle2, Eye } from "lucide-react"
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center text-slate-400 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Link>
            <h1 className="text-4xl font-bold text-white">Gestión de Pedidos y Pagos</h1>
            <p className="text-slate-300 mt-2">Verifica y aprueba los comprobantes de pago</p>
          </div>
          <Button
            onClick={fetchPedidos}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Pedidos</CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-300">{stats.pendientes}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">En Revisión</CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{stats.enRevision}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Pagados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.pagados}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Filtrar por Período</CardTitle>
              <CardDescription className="text-slate-400">
                Selecciona el período de tiempo para ver los pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <TabsList className="bg-slate-900">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="today">Hoy</TabsTrigger>
                  <TabsTrigger value="week">Esta Semana</TabsTrigger>
                  <TabsTrigger value="month">Este Mes</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Lista de Pedidos</CardTitle>
              <CardDescription className="text-slate-400">
                {loading ? "Cargando pedidos..." : `${pedidos.length} pedidos encontrados`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-slate-400">Cargando...</div>
              ) : pedidos.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No hay pedidos para este período</div>
              ) : (
                <div className="space-y-4">
                  {pedidos.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700/50 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">Pedido #{pedido.id}</h3>
                          <p className="text-slate-400 text-sm">{formatDate(pedido.fecha)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPagoEstadoBadge(pedido.pago_estado)}
                          {pedido.comprobante_url && (
                            <Badge variant="outline" className="bg-blue-500/20">
                              ✓ Comprobante
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded p-3 mb-4">
                        <p className="text-slate-300 text-sm">
                          <strong>{pedido.nombre_destinatario}</strong> - {pedido.numero_celular}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {pedido.direccion}, {pedido.envio_estado}, {pedido.envio_pais}
                        </p>
                      </div>

                      <div className="grid gap-3 mb-4">
                        {(pedido.detalles || []).map((detalle: PedidoDetalle) => (
                          <div key={detalle.id} className="bg-slate-700 rounded p-3 flex justify-between items-center">
                            <div>
                              <p className="text-white font-medium">{detalle.producto.name}</p>
                              <p className="text-slate-300 text-sm">
                                Cantidad: {detalle.cantidad} x ${detalle.precio_unitario}
                              </p>
                            </div>
                            <p className="text-white font-semibold">${detalle.subtotal}</p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-700 pt-4 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Total:</span>
                          <span className="text-xl font-bold text-white">${pedido.total}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-slate-300 text-sm font-semibold">Total: ${pedido.total}</p>
                        </div>
                        <div className="flex gap-2">
                          {pedido.pago_estado === "pendiente" || pedido.pago_estado === "en_revision" ? (
                            <Button
                              size="sm"
                              onClick={() => handleVerifyPayment(pedido)}
                              disabled={!pedido.comprobante_url}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Verificar
                            </Button>
                          ) : (
                            <span className="text-sm text-slate-400">
                              {pedido.pago_estado === "pagado" ? "✓ Aceptado" : "✗ Rechazado"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
