import apiClient from './apiClient';

const userService = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get user preferences
   */
  getPreferences: async () => {
    const response = await apiClient.get('/users/preferences');
    return response.data;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (preferences) => {
    const response = await apiClient.put('/users/preferences', preferences);
    return response.data;
  },

  /**
   * Get user addresses
   */
  getAddresses: async () => {
    const response = await apiClient.get('/users/addresses');
    return response.data;
  },

  /**
   * Add address
   */
  addAddress: async (addressData) => {
    const response = await apiClient.post('/users/addresses', addressData);
    return response.data;
  },

  /**
   * Update address
   */
  updateAddress: async (addressId, addressData) => {
    const response = await apiClient.put(`/users/addresses/${addressId}`, addressData);
    return response.data;
  },

  /**
   * Delete address
   */
  deleteAddress: async (addressId) => {
    const response = await apiClient.delete(`/users/addresses/${addressId}`);
    return response.data;
  },

  /**
   * Get wishlist
   */
  getWishlist: async (page = 1, limit = 20) => {
    const response = await apiClient.get('/users/wishlist', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Add to wishlist
   */
  addToWishlist: async (productId) => {
    const response = await apiClient.post('/users/wishlist', { product_id: productId });
    return response.data;
  },

  /**
   * Remove from wishlist
   */
  removeFromWishlist: async (productId) => {
    const response = await apiClient.delete(`/users/wishlist/${productId}`);
    return response.data;
  },

  /**
   * Get notifications
   */
  getNotifications: async (page = 1, limit = 20) => {
    const response = await apiClient.get('/users/notifications', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (notificationId) => {
    const response = await apiClient.post(
      `/users/notifications/${notificationId}/mark-as-read`
    );
    return response.data;
  },

  /**
   * Delete account
   */
  deleteAccount: async (password) => {
    const response = await apiClient.post('/users/delete-account', { password });
    return response.data;
  },

  /**
   * Request account export
   */
  requestDataExport: async () => {
    const response = await apiClient.post('/users/export-data');
    return response.data;
  },
};

export default userService;
