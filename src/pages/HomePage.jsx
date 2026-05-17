import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge, LoadingSpinner } from '../components/ui';
import productService from '../services/productService';
import merchantService from '../services/merchantService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredMerchants, setFeaturedMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featured, trending, merchants] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getTrendingProducts(),
          merchantService.getFeaturedMerchants(),
        ]);
        setFeaturedProducts(featured);
        setTrendingProducts(trending);
        setFeaturedMerchants(merchants);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Welcome to DeskMain</h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover amazing products and connect with trusted merchants worldwide
            </p>
            <div className="flex gap-4">
              <Button
                variant="primary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Link to="/products" className="block">Start Shopping</Link>
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-blue-700"
              >
                <Link to="/become-merchant" className="block">Become a Merchant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked selection just for you</p>
            </div>
            <Link to="/products?featured=true" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  <div className="p-4">
                    <Badge variant="primary" size="sm" className="mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          ${parseFloat(product.basePrice).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.rating ? `★ ${product.rating}` : 'No ratings'}
                        </p>
                      </div>
                      <Button size="sm">View</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Now</h2>
              <p className="text-gray-600">Most popular items this week</p>
            </div>
            <Link to="/products?trending=true" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  <div className="p-4">
                    <Badge variant="danger" size="sm" className="mb-2">
                      Trending
                    </Badge>
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          ${parseFloat(product.basePrice).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.rating ? `★ ${product.rating}` : 'No ratings'}
                        </p>
                      </div>
                      <Button size="sm">View</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Merchants Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Merchants</h2>
              <p className="text-gray-600">Shop from trusted sellers</p>
            </div>
            <Link to="/merchants" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMerchants.map((merchant) => (
              <Link key={merchant.id} to={`/merchants/${merchant.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

                  <div className="px-6 pb-6">
                    <div className="flex items-center -mt-16 mb-4">
                      {merchant.logoUrl ? (
                        <img
                          src={merchant.logoUrl}
                          alt={merchant.storeName}
                          className="w-24 h-24 rounded-lg border-4 border-white object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg border-4 border-white bg-gray-200"></div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {merchant.storeName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {merchant.storeDescription}
                    </p>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div>
                        <p className="font-semibold text-gray-900">{merchant.totalProducts || 0}</p>
                        <p className="text-gray-500">Products</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {merchant.rating ? `${merchant.rating}★` : 'N/A'}
                        </p>
                        <p className="text-gray-500">Rating</p>
                      </div>
                    </div>

                    <Button fullWidth size="sm">
                      Visit Store
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our collection of products, connect with merchants, or start selling today
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/products" className="block">Browse Products</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-blue-700">
              <Link to="/contact" className="block">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
