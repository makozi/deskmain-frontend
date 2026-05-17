import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '', password: '', first_name: '', last_name: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg" required />
            <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700">Create Account</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
