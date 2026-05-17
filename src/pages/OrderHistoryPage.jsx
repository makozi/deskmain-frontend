import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Badge, Button, LoadingSpinner } from '../components/ui';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const response = await axios.get(`/api/v1/orders${params}`);
      setOrders(response.data.data || []);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      cancelled: 'danger',
      refunded: 'secondary',
    };
    return colors[status] || 'secondary';
  };

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Order History</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded font-medium whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No orders found</p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/'}
            >
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card
                key={order.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Items</p>
                    <p className="font-semibold">{order.items?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="font-semibold">${order.total_amount?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Payment</p>
                    <p className="font-semibold text-sm">{order.payment_method || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {selectedOrder?.id === order.id && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-4">Order Items</h4>
                    <div className="space-y-2 mb-4">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.product_name}</span>
                          <span>${item.price?.toFixed(2) || '0.00'} x {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${(order.total_amount - (order.shipping_cost || 0))?.toFixed(2) || '0.00'}</span>
                      </div>
                      {order.shipping_cost && (
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span>${order.shipping_cost?.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>${order.total_amount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>

                    {order.status === 'completed' && (
                      <div className="mt-4 flex gap-2">
                        <Button variant="secondary" size="sm">
                          Download Invoice
                        </Button>
                        <Button variant="secondary" size="sm">
                          Leave Review
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
