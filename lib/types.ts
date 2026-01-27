export interface Producto {
  id: number
  name: string
  price: number
  image: string
  color: string[]
  marca: string
  descripcion: string
  categoria: {
    id: number
    name: string
  }
}

export interface Categoria {
  id: number
  name: string
  image: string
}

export interface CartItem {
  producto: Producto
  selectedColor: string
  quantity: number
}


export type PedidoDetalle = {
  id: number
  producto: Producto
  cantidad: number
  precio_unitario: string
  subtotal: string
}


export type Pedido = {
  id: number
  fecha: string
  envio_pais: string
  envio_estado: string
  direccion: string
  nombre_destinatario: string
  numero_celular: string
  pago_estado: "pendiente" | "en_revision" | "pagado" | "rechazado"
  comprobante_url?: string
  detalles: PedidoDetalle[]
  total: string
  observacion?: string
}

export type CreatePedidoDto = {
  items: {
    productoId: number
    cantidad: number
  }[]
  envio_pais: string
  envio_estado: string
  direccion: string
  nombre_destinatario: string
  numero_celular: string
}


