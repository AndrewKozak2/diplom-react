import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, UserRound, PackageCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isCheckout = location.pathname === "/checkout";

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
      className={`w-full z-50 flex justify-between items-center px-8 h-[100px] font-poppins transition-all duration-300
      ${isCheckout 
        ? "bg-gray-900 text-white shadow-md" 
        : "absolute top-0 left-0 bg-black/20 backdrop-blur-sm text-white"}`}
    >
      <Link to="/" className="text-2xl font-bold">
        TrueScale
      </Link>

      <div className="flex items-center gap-4 relative">
        <Link
          to="/about"
          className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          About
        </Link>

        <Link
          to="/favorites"
          className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Favorites
        </Link>

        {token ? (
          <>
            {role === "admin" && (
              <button
                className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
                onClick={() => window.showAddProductForm?.()}
              >
                Add Product
              </button>
            )}
            <div
              className="relative"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button className="flex items-center gap-2 bg-white text-black px-3 py-1 rounded hover:bg-gray-100">
                <User size={20} />
                {username || "Profile"}
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
                      <UserRound size={18} />
                      My Account
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <PackageCheck size={18} />
                      My Orders
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Register
            </Link>
          </>
        )}

        <button
          onClick={handleCartClick}
          className="relative ml-2 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
