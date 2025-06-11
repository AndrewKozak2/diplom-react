import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://truescale.up.railway.app/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success(t('reset.success'));
        setTimeout(() => navigate('/login'), 3000);
      } else {
        toast.error(t('reset.fail'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('reset.error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {t('reset.title')}
        </h2>

        {success ? (
          <p className="text-green-600 text-center">
            {t('reset.redirect')}
          </p>
        ) : (
          <>
            <input
              type="password"
              placeholder={t('reset.newPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-md transition"
            >
              {t('reset.update')}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;
