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
import { useTranslation } from "react-i18next";

function AdminOrderStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://truescale.up.railway.app/api/orders/stats", {
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
    const rows = [
      `${t("orderStats.code")},${t("orderStats.usage")}`,
      ...stats.promoStats.map((p) => `${p._id || ""},${p.count}`),
    ];
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
  doc.setFontSize(18);
  doc.text("TrueScale — Order Statistics", 14, 20);

  doc.setFontSize(12);
  doc.text(`Total Orders: ${stats.totalOrders}`, 14, 32);
  doc.text(`Total Revenue: $${stats.totalRevenue.toFixed(2)}`, 14, 40);

  autoTable(doc, {
    startY: 50,
    head: [["Promo Code", "Used"]],
    body: stats.promoStats.map((p) => [p._id || "—", p.count]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [31, 41, 55] },
  });

  doc.save("orders-statistics.pdf");
};

  if (!stats) return <div className="pt-28 text-center">{t("orderStats.loading")}</div>;

  return (
    <div className="max-w-4xl mx-auto pt-28 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("orderStats.title")}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
          >
            {t("orderStats.exportCSV")}
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
          >
            {t("orderStats.exportPDF")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-gray-700 text-sm">{t("orderStats.totalOrders")}</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-gray-700 text-sm">{t("orderStats.totalRevenue")}</h3>
          <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">{t("orderStats.topPromo")}</h3>
      <div className="overflow-x-auto rounded-lg shadow mb-10">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-2">{t("orderStats.code")}</th>
              <th className="text-center px-4 py-2">{t("orderStats.usage")}</th>
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

      <h3 className="text-xl font-semibold mb-4">{t("orderStats.chartTitle")}</h3>
      <div className="bg-white shadow p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={stats.promoStats.map((p) => ({
              code: p._id || "—",
              usage: p.count,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" fontSize={12} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="usage" fill="#1f2937" radius={[4, 4, 0, 0]} /> {/* gray-800 */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminOrderStats;
