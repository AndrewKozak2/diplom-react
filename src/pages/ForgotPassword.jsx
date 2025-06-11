import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSendCode = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://truescale.up.railway.app/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setCodeSent(true);
      } else {
        setError(t('forgot.sendFail'));
      }
    } catch (err) {
      setError(t('forgot.error'));
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://truescale.up.railway.app/api/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (res.ok) {
        navigate('/reset-password', { state: { email } });
      } else {
        setError(t('forgot.invalidCode'));
      }
    } catch (err) {
      setError(t('forgot.verificationFail'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={codeSent ? handleVerifyCode : handleSendCode}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {t('forgot.title')}
        </h2>

        {!codeSent ? (
          <>
            <p className="text-sm text-gray-500 text-center mb-4">
              {t('forgot.subtitle')}
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('forgot.email')}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-md transition"
            >
              {t('forgot.send')}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-center text-green-600 mb-4">
              {t('forgot.codeSent')}
            </p>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('forgot.codePlaceholder')}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest font-mono"
            />
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-md transition"
            >
              {t('forgot.verify')}
            </button>
          </>
        )}

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
