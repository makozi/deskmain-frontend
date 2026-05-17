import apiClient from './apiClient';

const productService = {
  /**
   * Get all products with filters
   */
  getProducts: async (filters = {}) => {
    const response = await apiClient.get('/products', { params: filters });
    return response.data;
  },

  /**
   * Get single product
   */
  getProduct: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Search products
   */
  searchProducts: async (query, filters = {}) => {
    const response = await apiClient.get('/products/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (category, filters = {}) => {
    const response = await apiClient.get(`/products/category/${category}`, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get product reviews
   */
  getProductReviews: async (productId, page = 1, limit = 10) => {
    const response = await apiClient.get(`/products/${productId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Create product (merchant only)
   */
  createProduct: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  /**
   * Update product (merchant only)
   */
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete product (merchant only)
   */
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Add product variant
   */
  addProductVariant: async (productId, variantData) => {
    const response = await apiClient.post(`/products/${productId}/variants`, variantData);
    return response.data;
  },

  /**
   * Add product file (for digital products)
   */
  addProductFile: async (productId, fileData) => {
    const response = await apiClient.post(`/products/${productId}/files`, fileData);
    return response.data;
  },

  /**
   * Get trending products
   */
  getTrendingProducts: async (limit = 10) => {
    const response = await apiClient.get('/products/trending', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit = 10) => {
    const response = await apiClient.get('/products/featured', {
      params: { limit },
    });
    return response.data;
  },
};

export default productService;
