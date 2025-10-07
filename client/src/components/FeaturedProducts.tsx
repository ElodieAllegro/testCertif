'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Heart } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  isCustom: boolean
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulation d'un appel API
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: "Air Force 1 Custom Dior",
          price: 299,
          image: "/images/af1-dior.jpg",
          category: "Nike",
          rating: 4.8,
          isCustom: true
        },
        {
          id: 2,
          name: "Air Force 1 Gucci Blue",
          price: 279,
          image: "/images/af1-gucci-blue.jpg",
          category: "Nike",
          rating: 4.9,
          isCustom: true
        },
        {
          id: 3,
          name: "Air Force 1 Supreme",
          price: 319,
          image: "/images/af1-supreme.jpg",
          category: "Nike",
          rating: 4.7,
          isCustom: true
        },
        {
          id: 4,
          name: "Jordan Mid Custom",
          price: 349,
          image: "/images/jordan-mid.jpg",
          category: "Nike",
          rating: 4.9,
          isCustom: true
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Réalisations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Réalisations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez quelques-unes de nos créations les plus populaires
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="card group hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-4xl font-bold text-gray-400">
                    {product.name.split(' ')[0]}
                  </div>
                </div>
                
                {product.isCustom && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Custom
                  </div>
                )}
                
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Heart size={16} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    {product.price}€
                  </span>
                  <Link 
                    href={`/products/${product.id}`}
                    className="btn-primary text-sm"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/realisations" className="btn-primary text-lg px-8 py-3">
            Voir toutes nos réalisations
          </Link>
        </div>
      </div>
    </section>
  )
}