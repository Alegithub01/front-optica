"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Upload, CheckCircle2 } from "lucide-react"
import api from "@/lib/api"

const QR_STORAGE_KEY = "payment_qr_image"

export default function PagoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [pedidoId, setPedidoId] = useState<number | null>(null)
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [pagoCompleto, setPagoCompleto] = useState(false)

  useEffect(() => {
  const id = localStorage.getItem("current_pedido_id")
  const data = localStorage.getItem("checkout_data")
  const monto = localStorage.getItem("checkout_total") || "0.00"

  if (id) setPedidoId(Number.parseInt(id))
  if (data) setCheckoutData(JSON.parse(data))
  setPaymentInfo({ monto })

  if (!id) router.push("/")
}, [router])

  // Información de pago (puedes configurar esto)
  const [paymentInfo, setPaymentInfo] = useState({ monto: "0.00" })


  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setComprobante(e.target.files[0])
    }
  }

  const handleSubmitComprobante = async () => {
    if (!comprobante) {
      toast({ title: "Error", description: "Por favor selecciona un comprobante", variant: "destructive" })
      return
    }

    if (!pedidoId) {
      toast({ title: "Error", description: "Pedido no encontrado", variant: "destructive" })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("comprobante", comprobante)

      await api.post(`/pedidos/${pedidoId}/comprobante`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setPagoCompleto(true)
      toast({ title: "Comprobante enviado", description: "Tu pago está en proceso de verificación" })

      localStorage.removeItem("current_pedido_id")
      localStorage.removeItem("checkout_data")
      localStorage.removeItem("checkout_total")

      setTimeout(() => router.push("/"), 3000)
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo subir el comprobante", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  if (pagoCompleto) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">¡Pago Recibido!</h2>
              <p className="text-muted-foreground">
                Tu comprobante ha sido enviado y está en proceso de verificación. Te notificaremos cuando tu pedido sea
                confirmado.
              </p>
              <p className="text-sm text-muted-foreground">Redirigiendo a la tienda...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Completa tu Pago</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code y Datos de Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎯</span>
                Información de Pago
              </CardTitle>
              <CardDescription>Escanea el QR o usa los datos bancarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img
                  src="/qr-pago.jpg"
                  alt="QR Code de Pago"
                  className="max-w-xs border border-gray-200 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>

              {/* Datos Bancarios */}
              <div className="">
                <div className="p-3 bg-amber-500/10 rounded-lg border-2 border-amber-500">
                  <p className="text-sm font-medium text-muted-foreground">Monto a Pagar</p>
                  <p className="text-2xl font-bold text-amber-500">${paymentInfo.monto}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subir Comprobante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Sube tu Comprobante
              </CardTitle>
              <CardDescription>Después de realizar el pago, sube tu comprobante para verificación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comprobante">Comprobante de Pago</Label>
                <Input
                  id="comprobante"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleComprobanteChange}
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground">Formatos aceptados: JPG, PNG, PDF (Max. 5MB)</p>
              </div>

              {comprobante && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Archivo seleccionado:</p>
                  <p className="text-sm text-muted-foreground">{comprobante.name}</p>
                </div>
              )}

              <Button
                onClick={handleSubmitComprobante}
                disabled={!comprobante || uploading}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                {uploading ? "Subiendo..." : "Enviar Comprobante"}
              </Button>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota:</strong> Tu pedido será procesado una vez que nuestro equipo verifique tu comprobante de
                  pago. Esto puede tomar entre 24-48 horas.
                </p>
              </div>

              {checkoutData && (
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-semibold">Datos de Envío:</h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>
                      <strong>Destinatario:</strong> {checkoutData.nombre_destinatario}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {checkoutData.numero_celular}
                    </p>
                    <p>
                      <strong>Dirección:</strong> {checkoutData.direccion}
                    </p>
                    <p>
                      <strong>Ciudad:</strong> {checkoutData.envio_estado}, {checkoutData.envio_pais}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
