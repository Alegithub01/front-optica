'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir al dashboard
    router.push('/admin/dashboard')
  }, [router])

  return null
}
