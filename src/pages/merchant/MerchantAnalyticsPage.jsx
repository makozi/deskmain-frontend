import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, LoadingSpinner } from '../../components/ui';

const MerchantAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/merchants/analytics?days=${dateRange}`);
      setAnalytics(response.data.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Analytics</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
          <div className="text-3xl font-bold">${analytics?.total_revenue?.toFixed(2) || '0.00'}</div>
          <div className="text-xs text-green-600 mt-2">+{analytics?.revenue_growth || '0'}%</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Total Orders</div>
          <div className="text-3xl font-bold">{analytics?.total_orders || '0'}</div>
          <div className="text-xs text-blue-600 mt-2">{analytics?.orders_growth || '0'}% growth</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Average Order Value</div>
          <div className="text-3xl font-bold">${analytics?.avg_order_value?.toFixed(2) || '0.00'}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold">{analytics?.conversion_rate || '0'}%</div>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
          [Revenue Chart - Integrate with Chart.js or similar]
        </div>
      </Card>

      {/* Top Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="space-y-3">
            {analytics?.top_products?.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <span className="font-semibold">${product.revenue?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>
          <div className="space-y-3">
            {analytics?.top_referrers?.map((referrer, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{referrer.source}</p>
                  <p className="text-sm text-gray-600">{referrer.clicks} clicks</p>
                </div>
                <span className="text-sm text-gray-600">{referrer.conversion_rate}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Customer Metrics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Customer Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">New Customers</p>
            <p className="text-2xl font-bold">{analytics?.new_customers || '0'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Returning Customers</p>
            <p className="text-2xl font-bold">{analytics?.returning_customers || '0'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Customer Satisfaction</p>
            <p className="text-2xl font-bold">{analytics?.satisfaction_score || '0'}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MerchantAnalyticsPage;
