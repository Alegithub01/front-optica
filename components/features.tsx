"use client"

import { Truck, Shield, RotateCcw, Headphones } from "lucide-react"

export default function   Features() {
  const features = [
    {
      icon: Truck,
      title: "Envío Rápido",
      description: "Entrega en 24-48 horas",
      color: "text-amber-400",
    },
    {
      icon: Shield,
      title: "Garantía 100%",
      description: "Satisfacción garantizada",
      color: "text-cyan-400",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
