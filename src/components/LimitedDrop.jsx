import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function LimitedDrop() {
  const [product, setProduct] = useState(null);
  const { t } = useTranslation();

  const fetchLimitedProduct = async () => {
    try {
      const res = await fetch("https://truescale.up.railway.app/api/limited");
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Error loading limited product", err);
    }
  };

  useEffect(() => {
    fetchLimitedProduct();
  }, []);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        brand: product.brand,
        scale: "1/64",
        images: product.image ? [product.image] : [],
        limited: true,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    fetchLimitedProduct();
  };

  if (!product)
    return <div className="text-center py-20 text-white">{t("limited.loading")}</div>;

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white rounded-3xl shadow-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Ліва частина */}
          <div className="max-w-xl">
            <p className="uppercase text-pink-300 font-semibold mb-2 text-sm tracking-wider">
              {t("limited.badge")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {product.name}
            </h2>
            <p className="text-white/80 text-lg mb-4 leading-relaxed">
              {product.description}
            </p>
            <p className="text-white text-lg font-semibold mb-6">
              ${product.price}
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={handleAddToCart}
                className={`px-6 py-3 rounded-xl font-semibold transition bg-pink-600 hover:bg-pink-700 text-white`}
                disabled={product.countInStock <= 0}
              >
                {product.countInStock > 0
                  ? t("limited.buyNow")
                  : t("limited.outOfStock")}
              </button>
              <span className="text-lg font-medium">
                {product.countInStock > 0
                  ? t("limited.left", { count: product.countInStock })
                  : t("limited.soldOut")}
              </span>
            </div>
          </div>

          {/* Права частина */}
          <div className="w-full md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md mx-auto rounded-2xl shadow-xl object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LimitedDrop;
