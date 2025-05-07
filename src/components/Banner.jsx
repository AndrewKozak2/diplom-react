import React from "react";
import bannerImage from "../assets/diorama.jpg";

function Banner() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-0">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-md px-4 sm:px-6 md:px-12 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Text */}
        <div className="max-w-xl text-center md:text-left">
          <p className="text-xs sm:text-sm uppercase text-blue-600 mb-2 font-medium">
            Coming Soon
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Dioramas for 1:64 Collectors
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
            We're working on detailed miniature scenes for your favorite 1:64 scale brands like Mini GT, INNO64, and Tarmac Works.
            Stay tuned — they’ll be available very soon!
          </p>
          <button className="bg-gray-900 text-white px-5 py-2 sm:px-6 sm:py-3 rounded hover:bg-gray-800 transition font-medium">
            Learn More
          </button>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={bannerImage}
            alt="Diorama Preview"
            className="w-full max-w-sm rounded-xl shadow-lg object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default Banner;
