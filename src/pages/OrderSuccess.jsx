import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function OrderSuccess() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg flex flex-col items-center gap-6">
        <CheckCircle size={80} className="text-green-500" />
        <h1 className="text-3xl font-bold text-center">
          {t("orderSuccess.thankYou")}
        </h1>
        <p className="text-gray-600 text-center">
          {t("orderSuccess.processing")}
        </p>
        <Link
          to="/"
          className="mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-lg transition"
        >
          {t("orderSuccess.backToHome")}
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
