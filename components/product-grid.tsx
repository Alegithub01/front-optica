import ProductCard from "./product-card"

interface Producto {
  id: number
  name: string
  price: number
  image: string
  color?: string
  marca?: string
  descripcion?: string
  categoria: { id: number; name: string }
}

interface ProductGridProps {
  productos: Producto[]
}

export default function ProductGrid({ productos }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  )
}
