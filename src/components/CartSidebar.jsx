import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveCartToDB } from "../utils/cartStorage";
import { useTranslation } from "react-i18next";

function CartSidebar({ isOpen, onClose }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    try {
      const parsed = JSON.parse(saved) || [];
      setCart(Array.isArray(parsed) ? parsed : []);
    } catch {
      setCart([]);
    }
  }, [isOpen]);

  useEffect(() => {
    window.updateCartCount?.();
  }, [cart]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    saveCartToDB();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id, newQty) => {
    if (isNaN(newQty) || newQty <= 0) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    saveCartToDB();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white z-50 shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-5 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{t("cart.title")}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-190px)] sm:max-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">{t("cart.empty")}</p>
          ) : (
            cart.map((item, index) => (
              <div
                key={item.id || `${item.name}-${index}`}
                className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-3 sm:gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 items-center"
              >
                <img
                  src={
                    item.image?.startsWith("data:image/")
                      ? item.image
                      : item.image?.startsWith("/images/")
                      ? `https://truescale.up.railway.app${item.image}`
                      : item.image?.startsWith("/uploads/")
                      ? `https://truescale.up.railway.app${item.image}`
                      : item.images?.[0]
                      ? item.images[0].startsWith("http")
                        ? item.images[0]
                        : `https://truescale.up.railway.app${item.images[0]}`
                      : item.image?.startsWith("http")
                      ? item.image
                      : `https://truescale.up.railway.app${item.image}`
                  }
                  alt={item.name}
                  onError={(e) => (e.target.src = "/images/placeholder.svg")}
                  className="h-16 w-16 object-cover rounded shrink-0"
                />

                <div className="flex flex-col justify-between min-w-0">
                  <h4
                    className="font-medium text-sm text-gray-800 leading-snug mb-1 line-clamp-2"
                    title={item.name}
                  >
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 whitespace-nowrap">
                      {t("cart.qty")}:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity || 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const safeQty = isNaN(val)
                          ? 1
                          : Math.min(99, Math.max(1, val));
                        updateQuantity(item.id, safeQty);
                      }}
                      className="w-14 px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end w-full min-w-[75px] pr-1">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 hover:underline whitespace-nowrap mt-1"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-gray-100">
          <div className="flex justify-between text-base font-semibold text-gray-800 mb-4">
            <span>{t("cart.total")}:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-gray-900 text-white py-2 rounded-lg sm:py-2.5 transition hover:bg-gray-700 cursor-pointer disabled:opacity-50"
          >
            {t("cart.checkout")}
          </button>
        </div>
      </div>
    </>
  );
}

export default CartSidebar;
