"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-32 px-6 md:px-20 bg-neutral-950 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                
                {/* Colonne Titre (Sticky) */}
                <div className="md:col-span-2">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 sticky top-32">
                        {t.about.title}
                    </h2>
                </div>

                {/* Colonne Contenu */}
                <div className="md:col-span-6">
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-medium leading-tight mb-12"
                        dangerouslySetInnerHTML={{ __html: t.about.intro }}
                    />
                    
                    <div className="text-gray-400 text-lg leading-relaxed space-y-8">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            {t.about.desc1}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            {t.about.desc2}
                        </motion.p>
                    </div>

                    <div className="mt-16">
                        <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">{t.about.skillsTitle}</h3>
                        <div className="flex flex-wrap gap-3">
                            {["React", "Next.js", "Three.js", "Tailwind CSS", "Node.js", "Figma", "WebGL"].map((skill, i) => (
                                <motion.span 
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (i * 0.05) }}
                                    className="px-4 py-2 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white hover:text-black transition-colors cursor-default"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Colonne Photo */}
                <div className="md:col-span-4 md:pl-10 mt-12 md:mt-0">
                    <motion.div 
                        initial={{ clipPath: "inset(0 0 100% 0)" }}
                        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="relative aspect-[3/4] w-full bg-neutral-900 rounded-sm overflow-hidden hover:grayscale-0 transition-all duration-700"
                    >
                        <Image 
                            src="/profile.jpg"
                            alt="Gabin Hallosserie" 
                            fill 
                            className="object-cover"
                        />
                        
                        {/* Overlay bruit */}
                        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2cpIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')] pointer-events-none mix-blend-overlay"></div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
