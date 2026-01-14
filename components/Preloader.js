"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsVisible(false), 500); // Petit délai à 100%
                    return 100;
                }
                // Vitesse variable pour simuler un chargement réaliste
                const increment = Math.floor(Math.random() * 10) + 1;
                return Math.min(prev + increment, 100);
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isVisible]);

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="preloader"
                    initial={{ y: 0 }}
                    exit={{ 
                        y: "-100%", 
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
                    }}
                    className="fixed inset-0 z-[9999] bg-black flex flex-col justify-between p-10 md:p-20"
                >
                    {/* Top Text */}
                    <div className="flex justify-between text-white/50 text-sm uppercase tracking-widest font-mono">
                        <span>Portfolio 2026</span>
                        <span>Gabin Hallosserie</span>
                    </div>

                    {/* Center/Main Percentage */}
                    <div className="flex items-end justify-end">
                        <motion.span 
                            className="text-9xl md:text-[12rem] font-black text-white leading-none tracking-tighter"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {count}%
                        </motion.span>
                    </div>

                    {/* Bottom Progress Bar */}
                    <div className="w-full h-[1px] bg-white/20 relative overflow-hidden">
                        <motion.div 
                            className="absolute top-0 left-0 h-full bg-white"
                            initial={{ width: "0%" }}
                            animate={{ width: `${count}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
