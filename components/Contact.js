"use client";
import { useLanguage } from "@/context/LanguageContext";
import Magnetic from "./Magnetic";

export default function Contact() {
    const { t } = useLanguage();

    return (
        <div 
            className="relative h-[800px]" // Hauteur réservée pour le footer
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            <div className="fixed bottom-0 h-[800px] w-full">
                <section id="contact" className="h-full bg-neutral-900 flex flex-col items-center justify-center text-center px-6 md:px-20">
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 hover:text-stroke transition-all duration-500 cursor-default">
                        {t.contact.title}
                    </h2>
                    
                    <Magnetic>
                        <a href="mailto:contact@gabin.dev" className="inline-block text-xl md:text-2xl border-b border-white pb-1 hover:text-blue-400 hover:border-blue-400 transition-colors p-4">
                            gabinhalloss@gmail.com
                        </a>
                    </Magnetic>

                    <div className="flex gap-8 mt-12">
                        <Magnetic>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors p-2">LinkedIn</a>
                        </Magnetic>
                        <Magnetic>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors p-2">GitHub</a>
                        </Magnetic>
                        <Magnetic>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors p-2">Twitter</a>
                        </Magnetic>
                    </div>

                    <footer className="absolute bottom-10 text-gray-500 text-sm">
                        {t.contact.footer}
                    </footer>
                </section>
            </div>
        </div>
    );
}
