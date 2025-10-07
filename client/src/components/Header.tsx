'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, User } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b-2 border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Custom Sneakers</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/sneakers" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Sneakers
            </Link>
            <Link href="/realisations" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Réalisations
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              À propos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <User size={20} />
              <span>Connexion</span>
            </Link>
            
            <button className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Menu Mobile */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/sneakers" className="text-gray-700 hover:text-primary-600 font-medium">
                Sneakers
              </Link>
              <Link href="/realisations" className="text-gray-700 hover:text-primary-600 font-medium">
                Réalisations
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
                À propos
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium">
                Connexion
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}