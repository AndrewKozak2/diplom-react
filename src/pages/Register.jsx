import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return;
    }

    try {
      const res = await fetch('https://truescale.up.railway.app/api/register-temp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/verify-email', { state: { email } });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {t("register.title")}
        </h2>

        <input
          type="text"
          placeholder={t("register.username")}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder={t("register.email")}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("register.password")}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("register.confirm")}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-md transition cursor-pointer"
        >
          {t("register.register")}
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          {t("register.haveAccount")}{" "}
          <Link to="/login" className="text-gray-900 hover:underline">
            {t("register.login")}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
