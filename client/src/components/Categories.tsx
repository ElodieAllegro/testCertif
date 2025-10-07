'use client'

import Link from 'next/link'

const categories = [
  {
    id: 1,
    name: 'Nike',
    slug: 'nike',
    description: 'Personnalisez vos Nike préférées',
    image: '/images/nike-category.jpg'
  },
  {
    id: 2,
    name: 'Adidas',
    slug: 'adidas',
    description: 'Créez vos Adidas uniques',
    image: '/images/adidas-category.jpg'
  },
  {
    id: 3,
    name: 'Converse',
    slug: 'converse',
    description: 'Personnalisez vos Converse',
    image: '/images/converse-category.jpg'
  },
  {
    id: 4,
    name: 'Vans',
    slug: 'vans',
    description: 'Customisez vos Vans',
    image: '/images/vans-category.jpg'
  }
]

export default function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Catégories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez votre marque préférée et commencez la personnalisation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/sneakers/${category.slug}`}
              className="group"
            >
              <div className="card hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="text-6xl font-bold text-primary-600 group-hover:scale-110 transition-transform">
                    {category.name.charAt(0)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}