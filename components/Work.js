"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { projects } from "@/data/projects";
import { Github, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Composant Carte Projet avec effet Parallaxe Souris
function ProjectCard({ project, onClick, index }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Gestion du clavier pour ouvrir la modale
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <motion.div
            ref={ref}
            layoutId={`card-container-${project.id}`}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            tabIndex={0} // Rend la carte focusable
            role="button"
            aria-label={`Voir les détails du projet ${project.title}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`group cursor-pointer perspective-1000 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl ${project.className || ""}`}
        >
            <motion.div 
                layoutId={`card-image-${project.id}`}
                className="aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden mb-6 relative z-10 shadow-xl"
                style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
            >
                {project.image ? (
                    <Image 
                        src={project.image} 
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} to-black group-hover:scale-110 transition-transform duration-700 ease-out`}></div>
                )}
                
                <motion.div 
                    layoutId={`card-year-${project.id}`}
                    className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono border border-white/10 z-20"
                    style={{ transform: "translateZ(30px)" }}
                >
                    {project.year}
                </motion.div>
            </motion.div>
            <div style={{ transform: "translateZ(10px)" }}>
                <motion.h3 
                    layoutId={`card-title-${project.id}`}
                    className={`text-3xl font-bold mb-2 transition-colors ${project.hoverColor}`}
                >
                    {project.title}
                </motion.h3>
                <motion.div 
                    layoutId={`card-tags-${project.id}`}
                    className="flex gap-3 text-sm text-gray-400"
                >
                    {project.tags.map((tag, i) => (
                        <span key={i}>
                            {tag}
                            {i < project.tags.length - 1 && <span className="mx-2">•</span>}
                        </span>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function Work() {
    const [selectedId, setSelectedId] = useState(null);
    const lenis = useLenis();
    const { t, language } = useLanguage();

    useEffect(() => {
        if (selectedId) {
            lenis?.stop();
        } else {
            lenis?.start();
        }
    }, [selectedId, lenis]);

    // Fermer la modale avec Echap
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setSelectedId(null);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <section id="work" className="py-32 px-6 md:px-20 relative perspective-1000">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-12"
            >
                {t.work.title}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {projects.map((project, index) => (
                    <ProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index} 
                        onClick={() => setSelectedId(project.id)} 
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedId && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] cursor-pointer"
                            aria-hidden="true"
                        />
                        <div 
                            className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none p-4 md:p-10"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`modal-title-${selectedId}`}
                        >
                            {projects.map((project) => (
                                project.id === selectedId && (
                                    <motion.div
                                        layoutId={`card-container-${project.id}`}
                                        key={project.id}
                                        className="w-full max-w-4xl bg-neutral-900 rounded-3xl shadow-2xl pointer-events-auto relative flex flex-col max-h-[85vh]"
                                    >
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                            className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                                            aria-label="Fermer la modale"
                                        >
                                            ✕
                                        </button>

                                        <div 
                                            className="overflow-y-auto flex-1 rounded-3xl custom-scrollbar"
                                            data-lenis-prevent
                                        >
                                            <motion.div 
                                                layoutId={`card-image-${project.id}`}
                                                className="aspect-[1470/923] w-full relative shrink-0"
                                            >
                                                {project.image ? (
                                                    <Image 
                                                        src={project.image} 
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} to-black`}></div>
                                                )}
                                                <motion.div 
                                                    layoutId={`card-year-${project.id}`}
                                                    className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono border border-white/10 z-20"
                                                >
                                                    {project.year}
                                                </motion.div>
                                            </motion.div>

                                            <div className="p-8 md:p-12">
                                                <motion.h3 
                                                    layoutId={`card-title-${project.id}`}
                                                    id={`modal-title-${project.id}`}
                                                    className="text-4xl md:text-5xl font-bold mb-4"
                                                >
                                                    {project.title}
                                                </motion.h3>
                                                
                                                <motion.div 
                                                    layoutId={`card-tags-${project.id}`}
                                                    className="flex gap-3 text-sm text-gray-400 mb-8"
                                                >
                                                    {project.tags.map((tag, i) => (
                                                        <span key={i}>
                                                            {tag}
                                                            {i < project.tags.length - 1 && <span className="mx-2">•</span>}
                                                        </span>
                                                    ))}
                                                </motion.div>

                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line"
                                                >
                                                    {project.description[language]}
                                                </motion.div>

                                                <div className="flex flex-wrap gap-4">
                                                    {project.websiteUrl && (
                                                        <a 
                                                            href={project.websiteUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="focus:outline-none"
                                                        >
                                                            <motion.button
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.3 }}
                                                                className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                                                            >
                                                                <Globe size={20} />
                                                                {t.work.viewSite}
                                                            </motion.button>
                                                        </a>
                                                    )}
                                                    
                                                    {project.repoUrl && (
                                                        <a 
                                                            href={project.repoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="focus:outline-none"
                                                        >
                                                            <motion.button
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.4 }}
                                                                className="border border-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                                                            >
                                                                <Github size={20} />
                                                                {t.work.viewCode}
                                                            </motion.button>
                                                        </a>
                                                    )}
                                                </div>
                                                
                                                <div className="h-20"></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
