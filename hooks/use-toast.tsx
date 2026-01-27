"use client"

import { useState } from "react"

export type ToastVariant = "default" | "success" | "error" | "destructive"

export type Toast = {
  title?: string
  description?: string
  variant?: ToastVariant
}

let listeners: ((toast: Toast | null) => void)[] = []

export function toast(toast: Toast) {
  listeners.forEach((l) => l(toast))

  setTimeout(() => {
    listeners.forEach((l) => l(null))
  }, 3000)
}

export function useToast() {
  const [currentToast, setCurrentToast] = useState<Toast | null>(null)

  if (!listeners.includes(setCurrentToast)) {
    listeners.push(setCurrentToast)
  }

  return {
    toast,
    currentToast,
  }
}
