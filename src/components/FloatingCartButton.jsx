import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useLocation } from "react-router-dom";

function FloatingCartButton() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCount(totalCount);
    };
    update();
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  const handleClick = () => {
    if (typeof window.toggleCart === "function") {
      window.toggleCart();
    }
  };

  if (location.pathname !== "/") return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 left-4 z-50 bg-black text-white rounded-full shadow-xl p-4 sm:hidden"
    >
      <ShoppingCart size={20} />
      {count > 0 && (
        <span className="ml-1 text-xs font-medium">{count}</span>
      )}
    </button>
  );
}

export default FloatingCartButton;
