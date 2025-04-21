import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  const scrollToModels = () => {
    navigate("/", { state: { scrollToModels: true } });
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
          <h1 className="text-5xl font-bold mb-4">About TrueScale</h1>
          <p className="text-xl font-medium">
            Precision. Passion. Perfection in 1:64 scale.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="max-w-6xl mx-auto py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">Who We Are</h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto">
          TrueScale is more than just a shop. We are a passionate community of
          scale car model collectors who appreciate the details, design, and
          heritage behind every miniature vehicle. Our journey began with a deep
          love for motorsports and precision modeling. Since our foundation,
          we've served thousands of collectors who seek quality, authenticity,
          and beauty in every piece.
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Our Mission
          </h3>
          <p className="text-sm text-gray-600">
            To deliver premium 1:64 scale models to collectors around the world
            and inspire appreciation for automotive design.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Our Vision
          </h3>
          <p className="text-sm text-gray-600">
            To become the #1 destination for authentic die-cast models and a hub
            for passionate collectors worldwide.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Our Values
          </h3>
          <p className="text-sm text-gray-600">
            Quality, community, attention to detail, respect for automotive
            culture, and integrity in every interaction.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-200 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Start Collecting?
          </h2>
          <button
            onClick={() => {
              localStorage.setItem("scrollTo", "models"); // 🧠 зберігаємо ціль
              navigate("/");
            }}
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition"
          >
            Shop Now
          </button>
        </div>
      </section>
    </main>
  );
}

export default About;
