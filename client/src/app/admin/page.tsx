'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  })

  useEffect(() => {
    // Simulation d'un appel API
    setTimeout(() => {
      setStats({
        totalProducts: 24,
        totalUsers: 156,
        totalOrders: 89,
        revenue: 12450
      })
    }, 1000)
  }, [])

  const statCards = [
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-yellow-500',
      change: '+15%'
    },
    {
      title: 'Revenus',
      value: `${stats.revenue}€`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+23%'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre boutique</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} ce mois</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Commandes récentes</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((order) => (
                <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Commande #{order}234</p>
                    <p className="text-sm text-gray-600">Air Force 1 Custom</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">299€</p>
                    <p className="text-sm text-green-600">Payée</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Produits populaires</h2>
            <div className="space-y-4">
              {[
                { name: 'Air Force 1 Dior', sales: 23 },
                { name: 'Air Force 1 Supreme', sales: 18 },
                { name: 'Jordan Mid Custom', sales: 15 },
                { name: 'Air Force 1 Gucci', sales: 12 }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} ventes</p>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(product.sales / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}