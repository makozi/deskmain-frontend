import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Input, Select, LoadingSpinner } from '../components/ui';

const ProductSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sort') || 'newest',
    rating: searchParams.get('rating') || '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sort', filters.sortBy);
      if (filters.rating) params.append('rating', filters.rating);

      const response = await axios.get(`/api/v1/products/search?${params}`);
      setProducts(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    const newParams = new URLSearchParams();
    if (filters.query) newParams.set('q', filters.query);
    if (filters.category) newParams.set('category', filters.category);
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice);
    if (filters.sortBy) newParams.set('sort', filters.sortBy);
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Search Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="digital">Digital Products</option>
                  <option value="courses">Courses</option>
                  <option value="physical">Physical Products</option>
                  <option value="services">Services</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <Select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <LoadingSpinner message="Loading products..." />
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found matching your criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        ${product.price?.toFixed(2) || '0.00'}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {product.category || 'General'}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => window.location.href = `/product/${product.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-600">
              Showing {products.length} products
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSearchPage;
