import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/");
  };

  const handleCartClick = () => {
    if (typeof window.toggleCart === "function") {
      window.toggleCart();
    }
  };

  const isCheckout = location.pathname === "/checkout";

  return (
    <header
      className={`w-full z-50 flex justify-between items-center px-8 h-[100px] font-poppins transition-all duration-300 ${
        isCheckout
          ? "bg-gray-900 text-white shadow-md"
          : "absolute top-0 left-0 bg-black/20 backdrop-blur-sm text-white"
      }`}
    >
      <Link to="/" className="text-2xl font-bold">
        TrueScale
      </Link>

      <div className="flex items-center gap-4">
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
            <span className="bg-white text-black px-3 py-1 rounded">
              {username}
            </span>
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
