"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Check, X } from "lucide-react"
import type { Pedido, PedidoDetalle } from "@/lib/types"

interface PaymentVerificationModalProps {
  pedido: Pedido | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: number, observacion?: string) => Promise<void>
  onReject: (id: number, observacion: string) => Promise<void>
  loading?: boolean
}

export function PaymentVerificationModal({
  pedido,
  open,
  onOpenChange,
  onApprove,
  onReject,
  loading = false,
}: PaymentVerificationModalProps) {
  const [observacion, setObservacion] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

  const handleApprove = async () => {
    if (pedido) {
      await onApprove(pedido.id, observacion)
      setObservacion("")
      onOpenChange(false)
    }
  }

  const handleReject = async () => {
    if (pedido && observacion.trim()) {
      await onReject(pedido.id, observacion)
      setObservacion("")
      setIsRejecting(false)
      onOpenChange(false)
    }
  }

  if (!pedido) return null

  const getComprobanteUrl = (url?: string) => {
    if (!url) return "/placeholder.svg"
    return `${API_URL}${url}`
  }

  const totalPedido = pedido.detalles.reduce((sum: number, detalle: PedidoDetalle) => sum + Number(detalle.subtotal), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verificar Pago de Pedido #{pedido.id}</DialogTitle>
          <DialogDescription>Revisa el comprobante y confirma o rechaza el pago</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Pedido */}
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg">Detalles del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Cliente</p>
                  <p className="font-semibold">{pedido.nombre_destinatario}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Teléfono</p>
                  <p className="font-semibold">{pedido.numero_celular}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Dirección</p>
                  <p className="font-semibold text-sm">
                    {pedido.direccion}, {pedido.envio_estado}, {pedido.envio_pais}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="font-semibold text-green-600">${Number(pedido.total).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productos del Pedido */}
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pedido.detalles.map((detalle: PedidoDetalle) => (
                  <div key={detalle.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-semibold">{detalle.producto.name}</p>
                      <p className="text-sm text-slate-600">Cantidad: {detalle.cantidad}</p>
                    </div>
                    <p className="font-semibold text-green-600">${Number(detalle.subtotal).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comprobante de Pago */}
          <div className="space-y-3">
            <h3 className="font-semibold">Comprobante de Pago</h3>
            {pedido.comprobante_url ? (
              <div className="space-y-3">
                <div className="relative bg-slate-100 rounded-lg p-4 min-h-96 flex items-center justify-center">
                  <img
                    src={getComprobanteUrl(pedido.comprobante_url) || "/placeholder.svg"}
                    alt="Comprobante de pago"
                    className="max-w-full max-h-96 rounded"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => window.open(getComprobanteUrl(pedido.comprobante_url), "_blank")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver en Pantalla Completa
                </Button>
              </div>
            ) : (
              <div className="bg-slate-100 rounded-lg p-8 text-center">
                <p className="text-slate-500">No hay comprobante cargado</p>
              </div>
            )}
          </div>

          {isRejecting ? (
            <div className="space-y-3 bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900">¿Rechazar este pago?</h3>
              <textarea
                placeholder="Escribe el motivo del rechazo (requerido)"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full p-2 border border-red-300 rounded text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleReject}
                  disabled={!observacion.trim() || loading}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {loading ? "Rechazando..." : "Confirmar Rechazo"}
                </Button>
                <Button
                  onClick={() => {
                    setIsRejecting(false)
                    setObservacion("")
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                placeholder="Observaciones (opcional para aceptar)"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleApprove} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-2" />
                  Aceptar Pago
                </Button>
                <Button
                  onClick={() => setIsRejecting(true)}
                  disabled={loading}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rechazar Pago
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
