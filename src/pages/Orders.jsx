import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data || []);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600 text-lg mt-24">
        <Loader className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600 text-lg mt-24">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
        My Orders
      </h2>
      <div className="space-y-8">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border rounded-xl p-4 sm:p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Order{" "}
                <span className="text-blue-600">#{order._id.slice(-5)}</span>
              </h3>
              <p className="text-sm text-gray-500 mt-1 sm:mt-0">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-4">
              {order.cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-4 last:border-none"
                >
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.name}
                      {item.bonus && (
                        <span className="ml-2 text-sm text-yellow-500 font-semibold">
                          🎁 Gift
                        </span>
                      )}
                    </p>
                    <p className="text-gray-500 text-sm">× {item.quantity}</p>
                  </div>
                  <div className="font-bold text-gray-700 text-sm sm:text-base">
                    {item.price === 0
                      ? "FREE"
                      : `$${(item.price * item.quantity).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t gap-2">
              <span className="text-base font-semibold text-gray-700">
                Total:
              </span>
              <span className="text-lg font-bold text-blue-600">
                ${order.total.toFixed(2)}
              </span>
            </div>

            {order.promoCode && (
              <p className="text-sm text-gray-500 italic mt-2">
                Promo code used:{" "}
                <span className="text-blue-600 font-medium">
                  {order.promoCode}
                </span>
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
