"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselSlide {
  id: number
  title: string
  subtitle: string
  image: string
  cta: string
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Lentes de Calidad Premium",
    subtitle: "Protege tu visión con estilo",
    image: "/premium-eyeglasses-fashion-style.jpg",
    cta: "Ver Colección",
  },
  {
    id: 2,
    title: "Colecciones Exclusivas",
    subtitle: "Los mejores diseños para ti",
    image: "/designer-eyeglasses-collection-modern.jpg",
    cta: "Explorar Ahora",
  },
  {
    id: 3,
    title: "Lentes Solares UV",
    subtitle: "Protección total contra el sol",
    image: "/sunglasses-uv-protection-outdoor.jpg",
    cta: "Comprar Ahora",
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  const slide = slides[current]

  return (
    <div
      className="relative h-screen max-h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {/* Current Slide */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
              <span className="text-amber-300">{slide.title.split(" ")[0]}</span>{" "}
              {slide.title.split(" ").slice(1).join(" ")}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">{slide.subtitle}</p>
            
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index)
                setAutoPlay(false)
              }}
              className={`w-3 h-3 rounded-full transition ${
                index === current ? "bg-amber-400 w-8" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
