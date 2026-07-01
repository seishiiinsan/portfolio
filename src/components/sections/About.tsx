"use client";

import Reveal from "@/components/ui/Reveal";
import ScrambleText from "@/components/ui/ScrambleText";
import { useI18n } from "@/context/i18n";

const SKILLS = [
  "TypeScript", "React", "Next.js", "Node.js",
  "Tailwind CSS", "PostgreSQL", "Docker", "Git",
  "GSAP", "Three.js", "Motion", "REST / GraphQL",
];

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="bg-white text-black border-b-4 border-black min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header bar */}
      <div className="flex items-center gap-6 px-8 md:px-16 py-6 md:py-8 border-b-4 border-black">
        <span className="font-black text-xs uppercase tracking-[0.25em] text-black/40">02</span>
        <ScrambleText text={t.about.title} className="font-black uppercase tracking-widest text-sm" />
      </div>

      <div className="grid md:grid-cols-[1fr_1.2fr] flex-1">
        {/* Left — big statement */}
        <div className="flex flex-col justify-between p-8 md:p-16 border-b-4 md:border-b-0 md:border-r-4 border-black gap-16">
          <Reveal>
            <p className="font-black uppercase leading-[0.9] text-[clamp(2.5rem,6vw,5rem)]">
              {t.about.statement_before}{" "}
              <span className="bg-[#FFDD00] px-2">{t.about.statement_highlight}</span>{" "}
              {t.about.statement_after}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-1 border-l-4 border-black pl-4">
              <span className="font-black uppercase text-xs tracking-widest text-black/40">
                {t.about.current_label}
              </span>
              <span className="font-bold text-lg">{t.about.current_value}</span>
            </div>
          </Reveal>
        </div>

        {/* Right — bio + skills */}
        <div className="flex flex-col justify-between p-8 md:p-16 gap-16">
          <Reveal>
            <p className="text-lg font-medium leading-relaxed max-w-prose">
              {t.about.bio}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <span className="font-black uppercase text-xs tracking-widest text-black/40">
                {t.about.stack_label}
              </span>
              <ul className="flex flex-wrap gap-3">
                {SKILLS.map((skill) => (
                  <li key={skill}>
                    <span className="inline-block border-2 border-black px-4 py-1.5 font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white hover:shadow-[4px_4px_0_#FFDD00] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 cursor-default">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
