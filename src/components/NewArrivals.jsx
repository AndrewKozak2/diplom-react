import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function NewArrivals() {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.products || data)
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setLatest(sorted);
      })
      .catch((err) => console.error("Error loading new arrivals:", err));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        New Arrivals
      </h2>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {latest.map((model, index) => (
          <motion.div
            key={model._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center border border-gray-200"
          >
            <div className="relative w-full h-48 flex justify-center items-center">
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                NEW
              </span>
              <img
                src={model.image}
                alt={model.name}
                onError={(e) => (e.target.src = "/images/placeholder.svg")}
                className="h-full object-contain"
              />
            </div>

            <h3 className="mt-4 text-md font-semibold text-gray-800">
              {model.name}
            </h3>
            <p className="text-sm text-gray-500">Scale: {model.scale}</p>
            <p className="text-blue-600 font-semibold text-md mt-1">
              Price: ${model.price}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;
