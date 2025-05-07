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
      className="fixed bottom-5 left-4 z-50 sm:hidden bg-black/60 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
    >
      <ShoppingCart size={20} className="text-white" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

export default FloatingCartButton;
