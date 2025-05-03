import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function AddProductForm({ onClose }) {
  const [form, setForm] = useState({
    brand: '',
    name: '',
    scale: '',
    price: '',
    image: ''
  });
  const [fileName, setFileName] = useState('Файл не вибрано');
  const [brands, setBrands] = useState([]);

useEffect(() => {
  document.body.style.overflow = 'hidden';
  fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        const uniqueBrands = [...new Set(data.map(p => p.brand))];
        setBrands(uniqueBrands);
      } else {
        console.error('products is not an array:', data);
        setBrands([]);
      }
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      setBrands([]); 
    });
    

  return () => {
    document.body.style.overflow = 'auto';
  };
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

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
  
      toast.custom((t) => (
        <div className="bg-green-600 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3">
          <CheckCircle size={20} />
          <span>Product added successfully!</span>
        </div>
      ));
  
      onClose?.();
    } catch (err) {
      toast.custom((t) => (
        <div className="bg-red-600 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3">
          <XCircle size={20} />
          <span>{err.message}</span>
        </div>
      ));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              list="brand-options"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <datalist id="brand-options">
              {brands.map((brand, i) => (
                <option key={i} value={brand} />
              ))}
            </datalist>
          </div>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            autoComplete="nope"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="scale"
            value={form.scale}
            onChange={handleChange}
            placeholder="Scale"
            autoComplete="nope"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            autoComplete="nope"
            type="number"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex items-center gap-4">
            <label className="block text-sm text-gray-700">
              Upload Image:
            </label>
            <div className="relative">
              <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 transition cursor-pointer">
                Вибрати файл
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute left-0 top-0 w-full h-full cursor-pointer opacity-0"
                />
              </label>
            </div>
            <span className="text-sm text-gray-500 truncate max-w-[150px]">
              {fileName}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded cursor-pointer transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;
