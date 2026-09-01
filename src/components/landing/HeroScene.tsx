import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingMeshProps {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  color: string;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  wireframe?: boolean;
}

const FloatingMesh = ({
  geometry,
  color,
  position,
  speed = 1,
  amplitude = 1,
  frequency = 1,
  wireframe = false,
}: FloatingMeshProps) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * speed;
    ref.current.rotation.y = t * speed * 0.8;
    ref.current.position.y = position[1] + Math.sin(t * frequency) * amplitude;
  });

  return (
    <mesh ref={ref} position={position}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={wireframe ? 0.3 : 0.8}
      />
    </mesh>
  );
};

const Scene = () => {
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        pointer.y * 0.1,
        0.05,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        pointer.x * 0.1,
        0.05,
      );
    }
  });

  const geos = useMemo(() => {
    return {
      icosahedron: new THREE.IcosahedronGeometry(1.5, 0),
      torus: new THREE.TorusGeometry(1.2, 0.4, 16, 100),
      octahedron: new THREE.OctahedronGeometry(1.2, 0),
      torusKnot: new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16),
    };
  }, []);

  React.useEffect(() => {
    return () => {
      Object.values(geos).forEach((g) => g.dispose());
    };
  }, [geos]);

  return (
    <group ref={group}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <FloatingMesh
        geometry={geos.icosahedron}
        position={[-4, 1, -2]}
        color="#8b5cf6"
        speed={0.2}
        amplitude={0.5}
        frequency={1.5}
        wireframe
      />
      <FloatingMesh
        geometry={geos.torus}
        position={[4, -1, -3]}
        color="#06b6d4"
        speed={0.3}
        amplitude={0.6}
        frequency={1.2}
      />
      <FloatingMesh
        geometry={geos.octahedron}
        position={[-2, -2, -1]}
        color="#ec4899"
        speed={0.4}
        amplitude={0.4}
        frequency={2.0}
      />
      <FloatingMesh
        geometry={geos.torusKnot}
        position={[3, 2, -1.5]}
        color="#a78bfa"
        speed={0.15}
        amplitude={0.3}
        frequency={1.8}
        wireframe
      />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

export default function HeroScene() {
  return (
    <section className="h-screen w-full relative overflow-hidden bg-bg">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
        <h1
          className="heading-1 text-gradient bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent mb-4"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-accent))',
          }}
        >
          Creative Lab
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl font-light">
          Crafting digital experiences with code and imagination.
        </p>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-text-secondary/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
