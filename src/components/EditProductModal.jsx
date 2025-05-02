import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.image,
    inStock: product.inStock ?? true,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/admin/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updated = await response.json();
      onSave(updated.product);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="w-4 h-4 accent-green-600"
            />
            <span className="text-sm text-gray-700">In stock</span>
          </label>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
