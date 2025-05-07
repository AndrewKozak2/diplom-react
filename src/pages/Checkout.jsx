import React, { useEffect, useState } from "react";
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
  const [cities, setCities] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [cityRef, setCityRef] = useState("");
  const navigate = useNavigate();

  const deliveryCost = cart.length <= 5 ? 1.94 : 2.43;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            city: data.city || "",
            warehouse: data.warehouse || "",
            phone: data.phone || "",
            email: data.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching profile for checkout:", error);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".warehouse-autocomplete") &&
        !e.target.closest("input[name='warehouse']")
      ) {
        setWarehouses([]);
      }
      if (
        !e.target.closest(".city-autocomplete") &&
        !e.target.closest("input[name='city']")
      ) {
        setCities([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);



const handleConfirmClick = () => {
  if (validateForm()) {
    setShowPaypal(true);
  }
};



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
      console.error("Error fetching cities:", error);
    }
  };

  const fetchWarehouses = async (cityRef, searchTerm = "") => {
    try {
      const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "52a4484ea02a26983e729db187fc04fc",
          modelName: "Address",
          calledMethod: "getWarehouses",
          methodProperties: { CityRef: cityRef, FindByString: searchTerm },
        }),
      });
      const data = await response.json();
      if (data.success) setWarehouses(data.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "city") {
      fetchCities(value);
    }
  };

  const handleCitySelect = (city) => {
    setForm((prev) => ({ ...prev, city: city.Description, warehouse: "" }));
    setCities([]);
    setCityRef(city.Ref);
  };

  const handleWarehouseFocus = () => {
    if (cityRef) {
      fetchWarehouses(cityRef);
    }
  };

  const handleWarehouseInput = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, warehouse: value }));

    if (cityRef) {
      fetchWarehouses(cityRef, value);
    }
  };

  const validateForm = () => {
    if (!form.firstName.trim()) {
      toast.error("Enter your First Name.");
      return false;
    }
    if (!form.lastName.trim()) {
      toast.error("Enter your Last Name.");
      return false;
    }
    if (!form.city.trim()) {
      toast.error("Select a city.");
      return false;
    }
    if (!form.warehouse.trim()) {
      toast.error("Select a warehouse.");
      return false;
    }
    if (!/^\d{10,12}$/.test(form.phone)) {
      toast.error("Invalid phone number.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Invalid email.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const orderData = {
        ...form,
        cart: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCost,
      };
  
      console.log("🧾 Order data:", orderData);
  
      try {
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
  
        if (!res.ok) {
          const errText = await res.text();
          console.error("Server response:", errText);
          toast.error("Server error: " + errText);
          return;
        }
  
        await fetch("http://localhost:3000/api/cart/clear", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const limitedItem = cart.find(item =>
          item.limited === true &&
          item.name === "LB★Silhouette GT–R R35" &&
          item.brand === "MiniGT"
        );
  
        if (limitedItem) {
          try {
            await fetch("http://localhost:3000/api/limited/reduce", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                brand: limitedItem.brand,
                quantity: limitedItem.quantity || 1
              }),
            });
          } catch (err) {
            console.error("❌ Помилка при зменшенні кількості LimitedProduct:", err);
          }
        }
  
        toast.success("Order placed successfully!");
        setForm({ firstName: "", lastName: "", city: "", warehouse: "", phone: "", email: "" });
        setCart([]);
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        setTimeout(() => navigate("/order-success"), 1500);
      } catch (error) {
        console.error("Order submission error:", error);
        toast.error("Something went wrong. Check console.");
      }
    }
  }; 

  const total =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    deliveryCost;

  return (
    <div className="min-h-screen bg-gray-100 pt-12 pb-10">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* First Name */}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            autoComplete="off"
            className="border rounded-md px-4 py-3 w-full"
          />

          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            autoComplete="off"
            className="border rounded-md px-4 py-3 w-full"
          />

          {/* City */}
          <div className="relative">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              autoComplete="nope"
              className="border rounded-md px-4 py-3 w-full"
            />
            {cities.length > 0 && (
              <div className="city-autocomplete absolute top-full left-0 right-0 bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg z-10">
                {cities.map((city) => (
                  <div
                    key={city.Ref}
                    onClick={() => handleCitySelect(city)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {city.Description}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warehouse */}
          <div className="relative">
            <input
              type="text"
              name="warehouse"
              placeholder="Warehouse"
              value={form.warehouse}
              onFocus={handleWarehouseFocus}
              onChange={handleWarehouseInput}
              autoComplete="nope"
              className="border rounded-md px-4 py-3 w-full"
            />
            {warehouses.length > 0 && (
              <div className="warehouse-autocomplete absolute top-full left-0 right-0 bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg z-10">
                {warehouses
                  .filter((wh) => {
                    if (form.warehouse.trim() === "") return true;
                    const search = form.warehouse.trim();
                    const regex = new RegExp(`№\\s*${search}`, "i");
                    return regex.test(wh.Description);
                  })
                  .map((wh) => (
                    <div
                      key={wh.Ref}
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          warehouse: wh.Description,
                        }));
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

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            autoComplete="nope"
            className="border rounded-md px-4 py-3 w-full"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="nope"
            className="border rounded-md px-4 py-3 w-full"
          />
        </div>

        {/* Cart Summary */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart /> Items in Cart:
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
              <Truck /> Delivery:
            </span>
            <span>${deliveryCost.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mt-2 text-xl font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

<button
  onClick={handleSubmit}
  className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-md text-lg font-semibold transition"
>
  Confirm Order
</button>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
