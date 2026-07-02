"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";

const COUNT = 2000;
const RADIUS = 1.6;

function Globe({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const prefersReduced = useReducedMotion();

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      arr[i * 3] = Math.cos(theta) * r * RADIUS;
      arr[i * 3 + 1] = y * RADIUS;
      arr[i * 3 + 2] = Math.sin(theta) * r * RADIUS;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current || prefersReduced) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.08;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      (mouse.current?.y ?? 0) * 0.3,
      0.05
    );
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      -(mouse.current?.x ?? 0) * 0.15,
      0.05
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  );
}

function Scene({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const { viewport } = useThree();
  const scale = Math.min(viewport.width, viewport.height) / 4.5;

  return (
    <group scale={scale}>
      <Globe mouse={mouse} />
    </group>
  );
}

export default function ParticleGlobe({
  mouse,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      frameloop={prefersReduced ? "demand" : "always"}
      className="!w-full !h-full"
      gl={{ antialias: false, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <Scene mouse={mouse} />
    </Canvas>
  );
}
