"use client"

import { useCart } from "@/contexts/cart-context"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function CartSheet() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart()
  const router = useRouter()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-amber-500">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? "Tu carrito está vacío" : `${itemCount} producto(s) en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm sm:text-base">No hay productos en el carrito</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div key={`${item.producto.id}-${item.selectedColor}`} className="flex gap-3 sm:gap-4">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={`/productos/${item.producto.image}`}
                        alt={item.producto.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-medium text-xs sm:text-sm line-clamp-1">{item.producto.name}</h4>
                          <p className="text-xs text-muted-foreground">Color: {item.selectedColor}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6 text-destructive flex-shrink-0"
                          onClick={() => removeItem(item.producto.id, item.selectedColor)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7"
                            onClick={() => updateQuantity(item.producto.id, item.selectedColor, item.quantity - 1)}
                          >
                            <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                          <span className="text-xs sm:text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7"
                            onClick={() => updateQuantity(item.producto.id, item.selectedColor, item.quantity + 1)}
                          >
                            <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                        </div>
                        <p className="font-semibold text-amber-500 text-xs sm:text-sm flex-shrink-0">
                          ${(item.producto.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-3 sm:space-y-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-amber-500">${total.toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="flex-col sm:flex-col gap-2">
                <Button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-sm sm:text-base"
                >
                  Proceder al Pago
                </Button>
                <Button variant="outline" onClick={clearCart} className="w-full bg-transparent text-sm sm:text-base">
                  Vaciar Carrito
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
