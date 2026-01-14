"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function SlidingText() {
    const container = useRef(null);
    const { t } = useLanguage();
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, -800]);

    return (
        <div ref={container} className="py-20 overflow-hidden bg-neutral-950 border-y border-white/5">
            <motion.div 
                style={{ x }}
                className="flex whitespace-nowrap relative left-[-20%]"
            >
                <Phrase t={t} />
                <Phrase t={t} />
                <Phrase t={t} />
                <Phrase t={t} />
                <Phrase t={t} />
                <Phrase t={t} />
            </motion.div>
        </div>
    );
}

const Phrase = ({ t }) => {
    return (
        <div className="flex items-center gap-10 px-5">
            <span className="text-8xl font-bold uppercase tracking-tighter text-transparent text-stroke opacity-30">
                {t.marquee.role}
            </span>
            <span className="text-4xl">✦</span>
            <span className="text-8xl font-bold uppercase tracking-tighter text-white">
                {t.marquee.available}
            </span>
            <span className="text-4xl">✦</span>
            <span className="text-8xl font-bold uppercase tracking-tighter text-transparent text-stroke opacity-30">
                {t.marquee.design}
            </span>
            <span className="text-4xl">✦</span>
        </div>
    )
}
