"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CountrySelector } from "@/components/country-selector"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { getCountryByCode } from "@/lib/countries"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nombre_destinatario: "",
    numero_celular: "",
    envio_pais: "",
    codigo_telefonico: "",
    envio_estado: "",
    direccion: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCountryChange = (countryCode: string) => {
    const country = getCountryByCode(countryCode)
    setFormData({
      ...formData,
      envio_pais: countryCode,
      codigo_telefonico: country?.dialCode || "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const pedidoData = {
        envio_pais: formData.envio_pais,
        envio_estado: formData.envio_estado,
        direccion: formData.direccion,
        nombre_destinatario: formData.nombre_destinatario,
        numero_celular: formData.numero_celular,
        items: items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.quantity,
        })),
      }

      const response = await api.post<{ id: number }>("/pedidos", pedidoData)

      // Guardar ID del pedido y datos para la página de pago
      localStorage.setItem("current_pedido_id", response.id.toString())
      localStorage.setItem("checkout_data", JSON.stringify(formData))
      localStorage.setItem("checkout_total", total.toFixed(2))

      clearCart()
      router.push("/pago")

      toast({
        title: "Pedido creado",
        description: "Procede a realizar el pago",
      })
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el pedido. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
            <Link href="/">
              <Button>Volver a la tienda</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la tienda
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">Información de Envío</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Envío */}
          <Card>
            <CardHeader>
              <CardTitle>Completa tus datos para el envío</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_destinatario">Nombre Completo</Label>
                  <Input
                    id="nombre_destinatario"
                    name="nombre_destinatario"
                    value={formData.nombre_destinatario}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <CountrySelector value={formData.envio_pais} onCountryChange={handleCountryChange} />

                <div className="space-y-2">
                  <Label htmlFor="numero_celular">Número de Celular</Label>
                  <div className="flex gap-2">
                    <Input
                      id="codigo_telefonico"
                      name="codigo_telefonico"
                      value={formData.codigo_telefonico}
                      readOnly
                      className="w-24"
                      placeholder="+00"
                    />
                    <Input
                      id="numero_celular"
                      name="numero_celular"
                      type="tel"
                      placeholder="Ej: 1234567890"
                      value={formData.numero_celular}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="envio_estado">Estado/Provincia</Label>
                  <Input
                    id="envio_estado"
                    name="envio_estado"
                    value={formData.envio_estado}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección Completa</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={loading}>
                  {loading ? "Procesando..." : "Continuar al Pago"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resumen del Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={`${item.producto.id}-${item.selectedColor}`} className="flex gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={`/productos/${item.producto.image}`}
                      alt={item.producto.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.producto.name}</h4>
                    <p className="text-sm text-muted-foreground">Color: {item.selectedColor}</p>
                    <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    <p className="font-semibold text-amber-500">${(item.producto.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío:</span>
                  <span className="font-medium">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-amber-500">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
