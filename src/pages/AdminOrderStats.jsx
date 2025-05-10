// src/pages/AdminOrderStats.jsx
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function AdminOrderStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/orders/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  const handleExportCSV = () => {
    if (!stats?.promoStats) return;
    const rows = ["Promo Code,Usage", ...stats.promoStats.map(p => `${p._id || ""},${p.count}`)];
    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "orders-stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!stats?.promoStats) return;
    const doc = new jsPDF();
    doc.text("TrueScale - Promo Code Statistics", 14, 18);
    autoTable(doc, {
      startY: 24,
      head: [["Promo Code", "Usage"]],
      body: stats.promoStats.map((p) => [p._id || "—", p.count]),
    });
    doc.save("orders-stats.pdf");
  };

  if (!stats) return <div className="pt-28 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pt-28 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Order Statistics</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-gray-700 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-gray-700 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">Top Promo Codes</h3>
      <div className="overflow-x-auto rounded-lg shadow mb-10">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-2">Code</th>
              <th className="text-center px-4 py-2">Usage</th>
            </tr>
          </thead>
          <tbody>
            {stats.promoStats.map((promo, idx) => (
              <tr
                key={promo._id}
                className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-4 py-2 font-mono text-sm">{promo._id || "—"}</td>
                <td className="text-center px-4 py-2">{promo.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold mb-4">Promo Usage Chart</h3>
      <div className="bg-white shadow p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.promoStats.map((p) => ({ code: p._id || "—", usage: p.count }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" fontSize={12} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="usage" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminOrderStats;