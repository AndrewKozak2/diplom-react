import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

function ProductCard({ model, onAddToCart }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(saved.includes(model.id));
  }, [model.id]);

  const toggleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem('favorites')) || [];
    let updated;
    if (saved.includes(model.id)) {
      updated = saved.filter((id) => id !== model.id);
    } else {
      updated = [...saved, model.id];
    }
    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    window.refreshFavorites?.();
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="max-w-sm w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col items-center relative">
      <img
        src={model.image}
        alt={model.name}
        onError={(e) => (e.target.src = '/images/placeholder.svg')}
        className="w-full h-40 object-contain rounded mb-4 bg-gray-50"
      />

      <h3 className="text-center text-base font-semibold text-gray-900 mb-1">
        {model.name}
      </h3>
      <p className="text-sm text-gray-500 mb-1">Scale: {model.scale}</p>
      <p className="text-blue-600 text-base font-bold mb-4">${model.price}</p>

      <div className="flex justify-between items-center w-full mt-auto">
        <button
          onClick={() => onAddToCart(model)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium flex-1 mr-2"
        >
          Add to Cart
        </button>
        <button
          onClick={toggleFavorite}
          className="text-gray-400 hover:text-red-500 transition"
          title="Add to favorites"
        >
          {isFavorite ? (
            <Heart className="fill-red-500 text-red-500" size={18} />
          ) : (
            <Heart size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
