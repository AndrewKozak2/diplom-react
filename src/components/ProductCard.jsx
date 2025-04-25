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
    let updated;
    if (saved.includes(model.id)) {
      updated = saved.filter((id) => id !== model.id);
    } else {
      updated = [...saved, model.id];
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-lg p-4 text-white relative flex flex-col justify-between">
      {/* Бренд і серце */}
      <div className="flex items-center justify-between mb-2">
        <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full">
          {model.brand.toUpperCase()}
        </span>
        <button
          onClick={toggleFavorite}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} size={20} />
        </button>
      </div>

      {/* Фото */}
      <img
        src={model.image}
        alt={model.name}
        onError={(e) => (e.target.src = "/images/placeholder.svg")}
        className="w-full h-40 object-contain rounded mb-3"
      />

      {/* Назва, масштаб, ціна */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1 text-white">{model.name}</h3>
        <p className="text-sm text-gray-300 mb-1">Scale: {model.scale}</p>
        <p className="text-lg font-bold text-blue-400">${model.price}</p>
      </div>

      {/* Кнопка "Add to Cart" */}
      <button
        onClick={() => onAddToCart(model)}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
      >
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;