import React, { useState, useEffect } from 'react';
import { useStoreUser } from '../store/userStore';
import { Card, Button, Badge, Input, Select, LoadingSpinner, Modal } from '../components/ui';
import axios from 'axios';

const AdminDisputeResolutionPage = () => {
  const user = useStoreUser((state) => state.user);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [outcome, setOutcome] = useState('pending');

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/admin/disputes', { params: { status: filter } });
        setDisputes(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch disputes');
        setDisputes([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchDisputes();
    }
  }, [filter, user]);

  const handleResolve = async (disputeId) => {
    try {
      await axios.put(`/api/v1/admin/disputes/${disputeId}`, {
        status: 'resolved',
        resolution,
        outcome
      });
      setDisputes(disputes.map(d =>
        d.id === disputeId ? { ...d, status: 'resolved', resolution, outcome } : d
      ));
      setShowModal(false);
      setResolution('');
      setOutcome('pending');
      setSelectedDispute(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve dispute');
    }
  };

  const statusColors = {
    pending: 'warning',
    in_review: 'info',
    resolved: 'success',
    escalated: 'danger'
  };

  const outcomeColors = {
    buyer_favor: 'success',
    seller_favor: 'info',
    neutral: 'secondary'
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dispute Resolution</h1>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {['pending', 'in_review', 'resolved', 'escalated'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'secondary'}
              onClick={() => setFilter(status)}
              size="sm"
            >
              {status.replace('_', ' ').toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Disputes */}
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Dispute #{dispute.disputeNumber}</h3>
                  <p className="text-sm text-gray-600 mt-1">Order: #{dispute.orderNumber}</p>
                  <p className="text-sm text-gray-600">Buyer: {dispute.buyerName}</p>
                  <p className="text-sm text-gray-600">Seller: {dispute.sellerName}</p>
                  <p className="text-sm text-gray-600 mt-2">Reason: {dispute.reason}</p>
                </div>
                <div className="text-right">
                  <Badge variant={statusColors[dispute.status] || 'secondary'} className="mb-2">
                    {dispute.status?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {dispute.outcome && (
                    <Badge variant={outcomeColors[dispute.outcome] || 'secondary'}>
                      {dispute.outcome?.replace('_', ' ').toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Issue Description</h4>
                <p className="text-sm text-gray-600">{dispute.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Amount</span>
                  <p className="font-semibold text-gray-900">${dispute.amount?.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Filed</span>
                  <p className="font-semibold text-gray-900">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Days Open</span>
                  <p className="font-semibold text-gray-900">
                    {Math.floor((new Date() - new Date(dispute.createdAt)) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
              </div>

              {dispute.status !== 'resolved' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedDispute(dispute);
                    setShowModal(true);
                  }}
                >
                  Resolve Dispute
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* Resolution Modal */}
        {showModal && selectedDispute && (
          <Modal
            onClose={() => {
              setShowModal(false);
              setSelectedDispute(null);
              setResolution('');
              setOutcome('pending');
            }}
            title="Resolve Dispute"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleResolve(selectedDispute.id);
              }}
              className="space-y-4"
            >
              <p className="text-gray-600">Dispute #{selectedDispute.disputeNumber}</p>

              <Select
                label="Outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                options={[
                  { value: 'buyer_favor', label: 'In Favor of Buyer' },
                  { value: 'seller_favor', label: 'In Favor of Seller' },
                  { value: 'neutral', label: 'Neutral Settlement' }
                ]}
                required
              />

              <Input
                label="Resolution Details"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                as="textarea"
                required
              />

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDispute(null);
                    setResolution('');
                    setOutcome('pending');
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Resolve
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AdminDisputeResolutionPage;
