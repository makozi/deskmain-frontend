import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function ProductManagement() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2 hover:bg-primary-700">
          <FaPlus /> <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center py-8">No products yet. Create your first product to get started.</p>
      </div>
    </div>
  )
}
