import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const { t } = useTranslation();

  const loadFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    fetch("https://truescale.up.railway.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products || data;
        const favoriteItems = allProducts.filter((product) =>
          storedFavorites.includes(product._id || product.id)
        );
        const normalized = favoriteItems.map((p) => ({
          ...p,
          id: p._id || p.id,
        }));
        setFavorites(normalized);
      })
      .catch((err) => console.error("Failed to load favorites:", err));
  };

  useEffect(() => {
    loadFavorites();

    const handleUpdate = () => loadFavorites();
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  const handleAddToCart = (product) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = savedCart.find((item) => item.id === product.id);

    let updatedCart;
    if (existing) {
      updatedCart = savedCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...savedCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.updateCartCount?.();
  };

  return (
    <section className="pt-20 pb-12 px-4 min-h-screen bg-gray-100">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="text-4xl font-bold text-center mb-2 text-gray-800">
          {t("favorites.title")}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {t("favorites.description")}
        </p>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            {t("favorites.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
            {favorites.map((model) => (
              <ProductCard
                key={model.id}
                model={model}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Favorites;
