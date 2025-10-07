'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: "Personnalisez vos sneakers",
    subtitle: "Créez des chaussures uniques qui vous ressemblent",
    image: "/images/hero-1.jpg",
    cta: "Commencer la personnalisation"
  },
  {
    id: 2,
    title: "Qualité premium",
    subtitle: "Des matériaux de haute qualité pour un résultat exceptionnel",
    image: "/images/hero-2.jpg",
    cta: "Découvrir nos réalisations"
  },
  {
    id: 3,
    title: "Livraison rapide",
    subtitle: "Recevez vos sneakers personnalisées en 3 jours ouvrés",
    image: "/images/hero-3.jpg",
    cta: "Commander maintenant"
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-primary-700 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            {slides[currentSlide].subtitle}
          </p>
          <Link 
            href="/sneakers" 
            className="inline-block bg-white text-primary-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            {slides[currentSlide].cta}
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}