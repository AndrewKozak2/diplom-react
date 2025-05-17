import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MyCarModel({ color, materialType = "glossy", onLoaded }) {
  const group = useRef();
  const { scene } = useGLTF('/models/porsche.glb');
  const materialRef = useRef(null);

  // Анімація обертання
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0003;
    }
  });

  // Пошук і заміна матеріалу після завантаження GLTF
  useEffect(() => {
    scene.traverse((child) => {
      if (
        child.isMesh &&
        child.material.name === 'Porsche_911GT3TouringRewardRecycled_2022Paint_Material'
      ) {
        const materialOptions = {
          color: new THREE.Color(color),
          metalness: materialType === 'metallic' ? 0.8 : 0.2,
          roughness: materialType === 'matte' ? 0.9 : 0.25,
          clearcoat: 1.0,
          clearcoatRoughness: materialType === 'matte' ? 0.8 : 0.1,
          reflectivity: materialType === 'metallic' ? 0.7 : 0.4,
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
    });

    // Повідомляємо, що модель повністю готова
    if (onLoaded) onLoaded();
  }, [scene, color, materialType, onLoaded]);

  // Оновлюємо тільки колір, якщо змінюється
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(color);
    }
  }, [color]);

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
