import React, { useState, useEffect } from 'react';
import { useStoreUser } from '../store/userStore';
import { Card, Button, Select, Badge, LoadingSpinner } from '../components/ui';
import axios from 'axios';

const MerchantOrdersPage = () => {
  const user = useStoreUser((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = filter !== 'all' ? { status: filter } : {};
        const response = await axios.get('/api/v1/merchants/orders', { params });
        setOrders(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'merchant') {
      fetchOrders();
    }
  }, [filter, user]);

  const statusColors = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    cancelled: 'danger',
    shipped: 'success'
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Orders' },
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
            className="w-48"
          />
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="cursor-pointer hover:shadow-md transition">
              <div
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.itemCount} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${order.total?.toFixed(2)}</p>
                  <Badge variant={statusColors[order.status] || 'secondary'}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </Badge>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">{order.shippingAddress?.name}</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress?.address}</p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                      <p className="text-sm text-gray-600">Payment Method: {order.paymentMethod}</p>
                      <p className="text-sm text-gray-600">Tracking: {order.trackingNumber || 'Not shipped'}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm border-b pb-2">
                          <span className="text-gray-600">{item.productName} x{item.quantity}</span>
                          <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="primary" size="sm">
                      Update Status
                    </Button>
                    <Button variant="secondary" size="sm">
                      Print Label
                    </Button>
                    <Button variant="secondary" size="sm">
                      View Invoice
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchantOrdersPage;
