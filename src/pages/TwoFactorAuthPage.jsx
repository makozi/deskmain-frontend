import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Input, Button, Modal } from '../components/ui';

export default function TwoFactorAuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('email'); // email, authenticator
  const [step, setStep] = useState(1); // 1: method selection, 2: setup, 3: verification
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const handleMethodSelect = async (selectedMethod) => {
    try {
      setLoading(true);
      setError('');
      setMethod(selectedMethod);

      const response = await api.post('/auth/setup-2fa', {
        method: selectedMethod,
      });

      if (selectedMethod === 'authenticator') {
        setQrCode(response.data.qr_code);
        setSecret(response.data.secret);
      }

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async (e) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setError('Verification code is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await api.post('/auth/verify-2fa-setup', {
        code: verificationCode,
      });

      setBackupCodes(response.data.backup_codes);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBackupCodes = () => {
    const text = backupCodes.join('\n');
    navigator.clipboard.writeText(text);
  };

  const handleDownloadBackupCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Set Up Two-Factor Authentication
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Choose how you want to secure your account
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleMethodSelect('email')}
                disabled={loading}
                className="w-full p-4 border-2 border-gray-300 hover:border-blue-500 rounded-lg text-left transition-colors disabled:opacity-50"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Email Code</h3>
                <p className="text-gray-600 text-sm">Receive a code via email when you log in</p>
              </button>

              <button
                onClick={() => handleMethodSelect('authenticator')}
                disabled={loading}
                className="w-full p-4 border-2 border-gray-300 hover:border-blue-500 rounded-lg text-left transition-colors disabled:opacity-50"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Authenticator App</h3>
                <p className="text-gray-600 text-sm">Use Google Authenticator or similar app</p>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full text-blue-600 hover:text-blue-700 font-semibold py-2"
              >
                Skip for Now
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Verify {method === 'email' ? 'Email' : 'Authenticator'}
            </h1>

            {method === 'authenticator' && qrCode && (
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-4">
                  Scan this code with your authenticator app:
                </p>
                <div className="flex justify-center mb-4">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-gray-600 text-xs mb-1">Or enter this code manually:</p>
                  <p className="font-mono text-sm font-bold">{secret}</p>
                </div>
              </div>
            )}

            {method === 'email' && (
              <p className="text-gray-600 text-sm mb-6">
                We've sent a verification code to your email. Enter it below:
              </p>
            )}

            <form onSubmit={handleVerifySetup} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Input
                label="Verification Code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Save Your Backup Codes
            </h1>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm font-semibold mb-2">⚠️ Important</p>
              <p className="text-red-700 text-sm">
                Save these codes in a safe place. You can use them to access your account if you lose access to your 2FA method.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="py-1">
                  {code}
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={handleCopyBackupCodes}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Copy Codes
              </button>
              <button
                onClick={handleDownloadBackupCodes}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Download Codes
              </button>
            </div>

            <button
              onClick={handleComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
