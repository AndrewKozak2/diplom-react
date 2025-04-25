import React, { useState, useEffect } from "react";

function LimitedDrop() {
  const initialStock = parseInt(localStorage.getItem("limitedStock")) || 10;
  const [stock, setStock] = useState(initialStock);

  useEffect(() => {
    localStorage.setItem("limitedStock", stock);
  }, [stock]);

  const product = {
    id: "limited-nissan-gt-r35",
    name: "LB★Silhouette GT–R R35",
    price: 550,
    image: "/images/nissanGTR(r35)Limited.png",
    scale: "1/64",
    brand: "MiniGT",
    limited: true
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white rounded-3xl shadow-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Ліва частина (текст) */}
          <div className="max-w-xl">
            <p className="uppercase text-pink-300 font-semibold mb-2 text-sm tracking-wider">
              Limited Edition
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              LB★Silhouette GT–R R35
            </h2>
            <p className="text-white/80 text-lg mb-4 leading-relaxed">
              Ultra-rare 1/64 scale model in Purple Metallic. A must-have for collectors and JDM lovers. Act fast — limited quantity!
            </p>
            <p className="text-white text-lg font-semibold mb-6">$550</p>
            <div className="flex items-center gap-6">
              <button
                onClick={handleAddToCart}
                className={`px-6 py-3 rounded-xl font-semibold transition bg-pink-600 hover:bg-pink-700 text-white`}
              >
                Buy Now
              </button>
              <span className="text-lg font-medium">{stock} left</span>
            </div>
          </div>

          {/* Права частина (зображення) */}
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
