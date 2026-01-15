"use client";
import Image from "next/image";

export default function LiquidImage({ src, alt, className }) {
    return (
        <div className={`relative overflow-hidden group ${className}`}>
            {/* Filtre SVG caché */}
            <svg className="hidden">
                <defs>
                    <filter id="liquid">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.005" numOctaves="5" seed="2">
                            <animate attributeName="baseFrequency" dur="20s" values="0.01 0.005;0.02 0.008;0.01 0.005" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" scale="0"></feDisplacementMap>
                    </filter>
                </defs>
            </svg>

            {/* Image avec effet CSS */}
            <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                <Image 
                    src={src} 
                    alt={alt} 
                    fill 
                    className="object-cover transition-all duration-500"
                    style={{ filter: "url(#liquid)" }} // On pourrait animer le scale du displacementMap ici avec JS si on voulait pousser plus loin
                />
                
                {/* Overlay couleur au survol */}
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-500 mix-blend-overlay"></div>
            </div>
        </div>
    );
}
