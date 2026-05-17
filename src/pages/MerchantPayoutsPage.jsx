import React, { useState, useEffect } from 'react';
import { useStoreUser } from '../store/userStore';
import { Card, Button, Input, Badge, LoadingSpinner } from '../components/ui';
import axios from 'axios';

const MerchantPayoutsPage = () => {
  const user = useStoreUser((state) => state.user);
  const [payouts, setPayouts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/merchants/payouts');
        setPayouts(response.data.data.payouts);
        setBalance(response.data.data.balance);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch payouts');
        setPayouts([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'merchant') {
      fetchPayouts();
    }
  }, [user]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/merchants/payouts/request', {
        amount: parseFloat(withdrawAmount)
      });
      setPayouts([response.data.data, ...payouts]);
      setWithdrawAmount('');
      setShowWithdrawForm(false);
      setBalance(balance - parseFloat(withdrawAmount));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request payout');
    }
  };

  const statusColors = {
    pending: 'warning',
    completed: 'success',
    failed: 'danger',
    cancelled: 'secondary'
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payouts</h1>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Balance</h2>
              <p className="text-4xl font-bold text-blue-600">${balance?.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-2">Ready to withdraw</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowWithdrawForm(!showWithdrawForm)}
            >
              Request Payout
            </Button>
          </div>

          {showWithdrawForm && (
            <form onSubmit={handleWithdraw} className="mt-6 pt-6 border-t">
              <div className="flex gap-3">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
                <Button variant="primary" type="submit">
                  Request
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowWithdrawForm(false);
                    setWithdrawAmount('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Payouts History */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payout History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Method</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length > 0 ? (
                  payouts.map((payout) => (
                    <tr key={payout.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ${payout.amount?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusColors[payout.status] || 'secondary'}>
                          {payout.status?.charAt(0).toUpperCase() + payout.status?.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {payout.method?.charAt(0).toUpperCase() + payout.method?.slice(1)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                        {payout.referenceNumber || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-600">
                      No payouts yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MerchantPayoutsPage;
