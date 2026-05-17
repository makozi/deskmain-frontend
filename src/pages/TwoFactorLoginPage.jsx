import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui';

export default function TwoFactorLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [method, setMethod] = useState('');

  useEffect(() => {
    // Get temp token and method from location state
    const state = location.state;
    if (state?.tempToken && state?.method) {
      setTempToken(state.tempToken);
      setMethod(state.method);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Code is required');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/verify-2fa', {
        temp_token: tempToken,
        code: code,
      });

      if (response.data.access_token) {
        login(response.data.access_token, response.data.refresh_token, response.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Two-Factor Authentication</h1>
        <p className="text-gray-600 text-center mb-8">
          {method === 'email' && 'Enter the code sent to your email'}
          {method === 'authenticator' && 'Enter the code from your authenticator app'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Input
            label="Verification Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.slice(0, 6))}
            placeholder="Enter 6-digit code"
            maxLength="6"
            pattern="[0-9]{6}"
            required
          />

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full text-blue-600 hover:text-blue-700 font-semibold py-2"
          >
            Back to Login
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">Using a backup code?</p>
            <p>You can paste an 8-character backup code in the field above.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
