import React from 'react';
import { Link } from 'react-router-dom';
import BrandSlider from '../components/BrandSlider';
import NewArrivals from '../components/NewArrivals';
import ProductList from '../components/ProductList';


function Home() {
  return (
    <main className="w-full min-h-screen">
      {/* Hero-секція */}
      <section
  className="relative w-full h-screen bg-cover bg-center flex items-center justify-start px-10"
  style={{
    backgroundImage: `url('images/background.jpg')`,
  }}
>
  {/* Затемнення через псевдоелемент */}
  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

  <div className="text-white max-w-xl z-10">
    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
      Realistic Car Models
    </h1>
    <p className="text-xl mb-8">
      New arrivals of scale models at TrueScale
    </p>
    <div className="flex gap-4">
      <Link
        to="/#models"
        className="px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
      >
        Shop now
      </Link>
      <Link
        to="/about"
        className="px-6 py-3 border border-white text-white font-semibold rounded hover:bg-white hover:text-black transition"
      >
        Find more
      </Link>
    </div>
  </div>
</section>

      {/* Brand Slider */}
      <BrandSlider />
      <NewArrivals />
      <ProductList />
    </main>
  );
}

export default Home;
