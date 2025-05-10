import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import EditProductModal from "./EditProductModal";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function ProductCard({ model, onAddToCart }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [localModel, setLocalModel] = useState(model);
  const [sliderRef, instanceRef] = useKeenSlider({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const getFullImagePath = (src) => {
    if (!src) return "/images/placeholder.svg";
    if (src.startsWith("http")) return src;
    const path = src.startsWith("/") ? src : `/${src}`;
    return `${backendURL}${path.replace(/^\/+/, "/")}`;
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(saved.includes(model.id));
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, [model.id]);

  useEffect(() => {
    if (!instanceRef.current) return;
    instanceRef.current.on("slideChanged", (slider) => {
      setCurrentSlide(slider.track.details.rel);
    });
  }, [instanceRef]);

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
  const images = localModel.images?.length > 0 ? localModel.images : [localModel.image];

  return (
    <div className="relative border rounded-xl shadow-sm p-4 text-gray-800 flex flex-col justify-between transition w-full max-w-[300px] min-h-[430px] bg-white hover:shadow-md group mx-auto">
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

      <div className="relative w-full h-[180px] rounded mb-2 overflow-hidden">
        <div ref={sliderRef} className="keen-slider w-full h-full">
          {images.map((src, idx) => (
            <div className="keen-slider__slide flex items-center justify-center" key={idx}>
              <img
                src={getFullImagePath(src)}
                alt={localModel.name}
                onError={(e) => (e.target.src = "/images/placeholder.svg")}
                className="object-contain h-full max-w-full rounded"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full cursor-pointer transition ${
                  idx === currentSlide
                    ? "bg-gray-800"
                    : "bg-gray-300 group-hover:bg-gray-400"
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
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

      <button
        onClick={() =>
          onAddToCart({
            id: localModel.id,
            name: localModel.name,
            price: localModel.price,
            images: localModel.images || [],
          })
        }
        disabled={isOutOfStock}
        className={`w-full py-2 rounded-md text-xs font-medium transition flex items-center justify-center gap-4 cursor-pointer
          ${
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white active:scale-95 active:bg-gray-900 active:text-white"
          }
        `}
      >
        <ShoppingCart size={20} /> Add to Cart
      </button>

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
