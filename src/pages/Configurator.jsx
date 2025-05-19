import React, { Suspense, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import MyCarModel from "../components/MyCarModel";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Configurator() {
  const { t } = useTranslation();
  const [carColor, setCarColor] = useState(null);
  const [materialType, setMaterialType] = useState(null);
  const [wheelColor, setWheelColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef();
  const location = useLocation();
  const [resetKey, setResetKey] = useState(Date.now());

  useEffect(() => {
    setResetKey(Date.now());
    setCarColor(null);
    setWheelColor(null);
    setMaterialType("metallic");
  }, [location.pathname]);

  const categories = [
    {
      title: t("configurator.shades"),
      colors: [
        { name: "Jet Black Metallic", value: "#0e0e0e", type: "metallic" },
        { name: "Vanadium Grey Metallic", value: "#5a5a5a", type: "metallic" },
        { name: "Ice Grey Matte", value: "#d1d5db", type: "matte" },
      ],
    },
    {
      title: t("configurator.dreams"),
      colors: [
        { name: "Guards Red", value: "#d72626", type: "glossy" },
        { name: "Gentian Blue Metallic", value: "#182e63", type: "metallic" },
        { name: "Cartagena Yellow", value: "#d9d66f", type: "glossy" },
        { name: "Lugano Blue", value: "#255caa", type: "glossy" },
      ],
    },
    {
      title: t("configurator.legends"),
      colors: [
        { name: "Oak Green Metallic", value: "#314d2b", type: "metallic" },
        { name: "Slate Grey", value: "#474747", type: "matte" },
      ],
    },
  ];

  const wheelPresets = [
    { name: "Black", value: "#111111" },
    { name: "Silver", value: "#bbbbbb" },
    { name: "Bronze", value: "#9e835f" },
    { name: "Gold", value: "#e3c565" },
    { name: "White", value: "#eeeeee" },
  ];

  const handleCustomColor = (e) => {
    const value = e.target.value;
    setCarColor(value);
    setMaterialType("glossy");
  };

  const handleAddCustomToCart = async () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return toast.error(t("configurator.canvasError"));

    await new Promise((resolve) => setTimeout(resolve, 500));
    const screenshot = canvas.toDataURL("image/png", 0.8);
    if (!screenshot.startsWith("data:image"))
      return toast.error(t("configurator.screenshotError"));

    try {
      const filename = `custom-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}.png`;
      const response = await fetch(
        "http://localhost:3000/api/upload-screenshot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: screenshot, filename }),
        }
      );

      if (!response.ok) throw new Error("Upload failed");
      const { path } = await response.json();

      const product = {
        id: "custom-" + Date.now(),
        name: "Porsche 911 GT3 Touring (Custom)",
        price: finalPrice,
        image: path,
        quantity: 1,
        color: carColor,
        wheelColor: wheelColor,
      };

      const existing = JSON.parse(localStorage.getItem("cart")) || [];
      existing.push(product);
      localStorage.setItem("cart", JSON.stringify(existing));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(t("configurator.addedSuccess"));
      setCarColor(null);
      setWheelColor(null);
      setMaterialType("metallic");
    } catch (error) {
      console.error("❌ Error uploading screenshot:", error);
      toast.error(t("configurator.uploadFail"));
    }
  };

  const basePrice = 16;
  const hasColor = !!carColor;
  const hasWheels = !!wheelColor;

  const finalPrice =
    hasColor && hasWheels
      ? basePrice + 8
      : hasColor
      ? basePrice + 5
      : hasWheels
      ? basePrice + 3
      : basePrice;

  return (
    <div className="bg-gray-100 min-h-screen pt-[110px] px-8">
      <div className="max-w-7xl mx-auto flex gap-8">
        <div className="w-[1024px] flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow text-sm flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-gray-800 mb-1">
                {t("configurator.customizing")}
              </p>
              <p className="text-gray-600">Porsche 911 (992) GT3 Touring</p>
              <p className="text-green-600 mt-1 text-sm">
                {t("configurator.description")}
              </p>
            </div>
            <img
              src="/images/products/minigt_373_GT3Touring grey/porsche911gt3touringGray1.png"
              alt="Porsche 911 GT3 Touring"
              className="rounded-lg w-[180px] h-[120px] object-contain border"
            />
          </div>

          <div
            ref={canvasRef}
            className="relative bg-white rounded-xl shadow-2xl p-2 h-[576px]"
          >
            <Canvas
              shadows
              gl={{ preserveDrawingBuffer: true }}
              camera={{ position: [3, 1.4, 5.6], fov: 35 }}
              style={{ borderRadius: "12px" }}
            >
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1.5}
                castShadow
              />
              <pointLight position={[0, 2, 2]} intensity={0.6} />
              <Suspense fallback={<></>}>
                <MyCarModel
                  key={resetKey}
                  color={carColor}
                  materialType={materialType}
                  wheelColor={wheelColor}
                  onLoaded={() => setIsLoading(false)}
                />
                <mesh
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, -0.5, 0]}
                  receiveShadow
                >
                  <circleGeometry args={[8, 64]} />
                  <meshStandardMaterial color="#d8d8d8" roughness={0.9} />
                </mesh>
                <ContactShadows
                  position={[0, -0.499, 0]}
                  opacity={0.35}
                  scale={10}
                  blur={2}
                  far={5}
                />
                <Environment preset="studio" />
              </Suspense>
              <OrbitControls
                autoRotate
                autoRotateSpeed={0.2}
                enableZoom
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2.2}
                minDistance={3}
                maxDistance={6}
              />
            </Canvas>

            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
                <Loader />
              </div>
            )}
          </div>

          {(carColor || wheelColor) && (
            <button
              onClick={handleAddCustomToCart}
              className="mt-4 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              ➕ {t("configurator.addToCart")} (${finalPrice.toFixed(2)})
            </button>
          )}
        </div>

        <div className="w-[280px] space-y-6 mt-8">
          {categories.map((cat) => (
            <div key={cat.title}>
              <h3 className="text-lg font-semibold mb-2">{cat.title}</h3>
              <div className="flex gap-3 flex-wrap">
                {cat.colors.map((c) => (
                  <button
                    key={c.value}
                    title={`${c.name} (${c.type})`}
                    onClick={() => {
                      setCarColor(c.value);
                      setMaterialType(c.type);
                    }}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value }}
                  ></button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("configurator.paintToSample")}
            </h3>
            <div className="relative w-12 h-12">
              <div
                className="w-12 h-12 rounded-full border cursor-pointer"
                style={{
                  background:
                    "linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet)",
                }}
                title="Custom Color Picker"
              />
              <input
                type="color"
                value={carColor || "#000000"}
                onChange={(e) => {
                  setCarColor(e.target.value);
                  setMaterialType("glossy");
                }}
                className="absolute top-0 left-0 w-12 h-12 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("configurator.wheelColor")}
            </h3>
            <div className="flex gap-3 flex-wrap">
              {wheelPresets.map((w) => (
                <button
                  key={w.value}
                  title={w.name}
                  onClick={() => setWheelColor(w.value)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: w.value }}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
