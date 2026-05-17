import { Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'

export default function HomePage() {
  const features = [
    'Sell Digital Products',
    'Create & Sell Courses',
    'Manage Physical Products',
    'Accept Payments Globally',
    'Built-in Email Marketing',
    'Affiliate System',
    'Team Collaboration',
    'Advanced Analytics',
  ]

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Global Commerce Operating System</h1>
            <p className="text-xl mb-8 text-gray-100">Sell digital products, courses, software, and physical goods worldwide</p>
            <div className="flex justify-center space-x-4">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">Get Started Free</Link>
              <Link to="/login" className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary-600">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose DeskMain?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow">
              <FaCheckCircle className="text-primary-600 text-xl flex-shrink-0" />
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
