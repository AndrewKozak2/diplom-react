import React, { useEffect, useRef, useState } from "react";
import { X, Gift } from "lucide-react";

function CapsuleModal({ onClose, onDrop, total }) {
  const [finalModel, setFinalModel] = useState(null);
  const [canOpen, setCanOpen] = useState(false);
  const [rolling, setRolling] = useState(true);
  const [models, setModels] = useState([]);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (total < 50 || localStorage.getItem("capsuleOpened") === "true") {
      setCanOpen(false);
    } else {
      setCanOpen(true);
    }
  }, [total]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    if (!canOpen) return;

    fetch("http://localhost:3000/api/capsule/all")
      .then((res) => res.json())
      .then((allModels) => {
        if (!Array.isArray(allModels)) {
          setRolling(false);
          return;
        }

        const reel = [];
        const totalItems = 80;
        for (let i = 0; i < totalItems; i++) {
          const random = allModels[Math.floor(Math.random() * allModels.length)];
          reel.push({ ...random, _id: `${random._id}-${i}` });
        }

        setModels(reel);

        const slider = sliderRef.current;
        const winIndex = 40;
        const itemWidth = 96;
        const offset = winIndex * itemWidth;

        requestAnimationFrame(() => {
          slider.style.transition = "transform 7.2s cubic-bezier(0.15, 0.6, 0.3, 1)";
          slider.style.transform = `translateX(-${offset}px)`;
        });

        setTimeout(() => {
          requestAnimationFrame(() => {
            const items = sliderRef.current.querySelectorAll(".capsule-item");
            const centerLine =
              containerRef.current.getBoundingClientRect().left +
              containerRef.current.offsetWidth / 2;

            let closestIndex = 0;
            let minDistance = Infinity;

            items.forEach((el, idx) => {
              const rect = el.getBoundingClientRect();
              const itemCenter = rect.left + rect.width / 2;
              const distance = Math.abs(centerLine - itemCenter);
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = idx;
              }
            });

            setFinalModel(reel[closestIndex] || reel[0]);
            setRolling(false);
          });
        }, 7400);
      });
  }, [canOpen]);

  const handleAccept = () => {
    if (finalModel) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({
        id: `capsule-${finalModel._id}`,
        name: finalModel.name,
        brand: finalModel.brand,
        image: finalModel.image,
        price: 0,
        quantity: 1,
        bonus: true,
        scale: "1/64",
        limited: false,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("capsuleOpened", "true");
      window.dispatchEvent(new Event("cartUpdated"));
      onDrop(finalModel);
      onClose();
    }
  };

  const getColor = (rarity) => {
    switch (rarity) {
      case "epic": return "bg-yellow-100";
      case "rare": return "bg-red-100";
      case "uncommon": return "bg-green-100";
      default: return "bg-blue-100";
    }
  };

  const getBorder = (rarity) => {
    switch (rarity) {
      case "epic": return "border-yellow-400";
      case "rare": return "border-red-500";
      case "uncommon": return "border-green-500";
      default: return "border-blue-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-[95%] text-center shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 flex justify-center items-center gap-2">
          <Gift className="w-6 h-6 text-pink-500" /> Open Your Capsule
        </h2>

        {!canOpen && (
          <p className="text-gray-600">
            Capsule is available for orders over $50 and only once.
          </p>
        )}

        {canOpen && (
          <div className="relative" ref={containerRef}>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black z-20" style={{ transform: "translateX(-50%)" }} />
            <div className="overflow-hidden w-full border rounded-md h-32 bg-gray-100">
              <div ref={sliderRef} className="flex items-end space-x-2 px-4" style={{ willChange: "transform" }}>
                {models.map((item, i) => (
                  <div
                    key={i}
                    className={`capsule-item flex flex-col items-center rounded-lg border ${getBorder(item.rarity)} ${getColor(item.rarity)} p-1`}
                  >
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                    <div className={`w-20 h-2 mt-1 rounded-sm ${getBorder(item.rarity)}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {canOpen && !rolling && finalModel && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-1">{finalModel.name}</h3>
            <p className={`text-sm font-semibold mb-3 uppercase ${getBorder(finalModel.rarity).replace("border", "text")}`}>
              {finalModel.rarity}
            </p>
            <button onClick={handleAccept} className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md">
              Claim Reward
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CapsuleModal;
