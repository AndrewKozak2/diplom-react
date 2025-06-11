import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Truck,
  CheckCircle,
  ShieldCheck,
  Info,
  Calendar,
  Lock,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";
import CapsuleModal from "../components/CapsuleModal";
import { useTranslation } from "react-i18next";

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
  const [showPayment, setShowPayment] = useState(false);
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);
  const [showCapsule, setShowCapsule] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    };

    updateCart();

    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://truescale.up.railway.app/api/user/profile", {
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
  const handlePromoApply = () => {
    const code = promo.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code === code);
    if (found) {
      const now = new Date();
      const expired = found.expiresAt && new Date(found.expiresAt) < now;
      const limitReached = found.maxUsage && found.usageCount >= found.maxUsage;

      if (expired) {
        toast.error(t("checkout.promoExpired"));
        return;
      }

      if (limitReached) {
        toast.error(t("checkout.promoLimit"));
        return;
      }

      setAppliedPromo({ ...found, code });
      toast.success(t("checkout.promoApplied", { code }));
    } else {
      setAppliedPromo(null);
      toast.error(t("checkout.invalidPromo"));
    }
  };

  useEffect(() => {
    async function loadPromoCodes() {
      try {
        const res = await fetch("https://truescale.up.railway.app/api/promocodes/public");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPromoCodes(data);
        } else {
          console.warn("Promo API response not array:", data);
          setPromoCodes([]);
        }
      } catch (err) {
        console.error("❌ Error loading promo codes:", err);
        setPromoCodes([]);
      }
    }
    loadPromoCodes();
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
      toast.error(t("checkout.firstNameError"));
      return false;
    }
    if (!form.lastName.trim()) {
      toast.error(t("checkout.lastNameError"));
      return false;
    }
    if (!form.city.trim()) {
      toast.error(t("checkout.cityError"));
      return false;
    }
    if (!form.warehouse.trim()) {
      toast.error(t("checkout.warehouseError"));
      return false;
    }
    if (!/^\d{10,12}$/.test(form.phone)) {
      toast.error(t("checkout.phoneError"));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error(t("checkout.emailError"));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const orderData = {
        ...form,
        cart: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.images?.[0] || "",
          images: item.images || [],
          color: item.color || null,
          wheelColor: item.wheelColor || null, 
          bonus: item.bonus || false,
        })),
        total,
        promoCode: appliedPromo?.code || null,
      };

      try {
        console.log("🛒 Sending cart to backend:", cart);
        const res = await fetch("https://truescale.up.railway.app/api/orders", {
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

        await fetch("https://truescale.up.railway.app/api/cart/clear", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const limitedItem = cart.find(
          (item) =>
            item.limited === true &&
            item.name === "LB★Silhouette GT–R R35" &&
            item.brand === "MiniGT"
        );

        if (limitedItem) {
          try {
            await fetch("https://truescale.up.railway.app/api/limited/reduce", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                brand: limitedItem.brand,
                quantity: limitedItem.quantity || 1,
              }),
            });
          } catch (err) {
            console.error(
              "❌ Помилка при зменшенні кількості LimitedProduct:",
              err
            );
          }
        }

        toast.success(t("checkout.success"));
        setForm({
          firstName: "",
          lastName: "",
          city: "",
          warehouse: "",
          phone: "",
          email: "",
        });
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

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const baseDelivery = cart.length <= 5 ? 1.94 : 2.43;

  const discount =
    appliedPromo?.type === "percent"
      ? (subtotal * appliedPromo.value) / 100
      : appliedPromo?.type === "fixed"
      ? appliedPromo.value
      : appliedPromo?.type === "shipping"
      ? baseDelivery
      : 0;

  const deliveryCost = appliedPromo?.type === "shipping" ? 0 : baseDelivery;
  const total = subtotal - discount + deliveryCost;

  return (
    <div className="min-h-screen bg-gray-100 pt-12 pb-10">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <p className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md px-4 py-2 mb-6 text-center">
          <Info size={16} /> {t("checkout.notice")}
        </p>

        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("checkout.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* First Name */}
          <input
            type="text"
            name="firstName"
            placeholder={t("checkout.firstName")}
            value={form.firstName}
            onChange={handleChange}
            autoComplete="off"
            className="border rounded-md px-4 py-3 w-full"
          />

          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            placeholder={t("checkout.lastName")}
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
              placeholder={t("checkout.city")}
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
              placeholder={t("checkout.warehouse")}
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
            placeholder={t("checkout.phone")}
            value={form.phone}
            onChange={handleChange}
            autoComplete="nope"
            className="border rounded-md px-4 py-3 w-full"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder={t("checkout.email")}
            value={form.email}
            onChange={handleChange}
            autoComplete="nope"
            className="border rounded-md px-4 py-3 w-full"
          />
        </div>

        {/* Cart Summary */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart /> {t("checkout.itemsInCart")}
          </h3>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.images?.[0] || item.image}
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
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder={t("checkout.promoPlaceholder")}
              className="border rounded-md px-4 py-2 w-full sm:w-64"
            />
            <button
              onClick={handlePromoApply}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
            >
              {t("checkout.apply")}
            </button>
          </div>
          {appliedPromo && (
            <div className="flex justify-between text-green-600 mt-2">
              <span>
                {t("checkout.promoCode")} ({appliedPromo.code})
              </span>
              <span>- ${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-4">
            <button
              onClick={() => setShowCapsule(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              {t("checkout.openCapsule")}
            </button>
          </div>

          {showCapsule && (
            <CapsuleModal
              total={total}
              onClose={() => setShowCapsule(false)}
              onDrop={(model) => {
                toast.success(`${t("checkout.youGot")}: ${model.name}`);
              }}
            />
          )}

          <div className="flex justify-between border-t pt-4 mt-4">
            <span className="font-medium flex items-center gap-2">
              <Truck /> {t("checkout.delivery")}:
            </span>
            <span>${deliveryCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-2 text-xl font-bold">
            <span>{t("checkout.total")}:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600 italic text-center mt-4 mb-2">
            {t("checkout.paymentNotice")}
          </p>

          <button
            onClick={() => {
              if (validateForm()) {
                setShowPayment(true);
              }
            }}
            className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-md text-lg font-semibold transition"
          >
            {t("checkout.confirmOrder")}
          </button>
          <p className="flex items-center justify-center gap-2 text-xs text-gray-500 text-center mt-1">
            <Lock size={14} /> {t("checkout.securePayment")}
          </p>

          {showPayment && (
            <PaymentModal
              total={total}
              onClose={() => setShowPayment(false)}
              onOrderSuccess={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
