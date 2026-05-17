import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  google: (token) => api.post('/auth/google', { token }),
}

// Merchant APIs
export const merchantAPI = {
  create: (data) => api.post('/merchants', data),
  get: (id) => api.get(`/merchants/${id}`),
  update: (id, data) => api.put(`/merchants/${id}`, data),
  submitKYC: (id, data) => api.post(`/merchants/${id}/kyc`, data),
  getDashboard: (id) => api.get(`/merchants/${id}/dashboard`),
  getTeam: (id) => api.get(`/merchants/${id}/team`),
  inviteTeam: (id, data) => api.post(`/merchants/${id}/team`, data),
}

// Product APIs
export const productAPI = {
  list: (params) => api.get('/products', { params }),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getReviews: (id) => api.get(`/products/${id}/reviews`),
}

// Order APIs
export const orderAPI = {
  list: () => api.get('/orders'),
  get: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  requestRefund: (id, data) => api.post(`/orders/${id}/refund`, data),
}

// Payment APIs
export const paymentAPI = {
  initialize: (data) => api.post('/payments/initialize', data),
  verify: (reference) => api.get(`/payments/verify/${reference}`),
}

// Payout APIs
export const payoutAPI = {
  list: () => api.get('/payouts'),
  request: (data) => api.post('/payouts', data),
  get: (id) => api.get(`/payouts/${id}`),
  getBankAccounts: () => api.get('/payouts/bank-accounts'),
}

// Cart APIs
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  remove: (data) => api.post('/cart/remove', data),
  clear: () => api.post('/cart/clear'),
}

// Wallet APIs
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  getTransactions: () => api.get('/wallet/transactions'),
  deposit: (data) => api.post('/wallet/deposit', data),
}

// Affiliate APIs
export const affiliateAPI = {
  join: (data) => api.post('/affiliates/join', data),
  getDashboard: () => api.get('/affiliates/dashboard'),
  getCommissions: () => api.get('/affiliates/commissions'),
  withdraw: (data) => api.post('/affiliates/withdraw', data),
}

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
}

// Admin APIs
export const adminAPI = {
  getMerchants: () => api.get('/admin/merchants'),
  approveKYC: (id) => api.post(`/admin/merchants/${id}/approve-kyc`),
  rejectKYC: (id) => api.post(`/admin/merchants/${id}/reject-kyc`),
  getDisputes: () => api.get('/admin/disputes'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  getAnalytics: () => api.get('/admin/analytics'),
}

export default api
