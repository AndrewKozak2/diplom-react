import React from "react";
import { Truck, Car, Tag, Lock } from "lucide-react";

function StoreBenefits() {
  return (
    <section className=" py-16 px-6 text-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Worldwide Shipping */}
        <div className="flex flex-col items-center">
          <Truck size={36} className="mb-4 text-gray-900" />
          <h4 className="font-semibold text-lg mb-2">Worldwide Shipping</h4>
          <p className="text-gray-600 text-sm">
            We deliver across the globe with fast and reliable shipping.
          </p>
        </div>

        {/* Best Quality */}
        <div className="flex flex-col items-center">
          <Car size={36} className="mb-4 text-gray-900" />
          <h4 className="font-semibold text-lg mb-2">Best Quality</h4>
          <p className="text-gray-600 text-sm">
            Only top-grade models with precise detailing and design.
          </p>
        </div>

        {/* Best Offers */}
        <div className="flex flex-col items-center">
          <Tag size={36} className="mb-4 text-gray-900" />
          <h4 className="font-semibold text-lg mb-2">Best Offers</h4>
          <p className="text-gray-600 text-sm">
            Enjoy great discounts, limited edition releases and bundles.
          </p>
        </div>

        {/* Secure Payments */}
        <div className="flex flex-col items-center">
          <Lock size={36} className="mb-4 text-gray-900" />
          <h4 className="font-semibold text-lg mb-2">Secure Payments</h4>
          <p className="text-gray-600 text-sm">
            Your data is safe. Multiple payment methods supported.
          </p>
        </div>
      </div>
    </section>
  );
}

export default StoreBenefits;
