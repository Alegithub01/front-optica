"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Eye } from "lucide-react"

export default function QRManager() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [qrExists, setQrExists] = useState(false)

  useEffect(() => {
    checkQrExists()
  }, [])

  const checkQrExists = async () => {
    try {
      const response = await fetch("/qr-pago.jpg")
      setQrExists(response.ok)
    } catch {
      setQrExists(false)
    }
  }

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/qr/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload QR")
      }

      setQrExists(true)

      toast({
        title: "Éxito",
        description: "QR actualizado correctamente",
      })

      e.target.value = ""
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir el QR",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQr = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar el QR?")) return

    setLoading(true)

    try {
      const response = await fetch("/api/qr/upload", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete QR")
      }

      setQrExists(false)
      setShowPreview(false)

      toast({
        title: "Éxito",
        description: "QR eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el QR",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700 p-8 hover:border-purple-500 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <span>🎫</span>
          Gestionar QR de Pago
        </CardTitle>
        <CardDescription className="text-slate-400">Carga, actualiza o elimina el QR para los pagos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vista previa del QR actual */}
        {qrExists && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">QR Actual</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? "Ocultar" : "Ver"} Previa
              </Button>
            </div>

            {showPreview && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img src="/qr-pago.jpg" alt="QR de Pago" className="max-w-xs border border-gray-200 rounded" />
              </div>
            )}
          </div>
        )}

        {/* Input para subir nuevo QR */}
        <div className="space-y-3">
          <Label htmlFor="qr-upload" className="text-white">
            {qrExists ? "Reemplazar QR" : "Cargar QR de Pago"}
          </Label>
          <Input
            id="qr-upload"
            type="file"
            accept="image/*"
            onChange={handleQrUpload}
            disabled={loading}
            className="bg-slate-700 border-slate-600 text-white cursor-pointer"
          />
          <p className="text-xs text-slate-400">Formatos: JPG, PNG, GIF, WebP (Máx. 5MB)</p>
        </div>

        {/* Botón para eliminar */}
        {qrExists && (
          <Button onClick={handleDeleteQr} variant="destructive" className="w-full" disabled={loading}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar QR
          </Button>
        )}

        {!qrExists && (
          <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <p className="text-sm text-amber-600">
              <strong>⚠️ Nota:</strong> No hay QR cargado actualmente. Los clientes no podrán completar sus pagos hasta
              que subas un QR.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
