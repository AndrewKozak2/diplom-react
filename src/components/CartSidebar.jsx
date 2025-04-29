import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveCartToDB } from '../utils/cartStorage';

function CartSidebar({ isOpen, onClose }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('cart');
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
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    saveCartToDB();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    saveCartToDB();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex gap-4 items-start bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => (e.target.src = '/images/placeholder.svg')}
                  className="w-16 h-16 object-contain rounded bg-white"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-800 leading-snug mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-14 px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between items-end">
                  <p className="text-sm font-semibold text-gray-900">
                    ${item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total + Checkout */}
        <div className="p-5 border-t border-gray-100">
          <div className="flex justify-between text-base font-semibold text-gray-800 mb-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg transition hover:bg-gray-700 cursor-pointer disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}

export default CartSidebar;
