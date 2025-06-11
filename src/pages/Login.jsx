import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadCartFromDB } from '../utils/cartStorage';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://truescale.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);

        await loadCartFromDB();
        window.updateCartCount?.();

        navigate('/');
        window.location.reload();
      } else {
        toast.error(data.message || t("login.loginFailed"));
      }
    } catch (error) {
      toast.error(t("login.loginError"));
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          TrueScale
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          {t("login.subtitle")}
        </p>

        <input
          type="text"
          placeholder={t("login.email")}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("login.password")}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-md transition cursor-pointer"
        >
          {t("login.login")}
        </button>

        <p className="text-sm text-center text-gray-600 mt-3">
          <a
            href="/forgot-password"
            className="text-gray-900 hover:underline"
          >
            {t("login.forgot")}
          </a>
        </p>

        <p className="text-sm text-center text-gray-600 mt-4">
          {t("login.noAccount")}{' '}
          <Link to="/register" className="text-gray-900 hover:underline">
            {t("login.signUp")}
          </Link>
        </p>

        <p className="text-xs text-gray-400 text-center mt-6">
          © 2025 TrueScale. {t("login.rights")}
        </p>
      </form>
    </div>
  );
}

export default Login;
