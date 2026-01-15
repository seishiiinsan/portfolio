"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { motion } from "framer-motion-3d";

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uHover;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Petit effet de vague subtil
  pos.z += sin(pos.x * 5.0 + uTime) * 0.02 * uHover;
  pos.z += sin(pos.y * 5.0 + uTime) * 0.02 * uHover;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uHover;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Effet de distorsion liquide au survol
  float wave = sin(uv.y * 10.0) * 0.02 * uHover;
  uv.x += wave;

  // Zoom léger
  // uv = (uv - 0.5) * (1.0 - uHover * 0.05) + 0.5;

  vec4 color = texture2D(uTexture, uv);
  
  // Augmenter un peu la luminosité au survol
  color.rgb += uHover * 0.1;

  gl_FragColor = color;
}
`;

function ImagePlane({ src, hovered }) {
    const meshRef = useRef();
    const texture = useLoader(TextureLoader, src);
    
    // Uniforms pour le shader
    const uniforms = useRef({
        uTime: { value: 0 },
        uHover: { value: 0 },
        uTexture: { value: texture }
    });

    useFrame((state) => {
        if (meshRef.current) {
            // Animation du temps
            uniforms.current.uTime.value = state.clock.getElapsedTime();
            
            // Animation fluide de la valeur hover (lerp)
            const targetHover = hovered ? 1 : 0;
            uniforms.current.uHover.value += (targetHover - uniforms.current.uHover.value) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1, 1, 32, 32]} /> {/* 32 segments pour que la déformation vertex fonctionne */}
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms.current}
                transparent={true}
            />
        </mesh>
    );
}

export default function DistortedImage({ src, alt, className }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div 
            className={`relative w-full h-full overflow-hidden ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Fallback image pour le SEO et le chargement */}
            {/* On pourrait la cacher une fois le canvas chargé, mais pour l'instant on utilise le canvas par dessus */}
            
            <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
                    {/* On adapte la taille du plan à la vue */}
                    <ImagePlane src={src} hovered={hovered} />
                </Canvas>
            </div>
        </div>
    );
}
