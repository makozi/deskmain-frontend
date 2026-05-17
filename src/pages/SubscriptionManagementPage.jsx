import React, { useState, useEffect } from 'react';
import { useStoreUser } from '../store/userStore';
import { Card, Button, Input, Select, Badge, LoadingSpinner, Modal } from '../components/ui';
import axios from 'axios';

const SubscriptionManagementPage = () => {
  const user = useStoreUser((state) => state.user);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    features: ''
  });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/subscriptions');
        setSubscriptions(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch subscriptions');
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/subscriptions', {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim())
      });
      setSubscriptions([...subscriptions, response.data.data]);
      setFormData({ name: '', description: '', price: '', billingCycle: 'monthly', features: '' });
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subscription');
    }
  };

  const handleDelete = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await axios.delete(`/api/v1/subscriptions/${subscriptionId}`);
        setSubscriptions(subscriptions.filter(s => s.id !== subscriptionId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete subscription');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <Button onClick={() => setShowModal(true)} variant="primary">
            Create Plan
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className="flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{subscription.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{subscription.description}</p>

              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">${subscription.price?.toFixed(2)}</span>
                <span className="text-gray-600 ml-2">/{subscription.billingCycle}</span>
              </div>

              <div className="mb-6">
                <Badge variant="info">{subscription.subscribers || 0} subscribers</Badge>
              </div>

              <div className="mb-6 flex-grow">
                <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                <ul className="space-y-2">
                  {subscription.features?.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(subscription.id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Subscription Modal */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)} title="Create Subscription Plan">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Plan Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                label="Price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <Select
                label="Billing Cycle"
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'annual', label: 'Annual' }
                ]}
              />
              <Input
                label="Features (one per line)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                as="textarea"
                required
              />
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Create Plan
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;
