import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, UserRound, PackageCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const darkHeaderPages = ["/checkout", "/favorites", "/account", "/orders"];
  const isDarkHeader = darkHeaderPages.includes(location.pathname);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    const updateUsername = () => {
      setUsername(localStorage.getItem("username") || "");
    };

    updateCartCount();
    updateUsername();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateUsername);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateUsername);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleCartClick = () => {
    if (typeof window.toggleCart === "function") {
      window.toggleCart();
    }
  };

  return (
    <header
      className={`w-full z-50 flex justify-between items-center px-4 sm:px-6 md:px-10 h-[100px] transition-all duration-300 ${
        isDarkHeader
          ? "bg-gray-900 text-white shadow-md"
          : "absolute top-0 left-0 bg-black/20 backdrop-blur-sm text-white"
      }`}
    >
      <Link to="/" className="flex items-center">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-20 md:h-[104px] object-contain"
        />
      </Link>

      <div className="hidden md:flex flex-wrap items-center gap-2 justify-end max-w-full">
        <Link
          to="/about"
          className="px-3 py-1.5 rounded-md hover:bg-gray-700 text-white transition"
        >
          {t("header.about")}
        </Link>
        <Link
          to="/configurator"
          className="px-3 py-1.5 rounded-md hover:bg-gray-700 text-white transition"
        >
          {t("header.configurator")}
        </Link>
        <Link
          to="/favorites"
          className="px-3 py-1.5 rounded-md hover:bg-gray-700 text-white transition"
        >
          {t("header.favorites")}
        </Link>

        {token ? (
          <>
            {role === "admin" && (
              <button
                className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition"
                onClick={() => window.showAddProductForm?.()}
              >
                {t("header.addProduct")}
              </button>
            )}

            {role === "admin" && (
              <Link
                to="/admin/promo"
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                {t("header.promoPanel")}
              </Link>
            )}
            {role === "admin" && (
              <Link
                to="/admin/stats"
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                {t("header.stats")}
              </Link>
            )}

            <div
              className="relative"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button className="flex items-center gap-2 bg-white text-black px-3 py-1 rounded hover:bg-gray-100">
                <User size={20} />
                {username || t("header.account")}
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden"
                  >
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserRound size={18} /> {t("header.account")}
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <PackageCheck size={18} /> {t("header.orders")}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition"
            >
              {t("header.logout")}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-md hover:bg-gray-700 text-white transition"
            >
              {t("header.login")}
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-md hover:bg-gray-700 text-white transition"
            >
              {t("header.signup")}
            </Link>
          </>
        )}

        <button
          onClick={handleCartClick}
          className="relative p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <select
          value={i18n.language}
          onChange={(e) => {
            const lang = e.target.value;
            localStorage.setItem("lang", lang);
            i18n.changeLanguage(lang);
          }}
          className="px-3 py-2 rounded bg-gray-800 text-white"
        >
          <option value="ua">UA</option>
          <option value="en">EN</option>
        </select>
      </div>

      <div className="md:hidden">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 rounded-md focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[100px] left-0 w-full bg-gray-900 z-40 flex flex-col items-center gap-4 py-6 md:hidden"
          >
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              {t("header.about")}
            </Link>
            <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>
              {t("header.favorites")}
            </Link>
            <Link to="/configurator" onClick={() => setMobileMenuOpen(false)}>
              {t("header.configurator")}
            </Link>
            {token ? (
              <>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                  {t("header.account")}
                </Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                  {t("header.orders")}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  {t("header.logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  {t("header.login")}
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  {t("header.signup")}
                </Link>
              </>
            )}

            <select
              value={i18n.language}
              onChange={(e) => {
                const lang = e.target.value;
                localStorage.setItem("lang", lang);
                i18n.changeLanguage(lang);
              }}
              className="px-3 py-2 rounded bg-white text-black text-sm mt-2"
            >
              <option value="ua">UA</option>
              <option value="en">EN</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
