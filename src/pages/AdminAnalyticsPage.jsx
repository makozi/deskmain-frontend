import React, { useState, useEffect } from 'react';
import { useStoreUser } from '../store/userStore';
import { Card, Select, LoadingSpinner } from '../components/ui';
import axios from 'axios';

const AdminAnalyticsPage = () => {
  const user = useStoreUser((state) => state.user);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/admin/analytics', {
          params: { days: dateRange }
        });
        setAnalytics(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics');
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [dateRange, user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
              { value: '365', label: 'Last year' }
            ]}
            className="w-40"
          />
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers || 0}</p>
                <p className="text-sm text-green-600 mt-2">↑ {analytics.userGrowth || '0'}% this period</p>
              </Card>

              <Card>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Total Merchants</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalMerchants || 0}</p>
                <p className="text-sm text-green-600 mt-2">↑ {analytics.merchantGrowth || '0'}% this period</p>
              </Card>

              <Card>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Total Transactions</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalTransactions || 0}</p>
                <p className="text-sm text-gray-600 mt-2">Completed orders</p>
              </Card>

              <Card>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Platform Revenue</h3>
                <p className="text-3xl font-bold text-gray-900">${analytics.platformRevenue?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-gray-600 mt-2">Commission earned</p>
              </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Transaction Value</span>
                    <span className="font-semibold text-gray-900">${analytics.avgTransactionValue?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dispute Rate</span>
                    <span className="font-semibold text-gray-900">{analytics.disputeRate || '0'}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chargeback Rate</span>
                    <span className="font-semibold text-gray-900">{analytics.chargebackRate || '0'}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">System Uptime</span>
                    <span className="font-semibold text-gray-900">{analytics.uptime || '99.9'}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Sessions</span>
                    <span className="font-semibold text-gray-900">{analytics.activeSessions || 0}</span>
                  </div>
                </div>
              </Card>

              {/* Top Metrics */}
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Top Metrics</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Category</h4>
                    <p className="text-gray-600">{analytics.topCategory?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{analytics.topCategory?.count || 0} products</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Merchant</h4>
                    <p className="text-gray-600">{analytics.topMerchant?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">${analytics.topMerchant?.revenue?.toFixed(2) || '0.00'} revenue</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Peak Hour</h4>
                    <p className="text-gray-600">{analytics.peakHour || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{analytics.peakHourTransactions || 0} transactions</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart placeholder</p>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Activity</h2>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart placeholder</p>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
