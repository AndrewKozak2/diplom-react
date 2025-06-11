import React, { useState, useEffect } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

function AddProductForm({ onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    brand: "",
    name: "",
    scale: "",
    price: "",
  });
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState(t("addForm.noFiles"));
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetch("https://truescale.up.railway.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const uniqueBrands = [...new Set(data.map((p) => p.brand))];
          setBrands(uniqueBrands);
        } else {
          console.error("products is not an array:", data);
          setBrands([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setBrands([]);
      });

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setFileNames(selectedFiles.map((f) => f.name).join(", "));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("scale", form.scale);
      formData.append("price", form.price);
      formData.append("inStock", true);

      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("https://truescale.up.railway.app/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t("addForm.error"));
      }

      toast.custom(() => (
        <div className="bg-green-600 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3">
          <CheckCircle size={20} />
          <span>{t("addForm.success")}</span>
        </div>
      ));

      onClose?.();
    } catch (err) {
      toast.custom(() => (
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

        <h2 className="text-xl font-bold mb-4 text-center">{t("addForm.title")}</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <input
              list="brand-options"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder={t("addForm.brand")}
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
            placeholder={t("addForm.name")}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="scale"
            value={form.scale}
            onChange={handleChange}
            placeholder={t("addForm.scale")}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder={t("addForm.price")}
            type="number"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("addForm.uploadLabel")}
            </label>

            <label className="relative inline-block bg-white border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100 transition text-sm text-gray-800 font-medium">
              {t("addForm.selectFiles")}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>

            {files.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-md overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="object-cover h-24 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFiles = [...files];
                        updatedFiles.splice(index, 1);
                        setFiles(updatedFiles);
                        setFileNames(updatedFiles.map((f) => f.name).join(", "));
                      }}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-80 transition text-xs"
                      title={t("addForm.remove")}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded cursor-pointer transition"
          >
            {t("addForm.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;
