import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, LoadingSpinner } from '../components/ui';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getCartSummary } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showSuccess } = useAppStore();

  const summary = getCartSummary();
  const itemsByCurrency = useCartStore((state) => state.getItemsByCurrency?.());

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
    showSuccess('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
            <p className="text-gray-600 text-lg mb-8">Your cart is empty</p>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Items ({items.length})
                </h2>
                <button
                  onClick={() => {
                    clearCart();
                    showSuccess('Cart cleared');
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link to={`/products/${item.id}`} className="hover:text-blue-600">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-gray-600 mb-2">
                          Variant: {item.variant.name}
                        </p>
                      )}
                      <p className="text-lg font-bold text-gray-900">
                        {item.currency} {parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Action */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>

                      <p className="text-sm font-semibold text-gray-900">
                        Subtotal: {item.currency} {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Cart Summary */}
          <div>
            <Card className="sticky top-4">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {summary.currency} {summary.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900">
                      {summary.currency} 0.00
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium text-gray-900">
                      {summary.currency} 0.00
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg mb-6">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">
                    {summary.currency} {summary.totalAmount?.toFixed(2) || '0.00'}
                  </span>
                </div>

                <Button
                  fullWidth
                  onClick={handleCheckout}
                  className="mb-3"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-900">
                    ✓ Secure checkout
                    <br />✓ Multiple payment options
                    <br />✓ Fast delivery
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
