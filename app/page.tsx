"use client"
import Navbar from "@/components/navbar"
import HeroCarousel from "@/components/hero-carousel"
import Categories from "@/components/categories"
import Features from "@/components/features"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-background">
      <Navbar />
      <HeroCarousel />
      <Categories />
      <Features />
      <Footer />
    </main>
  )
}
