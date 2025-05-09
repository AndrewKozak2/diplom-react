import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { saveCartToDB } from "../utils/cartStorage";
import SkeletonCard from "../components/SkeletonCard";
import { toast } from "react-hot-toast";

function ProductList({ refresh }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brand: "", price: 100 });
  const [sortOrder, setSortOrder] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const normalized = (data.products || data).map((p) => ({
          ...p,
          id: p._id || p.id,
        }));
        setProducts(normalized);
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, [refresh]);

  const filtered = products
    .filter((model) => {
      const brandMatch = filters.brand ? model.brand === filters.brand : true;
      const priceMatch = model.price <= filters.price;
      return brandMatch && priceMatch;
    })
    .sort((a, b) => {
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;

      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const visibleProducts = filtered.slice(0, visibleCount);

const handleAddToCart = (product) => {
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = savedCart.find((item) => item.id === product.id);

  const productForCart = {
    id: product.id,
    name: product.name,
    price: product.price,
    images: product.images || [], 
    quantity: 1,
  };

  const updatedCart = existing
    ? savedCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    : [...savedCart, productForCart];

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  saveCartToDB();
  window.dispatchEvent(new Event("cartUpdated"));
  toast.success("Added to cart");
};



  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <section
      id="models-container"
      className="bg-white py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto mb-10 bg-gray-50 border border-gray-200 rounded-xl shadow p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-wrap sm:flex-nowrap gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              className={`px-4 py-2 rounded-full border text-sm transition cursor-pointer ${
                filters.brand === ""
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => {
                setFilters({ ...filters, brand: "" });
                setVisibleCount(16);
              }}
            >
              All Brands
            </button>
            {uniqueBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  setFilters({ ...filters, brand });
                  setVisibleCount(16);
                }}
                className={`px-4 py-2 rounded-full border text-sm transition cursor-pointer ${
                  filters.brand === brand
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Max Price:{" "}
                <span className="text-gray-900 font-bold">
                  ${filters.price}
                </span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={filters.price}
                onChange={(e) => {
                  setFilters({ ...filters, price: Number(e.target.value) });
                  setVisibleCount(16);
                }}
                className="w-full sm:w-64 accent-gray-800 cursor-pointer"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Sort
              </label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setVisibleCount(16);
                }}
                className="border rounded-md p-2 w-48 cursor-pointer"
              >
                <option value="">Default</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        ) : visibleProducts.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No models found for selected filters.
          </div>
        ) : (
          visibleProducts.map((model) => (
            <ProductCard
              key={model.id}
              model={model}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount(visibleCount + 16)}
            className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductList;
