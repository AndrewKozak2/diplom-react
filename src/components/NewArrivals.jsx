import React, { useEffect, useState } from 'react';

function NewArrivals() {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    fetch('https://truescale-backend.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => {
        const products = Array.isArray(data) ? data : data.products || [];
        const sorted = products
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setLatest(sorted);
      })
      .catch((err) => console.error('Error loading new arrivals:', err));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        New Arrivals
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {latest.map((model) => (
          <div key={model._id || model.id} className="flex flex-col items-center text-center">
            <img
              src={model.image}
              alt={model.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder.svg';
              }}
              className="rounded-xl shadow-md w-full max-w-sm h-64 object-contain bg-white"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">{model.name}</h3>
            <p className="text-sm text-gray-500">Scale: {model.scale}</p>
            <p className="text-md text-blue-600 font-semibold">Price: ${model.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;
