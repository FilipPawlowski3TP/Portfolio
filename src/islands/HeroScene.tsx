import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Subtelna, „szklana” forma geometryczna: ciemny metaliczny rdzeń,
 * akcentowa siatka (wireframe) i reakcja na ruch myszy.
 * Lekka w renderze — bez transmisji/odbić, żeby trzymać 60 FPS.
 */
function GlassForm() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.55, 1), []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reducedMotion) return;

    g.rotation.y += delta * 0.12;
    g.rotation.x += delta * 0.045;

    // parallax za kursorem (lag, żeby ruch był „ciężki” i ekskluzywny)
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.4, 0.045);
    g.position.y = THREE.MathUtils.lerp(g.position.y, state.pointer.y * 0.3, 0.045);
  });

  return (
    <group ref={group} rotation={[0.35, 0.6, 0]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#15151A"
          metalness={0.72}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.22}
          transparent
          opacity={0.94}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.012}>
        <meshBasicMaterial color="#D8FF3E" wireframe transparent opacity={0.26} />
      </mesh>
      <mesh geometry={geometry} scale={1.32}>
        <meshBasicMaterial color="#D8FF3E" wireframe transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[-4, 5, 4]} intensity={1.4} color="#ffffff" />
        <pointLight position={[5, -2, 3]} intensity={12} color="#D8FF3E" distance={12} />
        <pointLight position={[-5, -3, -2]} intensity={6} color="#7A8BFF" distance={12} />
        <GlassForm />
      </Canvas>
    </div>
  );
}
