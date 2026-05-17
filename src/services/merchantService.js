import apiClient from './apiClient';

const merchantService = {
  /**
   * Create merchant account
   */
  createMerchant: async (merchantData) => {
    const response = await apiClient.post('/merchants', merchantData);
    return response.data;
  },

  /**
   * Get merchant profile
   */
  getMerchant: async (merchantId) => {
    const response = await apiClient.get(`/merchants/${merchantId}`);
    return response.data;
  },

  /**
   * Update merchant profile
   */
  updateMerchant: async (merchantId, updateData) => {
    const response = await apiClient.put(`/merchants/${merchantId}`, updateData);
    return response.data;
  },

  /**
   * Get merchant dashboard
   */
  getMerchantDashboard: async (merchantId) => {
    const response = await apiClient.get(`/merchants/${merchantId}/dashboard`);
    return response.data;
  },

  /**
   * Get merchant products
   */
  getMerchantProducts: async (merchantId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/merchants/${merchantId}/products`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Submit KYC documents
   */
  submitKYC: async (merchantId, kycData) => {
    const response = await apiClient.post(`/merchants/${merchantId}/kyc`, kycData);
    return response.data;
  },

  /**
   * Get KYC status
   */
  getKYCStatus: async (merchantId) => {
    const response = await apiClient.get(`/merchants/${merchantId}/kyc`);
    return response.data;
  },

  /**
   * Invite team member
   */
  inviteTeamMember: async (merchantId, inviteData) => {
    const response = await apiClient.post(`/merchants/${merchantId}/team/invite`, inviteData);
    return response.data;
  },

  /**
   * Get team members
   */
  getTeamMembers: async (merchantId) => {
    const response = await apiClient.get(`/merchants/${merchantId}/team`);
    return response.data;
  },

  /**
   * Remove team member
   */
  removeTeamMember: async (merchantId, memberId) => {
    const response = await apiClient.delete(`/merchants/${merchantId}/team/${memberId}`);
    return response.data;
  },

  /**
   * Get merchant stats
   */
  getMerchantStats: async (merchantId, period = 'month') => {
    const response = await apiClient.get(`/merchants/${merchantId}/stats`, {
      params: { period },
    });
    return response.data;
  },

  /**
   * Get merchant sales
   */
  getMerchantSales: async (merchantId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/merchants/${merchantId}/sales`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get merchant revenue
   */
  getMerchantRevenue: async (merchantId, period = 'month') => {
    const response = await apiClient.get(`/merchants/${merchantId}/revenue`, {
      params: { period },
    });
    return response.data;
  },

  /**
   * Search merchants
   */
  searchMerchants: async (query, filters = {}) => {
    const response = await apiClient.get('/merchants/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  /**
   * Get featured merchants
   */
  getFeaturedMerchants: async (limit = 10) => {
    const response = await apiClient.get('/merchants/featured', {
      params: { limit },
    });
    return response.data;
  },
};

export default merchantService;
