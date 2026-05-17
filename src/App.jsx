import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import MerchantDashboard from './pages/merchant/Dashboard'
import ProductManagement from './pages/merchant/ProductManagement'
import Orders from './pages/merchant/Orders'
import Payouts from './pages/merchant/Payouts'
import ShoppingCart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import Order from './pages/customer/Order'
import AdminDashboard from './pages/admin/Dashboard'
import ErrorPage from './pages/ErrorPage'

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer Routes */}
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:id" element={<Order />} />

            {/* Merchant Routes */}
            <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
            <Route path="/merchant/products" element={<ProductManagement />} />
            <Route path="/merchant/orders" element={<Orders />} />
            <Route path="/merchant/payouts" element={<Payouts />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Error Route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
