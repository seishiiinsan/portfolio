"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

function AnimatedSphere() {
    const sphereRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (sphereRef.current) {
            // Rotation douce constante
            sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Sphere 
            ref={sphereRef} 
            args={[1, 64, 64]} 
            scale={2.5}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <MeshDistortMaterial
                color={hovered ? "#4B5563" : "#2563EB"} // Bleu vers Gris au survol
                attach="material"
                distort={0.5} // Force de la déformation
                speed={2} // Vitesse de l'animation
                roughness={0.2}
                metalness={0.8} // Effet métallique
            />
        </Sphere>
    );
}

export default function Scene() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} intensity={2} />
                <AnimatedSphere />
            </Canvas>
        </div>
    );
}
