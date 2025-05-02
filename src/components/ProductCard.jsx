import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Pencil } from "lucide-react";
import EditProductModal from "./EditProductModal";

function ProductCard({ model, onAddToCart }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [localModel, setLocalModel] = useState(model);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(saved.includes(model.id));

    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
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

  const handleEditSave = (updatedProduct) => {
    setLocalModel({ ...updatedProduct, id: updatedProduct._id });
  };

  const isOutOfStock = localModel.inStock === false;

  return (
    <div
      className={`relative border rounded-xl shadow-sm p-3 text-gray-800 flex flex-col justify-between transition w-[300px] min-h-[360px] ${
        isOutOfStock && !showEditModal ?  "bg-gray-100 opacity-60" : "bg-white hover:shadow-md"
      }`}
    >
      {/* Іконка редагування (адмін) */}
      <div className="flex items-center justify-between mb-2">
  <div className="flex items-center gap-2">
    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
      {localModel.brand}
    </span>
    {isAdmin && (
      <button
        onClick={() => setShowEditModal(true)}
        className="bg-white rounded-full p-1 shadow hover:bg-gray-200 transition"
        title="Edit"
      >
        <Pencil size={16} className="text-gray-700" />
      </button>
    )}
  </div>
  <button
    onClick={toggleFavorite}
    className="text-gray-400 hover:text-red-500 transition"
  >
    <Heart
      size={16}
      className={isFavorite ? "fill-red-500 text-red-500" : ""}
    />
  </button>
</div>


      {/* Зображення */}
      <img
        src={localModel.image}
        alt={localModel.name}
        onError={(e) => (e.target.src = "/images/placeholder.svg")}
        className="w-full h-[180px] object-contain rounded mb-2"
      />

      {/* Інформація */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold leading-tight mb-1">
          {localModel.name}
        </h3>
        <p className="text-xs text-gray-500 mb-1">Scale: 1/64</p>
        <p className="text-base font-bold text-gray-900">${localModel.price}</p>
        {localModel.inStock ? (
          <span className="inline-block text-green-600 text-xs font-medium mt-1">
            ✔ In stock
          </span>
        ) : (
          <span className="inline-block text-red-500 text-xs font-medium mt-1">
            ✖ Out of stock
          </span>
        )}
      </div>

      {/* Кнопка додавання в кошик */}
      <button
        onClick={() => onAddToCart(localModel)}
        disabled={isOutOfStock}
        className={`w-full py-2 rounded-md text-xs font-medium transition flex items-center justify-center gap-4 cursor-pointer ${
          isOutOfStock
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <ShoppingCart size={20} /> Add to Cart
      </button>

      {/* Модалка редагування */}
      {showEditModal && (
        <EditProductModal
          product={localModel}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default ProductCard;
