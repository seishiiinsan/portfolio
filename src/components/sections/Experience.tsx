"use client";

import Reveal from "@/components/ui/Reveal";
import ScrambleText from "@/components/ui/ScrambleText";
import { useI18n } from "@/context/i18n";

type EntryType = "work" | "education" | "personal";

interface TimelineEntry {
  years: string;
  title: string;
  subtitle: string;
  tag: string;
  type: EntryType;
}

const TIMELINE: TimelineEntry[] = [
  {
    years: "2026 — 2028",
    title: "Master Expert\nArchitecture & Engineering",
    subtitle: "Apprenticeship @ BeProject",
    tag: "Work",
    type: "work",
  },
  {
    years: "2025 — 2026",
    title: "Bachelor CDWFS\nWeb & Full-Stack",
    subtitle: "Apprenticeship @ BeProject",
    tag: "Work",
    type: "work",
  },
  {
    years: "2024 — 2025",
    title: "Career Transition",
    subtitle: "Personal web projects + day job",
    tag: "Personal",
    type: "personal",
  },
  {
    years: "2023 — 2024",
    title: "BTS SIO SLAM\nYear 2 · Diploma",
    subtitle: "Mind-map research app for middle school",
    tag: "Education",
    type: "education",
  },
  {
    years: "2022 — 2023",
    title: "BTS SIO SLAM\nYear 1",
    subtitle: "Parent-teacher communication platform",
    tag: "Education",
    type: "education",
  },
  {
    years: "2020 — 2022",
    title: "NSI Specialization\nComputer Science",
    subtitle: "Python, algorithms, first code",
    tag: "Education",
    type: "education",
  },
];

const TAG_STYLE: Record<EntryType, string> = {
  work: "bg-[#FFDD00] text-black",
  education: "border border-white/30 text-white/50",
  personal: "border border-white/30 text-white/50",
};

export default function Experience() {
  const { t } = useI18n();

  return (
    <section
      id="experience"
      className="bg-black text-white border-b-4 border-white min-h-[calc(100vh-4rem)] flex flex-col"
    >
      {/* Header bar */}
      <div className="flex items-center gap-6 px-8 md:px-16 py-6 md:py-8 border-b-4 border-white shrink-0">
        <span className="font-black text-xs uppercase tracking-[0.25em] text-white/40">03</span>
        <ScrambleText text={t.experience.title} className="font-black uppercase tracking-widest text-sm" />
      </div>

      {/* Grid — 2 cols × 3 rows, fills remaining height */}
      <div className="grid md:grid-cols-2 flex-1">
        {TIMELINE.map((entry, i) => (
          <Reveal key={entry.years} delay={i * 0.05}>
            <div
              className={[
                "flex flex-col justify-between gap-4 p-8 md:p-10 h-full",
                "border-b-2 border-white/10",
                i % 2 === 0 ? "md:border-r-2 md:border-white/10" : "",
              ].join(" ")}
            >
              {/* Top: year + badge */}
              <div className="flex items-center justify-between gap-4">
                <span className="font-black text-[#FFDD00] text-xs tracking-widest uppercase">
                  {entry.years}
                </span>
                <span
                  className={`px-2 py-0.5 font-black uppercase text-[10px] tracking-widest ${TAG_STYLE[entry.type]}`}
                >
                  {entry.tag}
                </span>
              </div>

              {/* Bottom: title + subtitle */}
              <div className="flex flex-col gap-2">
                <h3 className="font-black uppercase text-lg md:text-xl leading-tight whitespace-pre-line">
                  {entry.title}
                </h3>
                <p className="font-bold text-xs uppercase tracking-widest text-white/40">
                  {entry.subtitle}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
