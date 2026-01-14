"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
    const { t } = useLanguage();

    return (
        <section id="contact" className="py-32 px-6 md:px-20 flex flex-col items-center text-center">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 hover:text-stroke transition-all duration-500 cursor-default">
                {t.contact.title}
            </h2>
            <a href="mailto:contact@gabin.dev" className="text-xl md:text-2xl border-b border-white pb-1 hover:text-blue-400 hover:border-blue-400 transition-colors">
                contact@gabin.dev
            </a>
            <footer className="mt-32 text-gray-500 text-sm">
                {t.contact.footer}
            </footer>
        </section>
    );
}
