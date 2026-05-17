import apiClient from './apiClient';

const paymentService = {
  /**
   * Initialize payment
   */
  initializePayment: async (paymentData) => {
    const response = await apiClient.post('/payments/initialize', paymentData);
    return response.data;
  },

  /**
   * Verify payment
   */
  verifyPayment: async (reference, provider) => {
    const response = await apiClient.post('/payments/verify', {
      reference,
      provider,
    });
    return response.data;
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  },

  /**
   * Process refund
   */
  processRefund: async (paymentId, refundData) => {
    const response = await apiClient.post(`/payments/${paymentId}/refund`, refundData);
    return response.data;
  },

  /**
   * Get wallet balance
   */
  getWalletBalance: async (currency = 'USD') => {
    const response = await apiClient.get('/wallet/balance', {
      params: { currency },
    });
    return response.data;
  },

  /**
   * Get wallet transactions
   */
  getWalletTransactions: async (currency = 'USD', page = 1, limit = 20) => {
    const response = await apiClient.get('/wallet/transactions', {
      params: { currency, page, limit },
    });
    return response.data;
  },

  /**
   * Deposit to wallet
   */
  depositToWallet: async (depositData) => {
    const response = await apiClient.post('/wallet/deposit', depositData);
    return response.data;
  },

  /**
   * Get payout accounts
   */
  getPayoutAccounts: async () => {
    const response = await apiClient.get('/payouts/accounts');
    return response.data;
  },

  /**
   * Add payout account
   */
  addPayoutAccount: async (accountData) => {
    const response = await apiClient.post('/payouts/accounts', accountData);
    return response.data;
  },

  /**
   * Create payout
   */
  createPayout: async (payoutData) => {
    const response = await apiClient.post('/payouts', payoutData);
    return response.data;
  },

  /**
   * Get payouts
   */
  getPayouts: async (page = 1, limit = 10, filters = {}) => {
    const response = await apiClient.get('/payouts', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  /**
   * Get payout details
   */
  getPayout: async (payoutId) => {
    const response = await apiClient.get(`/payouts/${payoutId}`);
    return response.data;
  },

  /**
   * Cancel payout
   */
  cancelPayout: async (payoutId) => {
    const response = await apiClient.post(`/payouts/${payoutId}/cancel`);
    return response.data;
  },
};

export default paymentService;
