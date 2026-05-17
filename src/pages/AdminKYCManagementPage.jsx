import React, { useState, useEffect } from 'react';
import { useStoreUser } from '../store/userStore';
import { Card, Button, Badge, Input, LoadingSpinner, Modal } from '../components/ui';
import axios from 'axios';

const AdminKYCManagementPage = () => {
  const user = useStoreUser((state) => state.user);
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/admin/kyc', { params: { status: filter } });
        setKycRequests(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch KYC requests');
        setKycRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchRequests();
    }
  }, [filter, user]);

  const handleApprove = async (requestId) => {
    try {
      await axios.put(`/api/v1/admin/kyc/${requestId}`, { status: 'approved' });
      setKycRequests(kycRequests.map(req =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve KYC');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`/api/v1/admin/kyc/${requestId}`, {
        status: 'rejected',
        rejectionReason
      });
      setKycRequests(kycRequests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected', rejectionReason } : req
      ));
      setShowModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject KYC');
    }
  };

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    under_review: 'info'
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">KYC Management</h1>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {['pending', 'under_review', 'approved', 'rejected'].map((status) => (
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

        {/* KYC Requests */}
        <div className="space-y-4">
          {kycRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{request.merchantName}</h3>
                  <p className="text-sm text-gray-600 mt-1">Email: {request.merchantEmail}</p>
                  <p className="text-sm text-gray-600">Business: {request.businessType}</p>
                  <p className="text-sm text-gray-600">Submitted: {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge variant={statusColors[request.status] || 'secondary'} className="mb-3">
                    {request.status?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Documents</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ ID Verification</li>
                    <li>✓ Address Proof</li>
                    <li>✓ Business License</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Verification</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Status: {request.verificationStatus}</li>
                    <li>Risk Score: {request.riskScore || 'N/A'}</li>
                  </ul>
                </div>
                <div>
                  <Button variant="secondary" size="sm">
                    View Documents
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Rejection Modal */}
        {showModal && selectedRequest && (
          <Modal
            onClose={() => {
              setShowModal(false);
              setSelectedRequest(null);
              setRejectionReason('');
            }}
            title="Reject KYC Request"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleReject(selectedRequest.id);
              }}
              className="space-y-4"
            >
              <p className="text-gray-600">Rejecting KYC for {selectedRequest.merchantName}</p>
              <Input
                label="Rejection Reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                as="textarea"
                required
              />
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button variant="danger" type="submit">
                  Reject
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AdminKYCManagementPage;
