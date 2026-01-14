"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Magnetic from "./Magnetic";
import Scene from "./Scene";

export default function Hero() {
    const { t } = useLanguage();
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const xLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const xRight = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <section ref={container} className="h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden">
            
            {/* 3D Background */}
            <motion.div 
                style={{ y }}
                className="absolute inset-0 z-0 opacity-40" // Opacité réduite pour ne pas gêner la lecture
            >
                <Scene />
            </motion.div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] z-10 pointer-events-none">
                <motion.span 
                    style={{ x: xLeft }}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                    className="block"
                >
                    {t.hero.role1}
                </motion.span>
                <motion.span 
                    style={{ x: xRight }}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
                >
                    {t.hero.role2}
                </motion.span>
            </h1>

            <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
                className="mt-8 text-lg md:text-xl text-gray-400 max-w-lg z-10 pointer-events-none"
            >
                {t.hero.description}
            </motion.p>

            <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                className="mt-12 z-10 inline-block"
            >
                <Magnetic>
                    <a href="#work" className="inline-block border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-medium pointer-events-auto">
                        {t.hero.cta}
                    </a>
                </Magnetic>
            </motion.div>
        </section>
    );
}
