import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge, LoadingSpinner } from '../../components/ui';
import merchantService from '../../services/merchantService';

const MerchantDashboardPage = () => {
  const [merchant, setMerchant] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        setLoading(true);
        const [merchantData, statsData] = await Promise.all([
          merchantService.getMerchant(),
          merchantService.getMerchantStats(),
        ]);
        setMerchant(merchantData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch merchant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  if (!merchant) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Unable to load dashboard</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {merchant.storeName}
            </h1>
            <p className="text-gray-600">
              {merchant.kycStatus === 'verified' ? (
                <Badge variant="success">KYC Verified</Badge>
              ) : (
                <Badge variant="warning">KYC Pending</Badge>
              )}
            </p>
          </div>
          <Link to="/merchant/settings">
            <Button variant="outline">Settings</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {merchant.currency || 'USD'} {stats?.totalRevenue?.toFixed(2) || '0.00'}
            </h3>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats?.totalOrders || 0}
            </h3>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Products</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats?.totalProducts || 0}
            </h3>
            <Link to="/merchant/products" className="text-xs text-blue-600 hover:text-blue-700 mt-2 block">
              Manage Products →
            </Link>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Pending Payouts</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {merchant.currency || 'USD'} {stats?.pendingPayouts?.toFixed(2) || '0.00'}
            </h3>
            <Link to="/merchant/payouts" className="text-xs text-blue-600 hover:text-blue-700 mt-2 block">
              Request Payout →
            </Link>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/merchant/products/new">
              <Button fullWidth variant="outline">
                + Add Product
              </Button>
            </Link>
            <Link to="/merchant/orders">
              <Button fullWidth variant="outline">
                View Orders
              </Button>
            </Link>
            <Link to="/merchant/team">
              <Button fullWidth variant="outline">
                Team Members
              </Button>
            </Link>
            <Link to="/merchant/analytics">
              <Button fullWidth variant="outline">
                Analytics
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link to="/merchant/orders" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All →
              </Link>
            </div>
          </div>

          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Order ID</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Customer</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">{order.id}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{order.customerName}</td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                        {merchant.currency} {order.amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No orders yet
            </div>
          )}
        </Card>

        {/* Merchant Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Store Name</p>
              <p className="font-medium text-gray-900">{merchant.storeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Business Type</p>
              <p className="font-medium text-gray-900">{merchant.businessType || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Currency</p>
              <p className="font-medium text-gray-900">{merchant.currency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">KYC Status</p>
              <p className="font-medium text-gray-900">
                <Badge variant={merchant.kycStatus === 'verified' ? 'success' : 'warning'}>
                  {merchant.kycStatus}
                </Badge>
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-gray-900">{merchant.storeDescription}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link to="/merchant/settings">
              <Button variant="outline">Edit Store Information</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MerchantDashboardPage;
