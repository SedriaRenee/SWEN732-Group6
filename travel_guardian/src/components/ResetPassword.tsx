'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Missing or invalid reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage('Missing reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      if (res.ok) {
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setMessage('An error occurred while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-extrabold text-center">Travel Guardian</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {message && (
          <p
            className={`text-center mb-4 font-medium ${
              message.toLowerCase().includes('success') || message.toLowerCase().includes('reset')
                ? 'text-green-600'
                : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        {token ? (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
              required
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div className="text-center text-red-500 font-medium">{message}</div>
        )}

        <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
          <p>
            Remembered your password?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
          <p>
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
