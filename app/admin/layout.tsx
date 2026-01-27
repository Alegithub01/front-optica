'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminLogin from '@/components/admin-login'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si existe el token en localStorage
    const token = localStorage.getItem('admin_token')
    
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    
    setIsLoading(false)
  }, [pathname])

  // Mientras carga, mostrar pantalla vacía
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <AdminLogin />
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>
}
