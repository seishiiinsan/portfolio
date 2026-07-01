"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { useI18n } from "@/context/i18n";
import { PROJECT_DESCRIPTIONS } from "@/lib/translations";

interface Project {
  id: string;
  title: string;
  projectKey: string;
  stack: string[];
  image: string;
  github?: string;
  live?: string;
}

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Sekai",
    projectKey: "sekai",
    stack: ["Next.js", "TypeScript", "Spaced Repetition", "Gamification"],
    image: "/sekai.png",
    github: "https://github.com/seishiiinsan/sekai",
    live: "https://sekai-bice.vercel.app",
  },
  {
    id: "02",
    title: "Mugen",
    projectKey: "mugen",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase"],
    image: "/mugen.png",
    github: "https://github.com/seishiiinsan/mugen",
    live: "https://mugen-prono.netlify.app",
  },
];

function ProjectCard({ project, delay = 0, codeLabel, liveLabel, description }: { project: Project; delay?: number; codeLabel: string; liveLabel: string; description: string }) {
  return (
    <Reveal delay={delay}>
      <article className="group flex flex-col border-2 border-white shadow-[4px_4px_0_#FFDD00] hover:shadow-[6px_6px_0_#FFDD00] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 h-full">
        {/* Image */}
        <div className="aspect-video border-b-2 border-white overflow-hidden relative">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
            priority
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-8 gap-5">
          <div className="flex items-start justify-between gap-4">
            <span className="font-black text-xs text-white/40 tracking-widest">{project.id}</span>
            <div className="flex gap-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-black uppercase text-xs tracking-widest border-2 border-white px-2 py-1 hover:bg-white hover:text-black transition-colors duration-150"
                >
                  {codeLabel}
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-black uppercase text-xs tracking-widest border-2 border-[#FFDD00] text-[#FFDD00] px-2 py-1 hover:bg-[#FFDD00] hover:text-black transition-colors duration-150"
                >
                  {liveLabel} ↗
                </a>
              )}
            </div>
          </div>

          <h3 className="font-black uppercase text-2xl leading-tight">{project.title}</h3>

          <p className="text-white/60 text-sm leading-relaxed flex-1">{description}</p>

          <ul className="flex flex-wrap gap-3 pt-5 border-t-2 border-white/20">
            {project.stack.map((s) => (
              <li key={s} className="font-bold text-xs uppercase tracking-wide text-[#FFDD00]">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export default function Work() {
  const { t, lang } = useI18n();

  return (
    <section id="work" className="bg-black text-white border-b-4 border-white">
      {/* Header bar */}
      <div className="flex items-center gap-6 px-8 md:px-16 py-6 md:py-8 border-b-4 border-white">
        <span className="font-black text-xs uppercase tracking-[0.25em] text-white/40">03</span>
        <span className="font-black uppercase tracking-widest text-sm">{t.work.title}</span>
      </div>

      <div className="p-8 md:p-16">
        <div className="grid sm:grid-cols-2 gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={i * 0.1} codeLabel={t.work.code} liveLabel={t.work.live} description={PROJECT_DESCRIPTIONS[project.projectKey]?.[lang] ?? ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
