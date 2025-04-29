import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";

function ProductCard({ model, onAddToCart }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(saved.includes(model.id));
  }, [model.id]);

  const toggleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    const updated = saved.includes(model.id)
      ? saved.filter((id) => id !== model.id)
      : [...saved, model.id];

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 text-gray-800 flex flex-col justify-between transition hover:shadow-md w-[300px] min-h-[360px]">
      <div className="flex items-center justify-between mb-2">
        <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {model.brand}
        </span>
        <button
          onClick={toggleFavorite}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>

      <img
        src={model.image}
        alt={model.name}
        onError={(e) => (e.target.src = "/images/placeholder.svg")}
        className="w-full h-[180px] object-contain rounded mb-2"
      />

      <div className="mb-2">
        <h3 className="text-sm font-semibold leading-tight mb-1">{model.name}</h3>
        <p className="text-xs text-gray-500 mb-1">Scale: 1/64</p>
        <p className="text-base font-bold text-gray-900">${model.price}</p>
      </div>

      <button
        onClick={() => onAddToCart(model)}
        className="bg-white border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white w-full py-2 rounded-md text-xs font-medium transition flex items-center justify-center gap-4 cursor-pointer"
      >
        <ShoppingCart size={20} /> Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
