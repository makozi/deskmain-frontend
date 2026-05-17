import { Link } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaMenu, FaTimes } from 'react-icons/fa'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">DeskMain</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600">Home</Link>
            <Link to="/merchant/dashboard" className="text-gray-700 hover:text-primary-600">Sell</Link>
            <Link to="/" className="text-gray-700 hover:text-primary-600">Browse</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-xl text-gray-700 hover:text-primary-600" />
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </Link>
            <Link to="/login">
              <FaUser className="text-xl text-gray-700 hover:text-primary-600" />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <FaTimes className="text-xl" /> : <FaMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-primary-600 py-2">Home</Link>
            <Link to="/merchant/dashboard" className="block text-gray-700 hover:text-primary-600 py-2">Sell</Link>
            <Link to="/" className="block text-gray-700 hover:text-primary-600 py-2">Browse</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
