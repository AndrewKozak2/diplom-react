import React, { useState, useEffect } from "react";
import { ShoppingCart, Truck, CheckCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    warehouse: "",
    phone: "",
    email: "",
  });

  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const deliveryCost = cart.length <= 5 ? 1.94 : 2.43;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".city-autocomplete")) setCities([]);
      if (!e.target.closest(".warehouse-autocomplete")) setWarehouses([]);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const total =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    deliveryCost;

  const fetchCities = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setCities([]);
      return;
    }
    try {
      const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "52a4484ea02a26983e729db187fc04fc",
          modelName: "Address",
          calledMethod: "getCities",
          methodProperties: { FindByString: searchTerm },
        }),
      });
      const data = await response.json();
      if (data.success) setCities(data.data);
    } catch (error) {
      console.error("Помилка запиту на Нову Пошту:", error);
    }
  };

  const fetchWarehouses = async (cityRef) => {
    try {
      const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "52a4484ea02a26983e729db187fc04fc",
          modelName: "Address",
          calledMethod: "getWarehouses",
          methodProperties: { CityRef: cityRef },
        }),
      });
      const data = await response.json();
      if (data.success) setWarehouses(data.data);
    } catch (error) {
      console.error("Помилка запиту відділень:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const formattedPhone = value.replace(/\D/g, "").slice(0, 12);
      setForm({ ...form, [name]: formattedPhone });
    } else {
      setForm({ ...form, [name]: value });
      if (name === "city") fetchCities(value);
    }
  };

  const validateForm = () => {
    if (!form.firstName.trim()) return alert("Введіть ім'я.");
    if (!form.lastName.trim()) return alert("Введіть прізвище.");
    if (!form.city.trim()) return alert("Виберіть місто.");
    if (!form.warehouse.trim()) return alert("Виберіть відділення.");
    if (!/^\d{10,12}$/.test(form.phone))
      return alert("Невірний номер телефону.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return alert("Невірний email.");
    return true;
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
        >
          <CheckCircle size={28} /> Замовлення успішно оформлено!
        </motion.div>
      ));
  
      try {
        await fetch('http://localhost:3000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...form,
            cart: cart,
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCost
          })
        });

        await fetch('http://localhost:3000/api/cart/clear', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
      } catch (error) {
        console.error('Помилка при оформленні замовлення або очищенні кошика:', error);
      }
  
      setForm({ firstName: "", lastName: "", city: "", warehouse: "", phone: "", email: "" });
      setCart([]);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      
      setTimeout(() => {
        navigate("/order-success");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-12 pb-10">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Оформлення замовлення
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative">
          <input
            type="text"
            name="firstName"
            placeholder="Ім'я"
            autoComplete="off"
            value={form.firstName}
            onChange={handleChange}
            className="border rounded-md px-4 py-3 w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Прізвище"
            autoComplete="off"
            value={form.lastName}
            onChange={handleChange}
            className="border rounded-md px-4 py-3 w-full"
          />
          <div className="relative">
            <input
              type="text"
              name="city"
              placeholder="Місто"
              autoComplete="off"
              value={form.city}
              onChange={handleChange}
              className="border rounded-md px-4 py-3 w-full"
            />
            {cities.length > 0 && (
              <div className="city-autocomplete absolute top-full left-0 right-0 bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg z-10">
                {cities.map((city) => (
                  <div
                    key={city.Ref}
                    onClick={() => {
                      setForm({ ...form, city: city.Description });
                      setCities([]);
                      fetchWarehouses(city.Ref);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {city.Description}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="warehouse"
              placeholder="№ відділення/поштомату"
              autoComplete="off"
              value={form.warehouse}
              onChange={handleChange}
              className="border rounded-md px-4 py-3 w-full"
            />
            {warehouses.length > 0 && (
              <div className="warehouse-autocomplete absolute top-full left-0 right-0 bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg z-10">
                {warehouses.map((wh) => (
                  <div
                    key={wh.Ref}
                    onClick={() => {
                      setForm({ ...form, warehouse: wh.Description });
                      setWarehouses([]);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {wh.Description}
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Телефон"
            autoComplete="off"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-md px-4 py-3 w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            value={form.email}
            onChange={handleChange}
            className="border rounded-md px-4 py-3 w-full"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart /> Товари в кошику:
          </h3>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">× {item.quantity}</p>
                </div>
              </div>
              <div className="font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="flex justify-between border-t pt-4 mt-4">
            <span className="font-medium flex items-center gap-2">
              <Truck /> Доставка:
            </span>
            <span>${deliveryCost.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mt-2 text-xl font-bold">
            <span>Разом:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg font-semibold transition"
          >
            Підтвердити замовлення
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
