import React, { useState } from 'react';
import { X } from 'lucide-react';

function AddProductForm({ onClose }) {
  const [form, setForm] = useState({
    brand: '',
    name: '',
    scale: '',
    price: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          inStock: true
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      alert('✅ Product added successfully!');
      onClose?.();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="scale"
            value={form.scale}
            onChange={handleChange}
            placeholder="Scale (e.g. 1/64)"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;
