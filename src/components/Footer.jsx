import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  ShoppingBag,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 mt-16">
      {/* Верхня частина */}
      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand info */}
        <div>
          <div className="flex items-center gap-2 text-lg font-bold mb-2">
            <ShoppingBag size={20} /> TrueScale
          </div>
          <p className="text-sm text-gray-600">
            Realistic 1:64 scale cars. Premium quality for every collector.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-3">Models</h4>
          <ul className="space-y-1 text-sm">
            <li>Mini GT</li>
            <li>Tarmac Works</li>
            <li>INNO64</li>
            <li>CM Model</li>
            <li>Timemicro</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-1 text-sm">
            <li>About Us</li>
            <li>Shipping & Returns</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Subscribe</h4>
          <input
            type="email"
            placeholder="Your email address..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 text-sm"
          />
          <button className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Нижня частина */}
      <div className="border-t border-gray-100 py-6 px-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto text-sm">
        <p className="text-gray-500">© 2025 TrueScale. Powered by TrueScale Store.</p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <Facebook className="hover:text-blue-600 cursor-pointer" size={18} />
          <Instagram className="hover:text-pink-500 cursor-pointer" size={18} />
          <Twitter className="hover:text-blue-400 cursor-pointer" size={18} />
          <Youtube className="hover:text-red-500 cursor-pointer" size={18} />
          <Mail className="hover:text-gray-600 cursor-pointer" size={18} />
        </div>
      </div>
    </footer>
  );
}

export default Footer;