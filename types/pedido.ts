/**
 * Tipos para la gestión de pedidos en el checkout mejorado
 */

export type ShippingType = "recojo" | "envio"

export interface PedidoFormData {
  nombre_destinatario: string
  numero_celular: string
  envio_pais: string
  codigo_telefonico: string
  envio_estado: string
  direccion: string
  latitude: number
  longitude: number
}

export interface CreatePedidoPayload {
  envio_pais: string
  envio_estado: string
  direccion: string
  nombre_destinatario: string
  numero_celular: string
  recojo_sucursal: boolean
  google_maps_link: string
  items: PedidoItem[]
}

export interface PedidoItem {
  productoId: number
  cantidad: number
}

export interface PedidoResponse {
  id: number
  fecha: string
  envio_pais: string
  envio_estado: string
  direccion: string
  nombre_destinatario: string
  numero_celular: string
  recojo_sucursal: boolean
  google_maps_link?: string
  pago_estado: string
  comprobante_url?: string
  detalles: DetallePedidoResponse[]
  total: number
}

export interface DetallePedidoResponse {
  id: number
  producto: {
    id: number
    name: string
    price: number
    image: string
  }
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface CheckoutState {
  shippingType: ShippingType
  formData: PedidoFormData
  totalWithShipping: number
  isLoading: boolean
}

// Constantes
export const SHIPPING_COST_BOB = 50
export const BRANCH_LOCATION_URL = "https://maps.app.goo.gl/JJY2UsygekrGPeMP6"
export const BRANCH_LAT = -17.8
export const BRANCH_LNG = -63.2

// Helper functions
export const calculateShippingCost = (shippingType: ShippingType): number => {
  return shippingType === "recojo" ? 0 : SHIPPING_COST_BOB
}

export const calculateTotal = (subtotal: number, shippingType: ShippingType): number => {
  return subtotal + calculateShippingCost(shippingType)
}

export const getShippingLabel = (shippingType: ShippingType): string => {
  return shippingType === "recojo" ? "Recojo en Sucursal" : "Envío a Domicilio"
}

export const getShippingIcon = (shippingType: ShippingType): "store" | "truck" => {
  return shippingType === "recojo" ? "store" : "truck"
}
