import React, { useEffect, useState } from 'react';
import Filters from './Filters';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brand: '', scale: '', price: 100 });

  useEffect(() => {
    fetch('https://truescale-backend.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => {
        const normalized = (data.products || data).map((p) => ({
          ...p,
          id: p._id || p.id, // 👈 нормалізація ID
        }));
        setProducts(normalized);
      })
      .catch((err) => console.error('Failed to load products:', err));
  }, []);

  const handleAddToCart = (product) => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = savedCart.find((item) => item.id === product.id);

    let updatedCart;
    if (existing) {
      updatedCart = savedCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...savedCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.updateCartCount?.();
  };

  const filtered = products.filter((model) => {
    const brandMatch = filters.brand ? model.brand === filters.brand : true;
    const scaleMatch = filters.scale ? model.scale === filters.scale : true;
    const priceMatch = model.price <= filters.price;
    return brandMatch && scaleMatch && priceMatch;
  });

  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <section id="models-container" className="bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[270px_1fr] gap-10">
        {/* Блок фільтрів */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight">Filters</h3>

          <label className="block mb-2 text-sm font-medium text-gray-700">Brand:</label>
          <select
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All</option>
            {uniqueBrands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <label className="block mb-2 text-sm font-medium text-gray-700">Scale:</label>
          <select
            value={filters.scale}
            onChange={(e) => setFilters({ ...filters, scale: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All</option>
            <option value="1/64">1/64</option>
            <option value="1/43">1/43</option>
          </select>

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Max Price: <span className="font-bold text-gray-900">${filters.price}</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={filters.price}
            onChange={(e) =>
              setFilters({ ...filters, price: Number(e.target.value) })
            }
            className="w-full accent-blue-600"
          />
        </div>

        {/* Товари */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((model) => (
            <ProductCard
              key={model.id}
              model={model}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductList;
