import apiClient from './apiClient';

const orderService = {
  /**
   * Create new order
   */
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  /**
   * Get user orders
   */
  getMyOrders: async (page = 1, limit = 10, filters = {}) => {
    const response = await apiClient.get('/orders', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  /**
   * Get order details
   */
  getOrder: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Update order (merchant only)
   */
  updateOrder: async (orderId, updateData) => {
    const response = await apiClient.put(`/orders/${orderId}`, updateData);
    return response.data;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId) => {
    const response = await apiClient.post(`/orders/${orderId}/cancel`);
    return response.data;
  },

  /**
   * Request refund
   */
  requestRefund: async (orderId, refundData) => {
    const response = await apiClient.post(`/orders/${orderId}/refund`, refundData);
    return response.data;
  },

  /**
   * Get order tracking
   */
  getOrderTracking: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/tracking`);
    return response.data;
  },

  /**
   * Apply coupon to order
   */
  applyCoupon: async (orderId, couponCode) => {
    const response = await apiClient.post(`/orders/${orderId}/apply-coupon`, {
      code: couponCode,
    });
    return response.data;
  },

  /**
   * Download invoice
   */
  downloadInvoice: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get merchant orders
   */
  getMerchantOrders: async (merchantId, page = 1, limit = 10, filters = {}) => {
    const response = await apiClient.get(`/merchants/${merchantId}/orders`, {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  /**
   * Export orders
   */
  exportOrders: async (filters = {}) => {
    const response = await apiClient.get('/orders/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default orderService;
