"use client"

import { useState } from "react"
import type { Producto } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  producto: Producto
}

export function ProductCard({ producto }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(producto.color?.[0] || "")
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast({
        title: "Selecciona un color",
        description: "Por favor selecciona un color antes de añadir al carrito",
        variant: "destructive",
      })
      return
    }

    addItem(producto, selectedColor)

    toast({
      title: "✓ Producto agregado correctamente",
      description: `${producto.name} - Color: ${selectedColor}`,
    })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={`/productos/${producto.image}`}
          alt={producto.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">{producto.name}</h3>
          {producto.marca && <p className="text-sm text-muted-foreground">{producto.marca}</p>}
        </div>

        <p className="text-2xl font-bold text-amber-500">${Number(producto.price).toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!selectedColor}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Añadir al Carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
