import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BrandSlider from "../components/BrandSlider";
import NewArrivals from "../components/NewArrivals";
import ProductList from "../components/ProductList";
import StoreBenefits from "../components/StoreBenefits";
import Banner from "../components/Banner";
import LimitedDrop from "../components/LimitedDrop";

function Home({ refresh }) {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const hash = window.location.hash;
    const scrollTarget = localStorage.getItem("scrollTo");

    if (
      hash === "#models" ||
      scrollTarget === "models" ||
      location.state?.scrollToModels
    ) {
      const section = document.getElementById("models");
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
          localStorage.removeItem("scrollTo");
        }, 300);
      }
    }
  }, [location]);

  return (
    <main className="w-full min-h-screen overflow-hidden">
      {/* Hero-секція */}
      <section
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-start px-4 sm:px-6 md:px-10"
        style={{ backgroundImage: `url('images/background.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
        <div className="text-white max-w-xl z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t("home.title")}
          </h1>
          <p className="text-xl mb-8">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                const section = document.getElementById("models");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
            >
              {t("home.shopNow")}
            </button>
            <Link
              to="/about"
              className="px-6 py-3 border border-white text-white font-semibold rounded hover:bg-white hover:text-black transition text-center"
            >
              {t("home.findMore")}
            </Link>
          </div>
        </div>
      </section>

      <BrandSlider />
      <LimitedDrop />

      {/* Контейнер товарів */}
      <div id="models">
        <ProductList refresh={refresh} />
      </div>

      <div className="my-16">
        <Banner />
      </div>

      {/* Переваги магазину */}
      <StoreBenefits />
    </main>
  );
}

export default Home;

