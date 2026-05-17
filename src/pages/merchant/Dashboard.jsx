import { useState } from 'react'
import { FaDollarSign, FaBox, FaShoppingCart, FaUsers } from 'react-icons/fa'

export default function MerchantDashboard() {
  const stats = [
    { label: 'Total Sales', value: '$0.00', icon: FaDollarSign, color: 'text-green-600' },
    { label: 'Products', value: '0', icon: FaBox, color: 'text-blue-600' },
    { label: 'Orders', value: '0', icon: FaShoppingCart, color: 'text-yellow-600' },
    { label: 'Customers', value: '0', icon: FaUsers, color: 'text-purple-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className={`text-4xl ${stat.color} opacity-20`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <p className="text-gray-500">No orders yet</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
          <p className="text-gray-500">No sales data</p>
        </div>
      </div>
    </div>
  )
}
