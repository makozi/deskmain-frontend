import apiClient from './apiClient';

const authService = {
  /**
   * Register new user
   */
  register: async (email, password, firstName, lastName) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });
    return response.data;
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Verify email
   */
  verifyEmail: async (token) => {
    const response = await apiClient.post('/auth/verify-email', {
      token,
    });
    return response.data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  /**
   * Reset password
   */
  resetPassword: async (token, password) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh-token', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Google OAuth login
   */
  googleLogin: async (googleToken) => {
    const response = await apiClient.post('/auth/google', {
      google_token: googleToken,
    });
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

export default authService;
