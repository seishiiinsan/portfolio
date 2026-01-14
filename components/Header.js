"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import MobileMenu from "./MobileMenu";
import { useLanguage } from "@/context/LanguageContext";
import Magnetic from "./Magnetic";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const lenis = useLenis();
    const { language, toggleLanguage, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollTo = (e, href) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(href);
        }
    };

    return (
        <>
            <header 
                className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 flex justify-between items-center transition-all duration-300 ${
                    scrolled ? "backdrop-blur-md bg-black/50 border-b border-white/5 py-4" : "bg-transparent py-6"
                }`}
            >
                <div className="text-xl font-bold tracking-tighter uppercase text-white z-50 relative">
                    Gabin.
                </div>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-white">
                    <Magnetic>
                        <a href="#work" onClick={(e) => handleScrollTo(e, "#work")} className="hover:text-blue-400 transition-colors relative group cursor-pointer block px-4 py-2">
                            {t.nav.work}
                            <span className="absolute bottom-1 left-4 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-[calc(100%-32px)]"></span>
                        </a>
                    </Magnetic>
                    <Magnetic>
                        <a href="#about" onClick={(e) => handleScrollTo(e, "#about")} className="hover:text-blue-400 transition-colors relative group cursor-pointer block px-4 py-2">
                            {t.nav.about}
                            <span className="absolute bottom-1 left-4 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-[calc(100%-32px)]"></span>
                        </a>
                    </Magnetic>
                    <Magnetic>
                        <a href="#contact" onClick={(e) => handleScrollTo(e, "#contact")} className="hover:text-blue-400 transition-colors relative group cursor-pointer block px-4 py-2">
                            {t.nav.contact}
                            <span className="absolute bottom-1 left-4 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-[calc(100%-32px)]"></span>
                        </a>
                    </Magnetic>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 ml-4 border-l border-white/20 pl-6">
                        <button 
                            onClick={() => toggleLanguage("fr")}
                            className={`transition-colors ${language === "fr" ? "text-white font-bold" : "text-gray-500 hover:text-white"}`}
                        >
                            FR
                        </button>
                        <span className="text-gray-700">/</span>
                        <button 
                            onClick={() => toggleLanguage("en")}
                            className={`transition-colors ${language === "en" ? "text-white font-bold" : "text-gray-500 hover:text-white"}`}
                        >
                            EN
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden z-50">
                    <Magnetic>
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative w-12 h-12 flex flex-col justify-center items-end gap-1.5 group p-2"
                        >
                            <motion.span 
                                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                className="block w-8 h-0.5 bg-white transition-colors group-hover:bg-blue-400"
                            ></motion.span>
                            <motion.span 
                                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="block w-6 h-0.5 bg-white transition-colors group-hover:bg-blue-400"
                            ></motion.span>
                            <motion.span 
                                animate={isOpen ? { rotate: -45, y: -8, width: "2rem" } : { rotate: 0, y: 0, width: "1.5rem" }}
                                className="block w-4 h-0.5 bg-white transition-colors group-hover:bg-blue-400"
                            ></motion.span>
                        </button>
                    </Magnetic>
                </div>
            </header>

            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}
