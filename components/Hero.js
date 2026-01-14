"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Magnetic from "./Magnetic";

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden">
            {/* Optimized Background Blob */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.2, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-blue-600 rounded-full blur-[100px] pointer-events-none will-change-transform"
            ></motion.div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] z-10">
                <motion.span 
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                    className="block"
                >
                    {t.hero.role1}
                </motion.span>
                <motion.span 
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
                className="mt-8 text-lg md:text-xl text-gray-400 max-w-lg z-10"
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
                    <a href="#work" className="inline-block border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-medium">
                        {t.hero.cta}
                    </a>
                </Magnetic>
            </motion.div>
        </section>
    );
}
