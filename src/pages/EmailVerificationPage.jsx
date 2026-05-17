import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setLoading(false);
      setShowResendForm(true);
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      setLoading(true);
      const response = await api.post('/auth/verify-email', { token });

      if (response.data.access_token) {
        // Auto login after verification
        login(response.data.access_token, response.data.refresh_token, response.data.user);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Verification failed');
      setShowResendForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    try {
      setResending(true);
      await api.post('/auth/resend-verification', { email: resendEmail });
      setResendSuccess(true);
      setTimeout(() => {
        setResendSuccess(false);
        setResendEmail('');
        setShowResendForm(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600 mb-8">Complete your account setup</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}

        {!loading && !error && !showResendForm && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">Email Verified!</h2>
            <p className="text-green-700 mb-4">Your account has been successfully verified.</p>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </div>
        )}

        {error && !showResendForm && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-700 font-semibold mb-2">Verification Failed</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {showResendForm && (
          <form onSubmit={handleResendVerification} className="space-y-4">
            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700">Verification email sent successfully!</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={resending || !resendEmail}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <p className="text-center text-gray-600 text-sm">
              Already verified?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
