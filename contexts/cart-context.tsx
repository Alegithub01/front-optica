"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Producto } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  addItem: (producto: Producto, selectedColor: string) => void
  removeItem: (productoId: number, selectedColor: string) => void
  updateQuantity: (productoId: number, selectedColor: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items])

  const addItem = (producto: Producto, selectedColor: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.producto.id === producto.id && item.selectedColor === selectedColor,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.producto.id === producto.id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentItems, { producto, selectedColor, quantity: 1 }]
    })
  }

  const removeItem = (productoId: number, selectedColor: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.producto.id === productoId && item.selectedColor === selectedColor)),
    )
  }

  const updateQuantity = (productoId: number, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productoId, selectedColor)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.producto.id === productoId && item.selectedColor === selectedColor ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + Number(item.producto.price) * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
