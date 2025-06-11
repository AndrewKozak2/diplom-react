import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

function EditProductModal({ product, onClose, onSave }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: product.name,
    brand: product.brand,
    price: product.price,
    inStock: product.inStock ?? true,
    existingImages: product.images || [],
    newImages: [],
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, newImages: [...prev.newImages, ...files] }));
  };

  const handleRemoveExisting = (index) => {
    const updated = [...form.existingImages];
    updated.splice(index, 1);
    setForm({ ...form, existingImages: updated });
  };

  const handleRemoveNew = (index) => {
    const updated = [...form.newImages];
    updated.splice(index, 1);
    setForm({ ...form, newImages: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("price", form.price);
      formData.append("inStock", form.inStock);
      formData.append("existingImages", JSON.stringify(form.existingImages));
      form.newImages.forEach((file) => formData.append("newImages", file));

      const response = await fetch(
        `https://truescale.up.railway.app/api/admin/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error(t("editForm.error"));

      const updated = await response.json();
      onSave(updated.product);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(t("editForm.error"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">{t("editForm.title")}</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder={t("editForm.name")}
            required
          />
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder={t("editForm.brand")}
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder={t("editForm.price")}
            required
          />

          {/* Existing images */}
          {form.existingImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {form.existingImages.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={
                      img?.startsWith("http")
                        ? img
                        : `${import.meta.env.VITE_API_BASE || ""}${img}`
                    }
                    className="h-24 w-full object-cover rounded"
                    alt="img"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs"
                    title={t("editForm.remove")}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New image previews */}
          {form.newImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {form.newImages.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="h-24 w-full object-cover rounded"
                    alt="new"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNew(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs"
                    title={t("editForm.remove")}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 transition cursor-pointer">
                {t("editForm.selectFiles")}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="absolute left-0 top-0 w-full h-full cursor-pointer opacity-0"
                />
              </label>
            </div>
            <span className="text-sm text-gray-500 truncate max-w-[200px]">
              {form.newImages.length > 0
                ? form.newImages.map((f) => f.name).join(", ")
                : t("editForm.noFiles")}
            </span>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="w-4 h-4 accent-green-600"
            />
            <span className="text-sm text-gray-700">
              {t("editForm.inStock")}
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
          >
            {t("editForm.save")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
