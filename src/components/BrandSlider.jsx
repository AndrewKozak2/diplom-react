import React, { useRef, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const brandLogos = [
  'brand-cmmodel.png',
  'brand-minigt.png',
  'brand-kaido.png',
  'brand-tarmac.png',
  'brand-inno64.png',
  'brand-timemicro.png',
];

function BrandSlider() {
  const timer = useRef(null);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      breakpoints: {
        '(max-width: 640px)': {
          slides: { perView: 2.2, spacing: 8 },
        },
        '(max-width: 1024px)': {
          slides: { perView: 3.2, spacing: 12 },
        },
      },
      slides: {
        perView: 5,
        spacing: 24,
      },
      drag: true,
      created(slider) {
        timer.current = setInterval(() => {
          if (slider) slider.next();
        }, 2500);
      },
    },
    []
  );

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  const handlePrev = () => instanceRef.current?.prev();
  const handleNext = () => instanceRef.current?.next();

  return (
    <div className="relative py-12 bg-white flex justify-center">
      <div className="relative w-full max-w-7xl px-4 sm:px-6">
        <div ref={sliderRef} className="keen-slider">
          {brandLogos.map((logo, index) => (
            <div
              className="keen-slider__slide flex justify-center items-center"
              key={index}
            >
              <img
                src={`/images/logos/${logo}`}
                alt={logo}
                className="h-12 sm:h-16 md:h-20 object-contain transition duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-0 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500 hover:text-black transition"
        >
          &#10094;
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-0 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500 hover:text-black transition"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default BrandSlider;
