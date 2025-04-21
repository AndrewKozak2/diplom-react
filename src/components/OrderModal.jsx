import React, { useState } from 'react';

function OrderModal({ isOpen, onClose, cart }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://truescale-backend.onrender.com/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items: cart }),
    });

    if (response.ok) {
      setSuccess(true);
      localStorage.removeItem('cart');
      window.updateCartCount?.();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
        {success ? (
          <h2 className="text-xl text-green-600 font-bold text-center">Ваше замовлення прийнято!</h2>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Оформити замовлення</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Ваше ім’я"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Надіслати замовлення
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-500 underline block w-full mt-2"
              >
                Скасувати
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderModal;
