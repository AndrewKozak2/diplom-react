import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setCodeSent(true);
      } else {
        setError('Failed to send code.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (res.ok) {
        navigate('/reset-password', { state: { email } });
      } else {
        setError('Invalid code.');
      }
    } catch (err) {
      setError('Verification failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={codeSent ? handleVerifyCode : handleSendCode}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Forgot Password</h2>

        {!codeSent ? (
          <>
            <p className="text-sm text-gray-500 text-center mb-4">
              Enter your email and we'll send you a 6-digit reset code.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-md transition"
            >
              Send Reset Code
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-center text-green-600 mb-4">
              If an account with that email exists, a reset code was sent.
            </p>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest font-mono"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-md transition"
            >
              Verify Code
            </button>
          </>
        )}

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;