import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge, LoadingSpinner } from '../../components/ui';
import { apiClient } from '../../services/apiClient';

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/admin/dashboard');
        setDashboard(response.data);
      } catch (error) {
        console.error('Failed to fetch admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading admin dashboard..." />;
  }

  if (!dashboard) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management tools</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {dashboard.totalUsers || 0}
            </h3>
            <p className="text-xs text-gray-500 mt-2">Registered users</p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Merchants</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {dashboard.totalMerchants || 0}
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              <Badge variant="warning" size="sm">
                {dashboard.pendingKYC || 0} Pending KYC
              </Badge>
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">
              ${dashboard.totalRevenue?.toFixed(2) || '0.00'}
            </h3>
            <p className="text-xs text-gray-500 mt-2">Platform fees collected</p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {dashboard.totalOrders || 0}
            </h3>
            <p className="text-xs text-gray-500 mt-2">Completed transactions</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/merchants">
              <Button fullWidth variant="outline">
                Manage Merchants
              </Button>
            </Link>
            <Link to="/admin/kyc">
              <Button fullWidth variant="outline">
                KYC Approvals
              </Button>
            </Link>
            <Link to="/admin/disputes">
              <Button fullWidth variant="outline">
                Disputes
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button fullWidth variant="outline">
                Manage Users
              </Button>
            </Link>
          </div>
        </Card>

        {/* Pending KYC Approvals */}
        <Card className="mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Pending KYC Approvals</h2>
              <Link to="/admin/kyc" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All →
              </Link>
            </div>
          </div>

          {dashboard.pendingKYCList && dashboard.pendingKYCList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Merchant</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Email</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Tier</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Submitted</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboard.pendingKYCList.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">{merchant.storeName}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{merchant.email}</td>
                      <td className="px-6 py-3 text-sm">
                        <Badge variant="info">{merchant.kycTier}</Badge>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(merchant.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <Link to={`/admin/kyc/${merchant.id}`}>
                          <Button size="sm" variant="outline">Review</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No pending KYC approvals
            </div>
          )}
        </Card>

        {/* Recent Disputes */}
        <Card className="mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Disputes</h2>
              <Link to="/admin/disputes" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All →
              </Link>
            </div>
          </div>

          {dashboard.recentDisputes && dashboard.recentDisputes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Dispute ID</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Order</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Filed</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboard.recentDisputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">{dispute.id}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{dispute.orderId}</td>
                      <td className="px-6 py-3 text-sm">
                        <Badge variant={dispute.status === 'open' ? 'danger' : 'success'}>
                          {dispute.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <Link to={`/admin/disputes/${dispute.id}`}>
                          <Button size="sm" variant="outline">Review</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No open disputes
            </div>
          )}
        </Card>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Average Order Value</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${dashboard.avgOrderValue?.toFixed(2) || '0.00'}
            </h3>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Platform Fee Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {dashboard.platformFeeRate || 4}%
            </h3>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Active Users (30 days)</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {dashboard.activeUsersLast30Days || 0}
            </h3>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
