import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-700 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        <div>
          <div className="flex items-center gap-2 text-lg font-bold mb-3">
            <ShoppingBag size={20} /> TrueScale
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t("footer.description.line1")} <br /> {t("footer.description.line2")}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{t("footer.models.title")}</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Mini GT</a></li>
            <li><a href="#" className="hover:underline">Tarmac Works</a></li>
            <li><a href="#" className="hover:underline">INNO64</a></li>
            <li><a href="#" className="hover:underline">CM Model</a></li>
            <li><a href="#" className="hover:underline">Timemicro</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{t("footer.company.title")}</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">{t("footer.company.about")}</a></li>
            <li><a href="#" className="hover:underline">{t("footer.company.shipping")}</a></li>
            <li><a href="#" className="hover:underline">{t("footer.company.terms")}</a></li>
            <li><a href="#" className="hover:underline">{t("footer.company.privacy")}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{t("footer.subscribe.title")}</h4>
          <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="email"
              placeholder={t("footer.subscribe.placeholder")}
              className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition"
            >
              {t("footer.subscribe.button")}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-100 py-6 px-4 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto text-sm">
        <p className="text-gray-500 text-center sm:text-left">
          © 2025 TrueScale. {t("footer.powered")}
        </p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          {[Facebook, Instagram, Twitter, Youtube, Mail].map((Icon, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
            >
              <Icon size={16} />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
