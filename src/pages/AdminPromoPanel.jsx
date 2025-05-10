import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

function AdminPromoPanel() {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState({ code: "", type: "percent", value: "" });

  useEffect(() => {
    async function fetchCodes() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/promocodes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCodes(data);
      } catch (err) {
        console.error("Error loading promo codes:", err);
      }
    }
    fetchCodes();
  }, []);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/promocodes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCode),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      setCodes([...codes, created]);
      setNewCode({ code: "", type: "percent", value: "" });
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/promocodes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setCodes(codes.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-28 p-4">
      <h2 className="text-2xl font-bold mb-6">Promo Code Admin Panel</h2>

      <div className="mb-6 border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-3">Create New Promo</h3>
        <div className="flex gap-3 items-end">
          <input
            type="text"
            placeholder="Code"
            value={newCode.code}
            onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
            className="border px-3 py-2 rounded w-[120px]"
          />
          <select
            value={newCode.type}
            onChange={(e) => setNewCode({ ...newCode, type: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="percent">% off</option>
            <option value="fixed">Fixed $ off</option>
            <option value="shipping">Free shipping</option>
          </select>
          <input
            type="number"
            placeholder="Value"
            value={newCode.value}
            onChange={(e) => setNewCode({ ...newCode, value: e.target.value })}
            className="border px-3 py-2 rounded w-[100px]"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <PlusCircle size={16} /> Create
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Existing Promo Codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Used</th>
                <th>Max</th>
                <th>Expires</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {codes.map((promo) => (
                <tr key={promo._id} className="border-t">
                  <td className="px-4 py-2 font-mono">{promo.code}</td>
                  <td className="text-center">{promo.type}</td>
                  <td className="text-center">{promo.value}</td>
                  <td className="text-center">{promo.usageCount}</td>
                  <td className="text-center">{promo.maxUsage || '-'}</td>
                  <td className="text-center">{promo.expiresAt ? promo.expiresAt.slice(0, 10) : '-'}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(promo._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPromoPanel;