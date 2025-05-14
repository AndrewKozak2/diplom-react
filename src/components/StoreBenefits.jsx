import React from "react";
import { Truck, Car, Tag, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

function StoreBenefits() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-6 text-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Worldwide Shipping */}
        <div className="flex flex-col items-center">
          <Truck size={36} className="mb-4 text-gray-900" />
          <h4 className="font-semibold text-lg mb-2">
            {t("benefits.shipping.title")}
          </h4>
          <p className="text-gray-600 text-sm">
            {t("benefits.shipping.desc")}
          </p>
        </div>

        {/* Best Quality */}
        <div className="flex flex-col items-center">
          <Car size={36} className="mb-4 text-gray-900" />
          <h4 className="font-semibold text-lg mb-2">
            {t("benefits.quality.title")}
          </h4>
          <p className="text-gray-600 text-sm">
            {t("benefits.quality.desc")}
          </p>
        </div>

        {/* Best Offers */}
        <div className="flex flex-col items-center">
          <Tag size={36} className="mb-4 text-gray-900" />
          <h4 className="font-semibold text-lg mb-2">
            {t("benefits.offers.title")}
          </h4>
          <p className="text-gray-600 text-sm">
            {t("benefits.offers.desc")}
          </p>
        </div>

        {/* Secure Payments */}
        <div className="flex flex-col items-center">
          <Lock size={36} className="mb-4 text-gray-900" />
          <h4 className="font-semibold text-lg mb-2">
            {t("benefits.security.title")}
          </h4>
          <p className="text-gray-600 text-sm">
            {t("benefits.security.desc")}
          </p>
        </div>
      </div>
    </section>
  );
}

export default StoreBenefits;
