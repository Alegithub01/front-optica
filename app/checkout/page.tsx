"use client"

import { useEffect } from "react"
import React from "react"
import { useState } from "react"
import { useRef } from "react"
import type { ShippingType, PedidoFormData } from "@/types/pedido"
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
import  api  from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, Truck, Store, Check } from "lucide-react"
import { getCountryByCode } from "@/lib/countries"
import Link from "next/link"
import { SHIPPING_COST, BRANCH_LOCATION, BRANCH_LAT, BRANCH_LNG } from "@/config"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [shippingType, setShippingType] = useState<ShippingType>("recojo")
  const [mapInitialized, setMapInitialized] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const markerRef = useRef<any>(null)
  const mapRef = useRef<any>(null)

  const [formData, setFormData] = useState<PedidoFormData>({
    nombre_destinatario: "",
    numero_celular: "",
    envio_pais: "",
    codigo_telefonico: "",
    envio_estado: "",
    direccion: "",
    latitude: 0,
    longitude: 0,
  })

  // El total mostrado no incluye el costo de envío
  // El costo de envío se confirma después de la confirmación del pedido
  const totalWithShipping = total

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Cargar Leaflet solo cuando el usuario selecciona recojo en sucursal
  useEffect(() => {
    if (shippingType === "recojo" && !mapInitialized) {
      // Cargar CSS de Leaflet
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      document.head.appendChild(link)

      // Cargar JS de Leaflet
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
      script.async = true
      script.onload = () => {
        setMapInitialized(true)
        setShowMap(true)
      }
      document.body.appendChild(script)
    }
  }, [shippingType, mapInitialized])

  // Inicializar mapa de sucursal cuando esté listo
  useEffect(() => {
    if (showMap && mapInitialized && shippingType === "recojo") {
      // Pequeño delay para asegurar que el DOM está listo
      const timer = setTimeout(() => {
        initializeBranchMapLeaflet()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [showMap, mapInitialized, shippingType])

  const handleCountryChange = (countryCode: string) => {
    const country = getCountryByCode(countryCode)
    setFormData({
      ...formData,
      envio_pais: countryCode,
      codigo_telefonico: country?.dialCode || "",
    })
  }

  // Mapa para recojo en sucursal
  const initializeBranchMapLeaflet = () => {
    if (!window.L || mapRef.current) return

    const map = window.L.map("branch-map-container").setView([BRANCH_LAT, BRANCH_LNG], 15)

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Marcador de la sucursal
    window.L.marker([BRANCH_LAT, BRANCH_LNG], {
      title: "Óptica Nuevo Estilo",
    })
      .addTo(map)
      .bindPopup("<b>Óptica Nuevo Estilo</b><br>La Paz, Bolivia")

    mapRef.current = map
  }

  const createMap = (lat: number, lng: number) => {
    if (mapRef.current) return

    const map = window.L.map("map-container").setView([lat, lng], 15)

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const marker = window.L.marker([lat, lng], {
      draggable: true,
    }).addTo(map)

    markerRef.current = marker
    mapRef.current = map

    const updateLocation = (latitude: number, longitude: number) => {
      setFormData((prev) => ({
        ...prev,
        latitude,
        longitude,
      }))
    }

    map.on("click", (e: any) => {
      const { lat: clickLat, lng: clickLng } = e.latlng
      marker.setLatLng([clickLat, clickLng])
      updateLocation(clickLat, clickLng)
    })

    marker.on("dragend", () => {
      const { lat: markerLat, lng: markerLng } = marker.getLatLng()
      updateLocation(markerLat, markerLng)
    })

    updateLocation(lat, lng)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (shippingType === "envio" && (!formData.latitude || !formData.longitude)) {
        toast({
          title: "Error",
          description: "Por favor selecciona tu ubicación en el mapa",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (shippingType === "envio" && !formData.direccion) {
        toast({
          title: "Error",
          description: "Por favor ingresa tu dirección de entrega",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Para envío a domicilio, construir el link de Google Maps desde las coordenadas
      const mapsLink = shippingType === "recojo" 
        ? BRANCH_LOCATION 
        : formData.latitude && formData.longitude 
          ? `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`
          : ""

      if (shippingType === "envio" && !mapsLink) {
        toast({
          title: "Error",
          description: "Por favor selecciona tu ubicación en el mapa",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const pedidoData = {
        envio_pais: formData.envio_pais,
        envio_estado: formData.envio_estado,
        direccion: shippingType === "recojo" ? "Recojo en Sucursal" : formData.direccion,
        nombre_destinatario: formData.nombre_destinatario,
        numero_celular: formData.numero_celular,
        recojo_sucursal: shippingType === "recojo",
        google_maps_link: mapsLink,
        items: items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.quantity,
        })),
      }

      const response = await api.post<{ id: number }>("/pedidos", pedidoData)

      // Guardar ID del pedido y datos para la página de pago
      localStorage.setItem("current_pedido_id", response.id.toString())
      localStorage.setItem("checkout_data", JSON.stringify(formData))
      localStorage.setItem("checkout_total", totalWithShipping.toFixed(2))
      localStorage.setItem("shipping_type", shippingType)

      clearCart()
      router.push("/pago")

      toast({
        title: "Pedido creado",
        description: "Procede a realizar el pago",
      })
    } catch (error) {
      console.error("Error creating pedido:", error)
      toast({
        title: "Error",
        description: "No se pudo crear tu pedido. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Tu carrito está vacío</h2>
            <Link href="/">
              <Button className="bg-amber-500 hover:bg-amber-600">Volver a la tienda</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la tienda
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-4">Completa tu Pedido</h1>
        <p className="text-muted-foreground mb-8">Elige cómo deseas recibir tus lentes</p>

        {/* Shipping Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Recojo en Sucursal */}
          <button
            onClick={() => setShippingType("recojo")}
            className={`relative p-6 rounded-lg border-2 transition-all ${
              shippingType === "recojo"
                ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                : "border-border hover:border-amber-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  shippingType === "recojo" ? "border-amber-500 bg-amber-500" : "border-border"
                }`}
              >
                {shippingType === "recojo" && <Check className="h-4 w-4 text-white" />}
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-lg text-foreground">Recojo en Sucursal</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Retira tus lentes en nuestra tienda física
                </p>
                <p className="text-2xl font-bold text-green-600">¡Gratis!</p>
              </div>
            </div>
          </button>

          {/* Envío a Domicilio */}
          <button
            onClick={() => setShippingType("envio")}
            className={`relative p-6 rounded-lg border-2 transition-all ${
              shippingType === "envio"
                ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                : "border-border hover:border-amber-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  shippingType === "envio" ? "border-amber-500 bg-amber-500" : "border-border"
                }`}
              >
                {shippingType === "envio" && <Check className="h-4 w-4 text-white" />}
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-lg text-foreground">Envío a Domicilio</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Recibe tus lentes en la dirección que especifiques
                </p>
                <p className="text-2xl font-bold text-amber-600">Costo Extra</p>
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre_destinatario">Nombre Completo</Label>
                    <Input
                      id="nombre_destinatario"
                      name="nombre_destinatario"
                      value={formData.nombre_destinatario}
                      onChange={handleInputChange}
                      className="bg-background"
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
                        className="w-24 bg-background"
                        placeholder="+00"
                      />
                      <Input
                        id="numero_celular"
                        name="numero_celular"
                        type="tel"
                        placeholder="Ej: 1234567890"
                        value={formData.numero_celular}
                        onChange={handleInputChange}
                        className="flex-1 bg-background"
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
                      className="bg-background"
                      required
                    />
                  </div>

                  <Separator className="my-6" />

                  {/* Shipping Address Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      {shippingType === "recojo" ? "Ubicación de Sucursal" : "Tu Dirección de Entrega"}
                    </h3>

                    {shippingType === "recojo" ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          Ubica nuestra sucursal en el mapa:
                        </p>

                        {/* Mapa Interactivo de Sucursal */}
                        <div className="space-y-2">
                          <div
                            id="branch-map-container"
                            className="w-full rounded-lg border border-border shadow-sm bg-muted"
                            style={{ height: "320px", minHeight: "320px" }}
                          />
                        </div>

                        <a
                          href={BRANCH_LOCATION}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
                        >
                          <MapPin className="h-4 w-4" />
                          Ver en Google Maps
                        </a>

                        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-foreground font-semibold mb-2">✓ Recojo Confirmado</p>
                          <p className="text-xs text-muted-foreground">
                            Tu pedido de lentes estará listo para recoger en nuestra sucursal en 24-48 horas
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Ingresa tu dirección y compartir la ubicación desde Google Maps
                        </p>

                        {/* Campo de dirección */}
                        <div className="space-y-2">
                          <Label htmlFor="direccion">Tu Dirección de Entrega</Label>
                          <Input
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                            placeholder="Ej: Calle Principal 123, Apto 4B, Cochabamba"
                            className="bg-background"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Ingresa tu dirección completa o referencias para facilitar la entrega
                          </p>
                        </div>

                        {/* Link de Google Maps */}
                        <div className="space-y-2 bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                          <Label htmlFor="google-maps-link" className="font-semibold">Link de Google Maps (Ubicación)</Label>
                          <Input
                            id="google-maps-link"
                            name="google_maps_link"
                            value={formData.latitude !== 0 ? `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}` : ""}
                            placeholder="https://maps.app.goo.gl/..."
                            className="bg-background font-mono text-xs"
                            disabled
                          />
                          <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                            <p className="font-semibold">¿Cómo obtener el link?</p>
                            <ol className="list-decimal list-inside space-y-1">
                              <li>Abre Google Maps en tu teléfono</li>
                              <li>Busca o ubica tu dirección</li>
                              <li>Toca el punto rojo de la ubicación</li>
                              <li>Presiona "Compartir" y copia el link</li>
                              <li>Pégalo aquí abajo</li>
                            </ol>
                          </div>
                        </div>

                        {/* Campo para pegar el link del usuario */}
                        <div className="space-y-2">
                          <Label htmlFor="maps-url-input">Pega aquí el link de tu ubicación</Label>
                          <Input
                            id="maps-url-input"
                            placeholder="Pega el link de Google Maps de tu ubicación"
                            className="bg-background"
                            onPaste={(e) => {
                              const url = e.clipboardData.getData("text")
                              if (url.includes("maps") || url.includes("goo.gl")) {
                                setFormData((prev) => ({
                                  ...prev,
                                  latitude: parseFloat(url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)?.[1] || "0"),
                                  longitude: parseFloat(url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)?.[2] || "0"),
                                }))
                                toast({
                                  title: "Ubicación detectada",
                                  description: "Tu ubicación ha sido agregada correctamente",
                                })
                              }
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            Copia el link desde Google Maps en tu móvil
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 text-lg"
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : "Continuar al Pago"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.producto.id}-${item.selectedColor}`} className="flex gap-3 pb-3 border-b border-border last:border-b-0">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={`/productos/${item.producto.image}`}
                          alt={item.producto.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <h4 className="font-medium text-foreground">{item.producto.name}</h4>
                        <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                        <p className="font-semibold text-amber-600 text-sm mt-1">
                          BOB{(item.producto.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold text-foreground">BOB{total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {shippingType === "recojo" ? "Recojo:" : "Envío:"}
                    </span>
                    <span className={`font-semibold ${shippingType === "recojo" ? "text-green-600" : "text-amber-600"}`}>
                      {shippingType === "recojo" ? "¡Gratis!" : "Costo Extra"}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-foreground">Total:</span>
                    <span className="font-bold text-amber-600 text-xl">BOB{totalWithShipping.toFixed(2)}</span>
                  </div>

                  {shippingType === "recojo" && (
                    <div className="text-xs text-green-600 font-semibold p-2 bg-green-50 dark:bg-green-950 rounded text-center">
                      ✓ ¡Sin costo de envío!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
