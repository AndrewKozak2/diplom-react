import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function VerifyEmail() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const email = location.state?.email;

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await res.json();
        setError(data.message || t('verify.fail'));
      }
    } catch (err) {
      setError(t('verify.error'));
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/register-temp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setResendTimer(60);
        setError('');
      } else {
        setError(t('verify.resendFail'));
      }
    } catch (err) {
      setError(t('verify.error'));
    }
  };

  if (!email) {
    return (
      <p className="text-center mt-20 text-gray-600">
        {t("verify.noEmail")}
      </p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleVerify}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {t("verify.title", { email })}
        </h2>

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("verify.placeholder")}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-md transition"
        >
          {t("verify.button")}
        </button>

        <div className="text-center mt-4 text-sm">
          {resendTimer > 0 ? (
            <p className="text-gray-500">
              {t("verify.resendWait")} <span className="font-medium">{resendTimer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-gray-900 hover:underline"
            >
              {t("verify.resend")}
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm text-center mt-4">
            {t("verify.success")}
          </p>
        )}
      </form>
    </div>
  );
}

export default VerifyEmail;
