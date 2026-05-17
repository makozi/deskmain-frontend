import React, { useState, useEffect } from 'react';
import { useStoreUser } from '../store/userStore';
import { Card, Button, Select, LoadingSpinner } from '../components/ui';
import axios from 'axios';

const MerchantAnalyticsPage = () => {
  const user = useStoreUser((state) => state.user);
  const [dateRange, setDateRange] = useState('30');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/merchants/analytics', {
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

    if (user?.role === 'merchant') {
      fetchAnalytics();
    }
  }, [dateRange, user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
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
                <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900">${analytics.totalRevenue?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-green-600 mt-2">↑ {analytics.revenueGrowth || '0'}% from last period</p>
              </Card>

              <Card>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders || 0}</p>
                <p className="text-sm text-green-600 mt-2">↑ {analytics.orderGrowth || '0'}% from last period</p>
              </Card>

              <Card>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Average Order Value</h3>
                <p className="text-3xl font-bold text-gray-900">${analytics.averageOrderValue?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-gray-600 mt-2">Per transaction</p>
              </Card>

              <Card>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Conversion Rate</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics.conversionRate || '0'}%</p>
                <p className="text-sm text-gray-600 mt-2">Visitor to buyer</p>
              </Card>
            </div>

            {/* Revenue Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart placeholder</p>
                </div>
              </Card>

              {/* Top Products */}
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Products</h2>
                <div className="space-y-3">
                  {analytics.topProducts?.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-0">
                      <span className="text-gray-900">{idx + 1}. {product.name}</span>
                      <span className="font-semibold text-gray-900">{product.sales} sales</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Customer Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Metrics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Customers</span>
                    <span className="font-semibold text-gray-900">{analytics.newCustomers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Returning Customers</span>
                    <span className="font-semibold text-gray-900">{analytics.returningCustomers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-semibold text-gray-900">{analytics.satisfaction || '0'}%</span>
                  </div>
                </div>
              </Card>

              {/* Top Referrers */}
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Referrers</h2>
                <div className="space-y-3">
                  {analytics.topReferrers?.map((referrer, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-0">
                      <span className="text-gray-900">{idx + 1}. {referrer.source}</span>
                      <span className="font-semibold text-gray-900">{referrer.conversions} conversions</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MerchantAnalyticsPage;
