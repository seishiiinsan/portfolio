"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-32 px-6 md:px-20 bg-neutral-950">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 sticky top-32">{t.about.title}</h2>
                </div>
                <div className="md:col-span-8">
                    <p 
                        className="text-3xl md:text-5xl font-medium leading-tight mb-12"
                        dangerouslySetInnerHTML={{ __html: t.about.intro }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-400">
                        <div>
                            <p className="mb-6">
                                {t.about.desc1}
                            </p>
                            <p>
                                {t.about.desc2}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">{t.about.skillsTitle}</h3>
                            <ul className="space-y-2">
                                <li className="border-b border-white/10 pb-2">React / Next.js</li>
                                <li className="border-b border-white/10 pb-2">Tailwind CSS</li>
                                <li className="border-b border-white/10 pb-2">Node.js</li>
                                <li className="border-b border-white/10 pb-2">UI/UX Design</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
