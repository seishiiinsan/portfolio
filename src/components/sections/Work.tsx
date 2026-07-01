import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  image: string;
  github?: string;
  live?: string;
}

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Sekai",
    description:
      "World geography learning app with daily 3-minute sessions and spaced repetition. Four game modes — Flags, Capitals, Map, Comparisons — with XP, streaks, activity heatmaps, and a global leaderboard to build long-term habits.",
    stack: ["Next.js", "TypeScript", "Spaced Repetition", "Gamification"],
    image: "/sekai.png",
    github: "https://github.com/seishiiinsan/sekai",
    live: "https://sekai-bice.vercel.app",
  },
  {
    id: "02",
    title: "Mugen",
    description:
      "Competitive football predictions platform. Players forecast exact match scores to earn points and climb a monthly global leaderboard. Features power-up boosts, achievement badges, friend networks, and private group leagues with shared prize pools.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase"],
    image: "/mugen.png",
    github: "https://github.com/seishiiinsan/mugen",
    live: "https://mugen-prono.netlify.app",
  },
];

function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
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
        <div className="flex flex-col flex-1 p-6 gap-4">
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
                  Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-black uppercase text-xs tracking-widest border-2 border-[#FFDD00] text-[#FFDD00] px-2 py-1 hover:bg-[#FFDD00] hover:text-black transition-colors duration-150"
                >
                  Live ↗
                </a>
              )}
            </div>
          </div>

          <h3 className="font-black uppercase text-2xl leading-tight">{project.title}</h3>

          <p className="text-white/60 text-sm leading-relaxed flex-1">{project.description}</p>

          <ul className="flex flex-wrap gap-2 pt-4 border-t-2 border-white/20">
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
  return (
    <section id="work" className="bg-black text-white border-b-4 border-white">
      {/* Header bar */}
      <div className="flex items-center gap-6 px-6 md:px-12 py-5 border-b-4 border-white">
        <span className="font-black text-xs uppercase tracking-[0.25em] text-white/40">03</span>
        <span className="font-black uppercase tracking-widest text-sm">Work</span>
      </div>

      <div className="p-6 md:p-12">
        <div className="grid sm:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
