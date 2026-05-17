import React, { useState, useEffect } from 'react';
import { useStoreUser } from '../store/userStore';
import { Card, Button, Badge, Input, LoadingSpinner, Modal } from '../components/ui';
import axios from 'axios';

const AffiliateManagementPage = () => {
  const user = useStoreUser((state) => state.user);
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    commissionRate: '',
    paymentMethod: ''
  });

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/admin/affiliates');
        setAffiliates(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch affiliates');
        setAffiliates([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAffiliates();
    }
  }, [user]);

  const handleAddAffiliate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/admin/affiliates', formData);
      setAffiliates([...affiliates, response.data.data]);
      setFormData({ name: '', email: '', commissionRate: '', paymentMethod: '' });
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add affiliate');
    }
  };

  const statusColors = {
    active: 'success',
    inactive: 'secondary',
    suspended: 'danger',
    pending: 'warning'
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Management</h1>
          <Button onClick={() => setShowModal(true)} variant="primary">
            Add Affiliate
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Active Affiliates</h3>
            <p className="text-3xl font-bold text-gray-900">
              {affiliates.filter(a => a.status === 'active').length}
            </p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Commission Paid</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${affiliates.reduce((sum, a) => sum + (a.commissionPaid || 0), 0).toFixed(2)}
            </p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending Commission</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${affiliates.reduce((sum, a) => sum + (a.pendingCommission || 0), 0).toFixed(2)}
            </p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Referrals</h3>
            <p className="text-3xl font-bold text-gray-900">
              {affiliates.reduce((sum, a) => sum + (a.referralCount || 0), 0)}
            </p>
          </Card>
        </div>

        {/* Affiliates Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Commission Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Referrals</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{affiliate.name}</td>
                    <td className="py-3 px-4 text-gray-600">{affiliate.email}</td>
                    <td className="py-3 px-4 text-gray-900">{affiliate.commissionRate}%</td>
                    <td className="py-3 px-4 text-gray-900">{affiliate.referralCount}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusColors[affiliate.status] || 'secondary'}>
                        {affiliate.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Affiliate Modal */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)} title="Add Affiliate">
            <form onSubmit={handleAddAffiliate} className="space-y-4">
              <Input
                label="Affiliate Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Commission Rate (%)"
                type="number"
                step="0.1"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                required
              />
              <Input
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                required
              />
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Add Affiliate
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AffiliateManagementPage;
