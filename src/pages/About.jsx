import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function About() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToModels = () => {
    localStorage.setItem("scrollTo", "models");
    navigate("/");
  };

  return (
    <main className="bg-gray-100 text-gray-800">
      {/* Hero section */}
      <section
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('images/background(1).png')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-4">{t("about.title")}</h1>
          <p className="text-xl font-medium">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="max-w-6xl mx-auto py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          {t("about.whoTitle")}
        </h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto">
          {t("about.whoDescription")}
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            {t("about.missionTitle")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("about.missionText")}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            {t("about.visionTitle")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("about.visionText")}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            {t("about.valuesTitle")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("about.valuesText")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-200 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {t("about.ctaTitle")}
          </h2>
          <button
            onClick={scrollToModels}
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition"
          >
            {t("about.ctaButton")}
          </button>
        </div>
      </section>
    </main>
  );
}

export default About;
