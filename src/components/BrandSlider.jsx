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
        '(max-width: 768px)': {
          slides: { perView: 2.2, spacing: 10 },
        },
        '(max-width: 1024px)': {
          slides: { perView: 3.2, spacing: 15 },
        },
      },
      slides: {
        perView: 5,
        spacing: 30,
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
    <div className="relative py-14 bg-white flex justify-center">
      <div className="relative w-full max-w-7xl px-4">
        <div ref={sliderRef} className="keen-slider">
          {brandLogos.map((logo, index) => (
            <div
              className="keen-slider__slide flex justify-center items-center"
              key={index}
            >
              <img
                src={`/images/logos/${logo}`}
                alt={logo}
                className="h-16 md:h-20 object-contain transition duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute -left-2 md:-left-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
        >
          &#10094;
        </button>
        <button
          onClick={handleNext}
          className="absolute -right-2 md:-right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default BrandSlider;
