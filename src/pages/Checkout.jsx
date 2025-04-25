import React, { useState, useEffect } from 'react';

function Checkout() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    region: '',
    city: '',
    novaPoshta: '',
    phone: '',
    email: '',
  });

  const [cart, setCart] = useState([]);
  const deliveryFee = 1.94;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(saved);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = (total + deliveryFee).toFixed(2);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9\-\+\s\(\)]{7,20}$/;
    return (
      form.firstName &&
      form.lastName &&
      form.region &&
      form.city &&
      form.novaPoshta &&
      phoneRegex.test(form.phone) &&
      emailRegex.test(form.email)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Будь ласка, заповніть всі поля коректно!');
      return;
    }

    console.log('Order submitted:', form, cart);
    localStorage.removeItem('cart');
    window.location.href = '/';
  };

  return (
<section className="min-h-screen bg-gray-100 pt-[120px] px-4 pb-16">
  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
    <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Оформлення замовлення
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="Ім’я"
              className="input"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Прізвище"
              className="input"
              value={form.lastName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="region"
              placeholder="Область"
              className="input"
              value={form.region}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="Місто"
              className="input"
              value={form.city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="novaPoshta"
              placeholder="№ відділення Нової Пошти"
              className="input"
              value={form.novaPoshta}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Телефон"
              className="input"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input w-full"
            value={form.email}
            onChange={handleChange}
          />

          <hr className="my-6" />

          <div>
            <h3 className="font-bold text-lg mb-2">🛒 Товари в кошику:</h3>
            <ul className="text-sm text-gray-700 mb-2">
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity} — ${item.price * item.quantity}
                </li>
              ))}
            </ul>

            <div className="flex justify-between border-t pt-3 text-sm">
              <span>🚚 Доставка:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Разом:</span>
              <span>${grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Підтвердити замовлення
          </button>
        </form>
      </div>
    </section>
  );
}

export default Checkout;
