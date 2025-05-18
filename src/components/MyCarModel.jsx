import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MyCarModel({
  color,
  materialType = "glossy",
  wheelColor = null,
  onLoaded,
}) {
  const group = useRef();
  const { scene } = useGLTF("/models/porsche.glb");
  const materialRef = useRef(null);
  const wheelMaterialRef = useRef(null);

  const wheelMeshRanges = [
    [1, 234], // передній лівий
    [303, 537], // передній правий
    [606, 804], // задній лівий
    [872, 1071], // задній правий
  ];

  // Анімація обертання
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0003;
    }
  });

  useEffect(() => {
    scene.traverse((child) => {
      // Кузов
      if (
        color &&
        child.isMesh &&
        child.material.name ===
          "Porsche_911GT3TouringRewardRecycled_2022Paint_Material"
      ) {
        const materialOptions = {
          color: new THREE.Color(color),
          metalness: materialType === "metallic" ? 0.8 : 0.2,
          roughness: materialType === "matte" ? 0.9 : 0.25,
          clearcoat: 1.0,
          clearcoatRoughness: materialType === "matte" ? 0.8 : 0.1,
          reflectivity: materialType === "metallic" ? 0.7 : 0.4,
        };

        if (!materialRef.current) {
          materialRef.current = new THREE.MeshPhysicalMaterial(materialOptions);
        } else {
          Object.assign(materialRef.current, materialOptions);
        }

        child.material = materialRef.current;
        child.castShadow = true;
        child.receiveShadow = true;
      }

      // Диски
      if (
        wheelColor &&
        child.isMesh &&
        child.name.startsWith("polySurface")
      ) {
        const match = child.name.match(/\d+/);
        const index = match ? parseInt(match[0], 10) : null;

        const isWheel = wheelMeshRanges.some(
          ([start, end]) => index >= start && index <= end
        );

        if (isWheel) {
          if (!wheelMaterialRef.current) {
            wheelMaterialRef.current = new THREE.MeshStandardMaterial({
              color: new THREE.Color(wheelColor),
              metalness: 1,
              roughness: 0.3,
            });
          } else {
            wheelMaterialRef.current.color.set(wheelColor);
          }

          child.material = wheelMaterialRef.current;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      }
    });

    if (onLoaded) onLoaded();
  }, [scene, color, materialType, wheelColor, onLoaded]);

  useEffect(() => {
    if (color && materialRef.current) {
      materialRef.current.color.set(color);
    }
  }, [color]);

  useEffect(() => {
    if (wheelColor && wheelMaterialRef.current) {
      wheelMaterialRef.current.color.set(wheelColor);
    }
  }, [wheelColor]);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1}
      position={[0, -0.5, 0]}
      castShadow
    />
  );
}
