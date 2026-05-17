import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, LoadingSpinner, Input } from '../components/ui';
import productService from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useAppStore } from '../store/appStore';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { showSuccess, showError } = useAppStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productData, reviewsData] = await Promise.all([
          productService.getProduct(id),
          productService.getProductReviews(id),
        ]);
        setProduct(productData);
        setReviews(reviewsData);
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (error) {
        showError('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, showError]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: parseInt(quantity),
      variant: selectedVariant,
      currency: product.currency,
    };

    addItem(cartItem);
    showSuccess(`${product.name} added to cart!`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Button className="mt-4" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-gray-900">Home</span>
          <span className="mx-2">/</span>
          <span onClick={() => navigate('/products')} className="cursor-pointer hover:text-gray-900">Products</span>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <Card className="overflow-hidden">
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
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
            </Card>
            {product.files && product.files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Downloads</p>
                <div className="space-y-2">
                  {product.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-blue-600"
                    >
                      {file.fileName}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <Badge variant="primary" className="mb-3">
              {product.category}
            </Badge>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900 mr-2">
                  {averageRating}★
                </span>
                <span className="text-gray-600">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-6">
              {product.description}
            </p>

            {/* Price */}
            <Card className="p-6 mb-6 bg-blue-50">
              <p className="text-gray-600 text-sm mb-2">Price</p>
              <h2 className="text-4xl font-bold text-gray-900">
                {product.currency} {parseFloat(product.basePrice).toFixed(2)}
              </h2>
            </Card>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Variants</p>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border-2 rounded-lg transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{variant.name}</p>
                      <p className="text-sm text-gray-600">
                        {variant.currency} {parseFloat(variant.price).toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  −
                </button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="w-16 text-center"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              fullWidth
              onClick={handleAddToCart}
              className="py-3 text-lg font-semibold mb-3"
            >
              Add to Cart
            </Button>

            {/* Product Info */}
            <Card className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SKU</span>
                <span className="font-medium text-gray-900">{product.sku}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Stock</span>
                <span className="font-medium text-gray-900">
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type</span>
                <span className="font-medium text-gray-900">{product.type}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.userName}</p>
                      <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {review.rating}★
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No reviews yet</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
