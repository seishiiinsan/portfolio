"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "motion/react";

const ParticleGlobe = dynamic(
  () => import("@/components/three/ParticleGlobe"),
  { ssr: false }
);

const STAGGER = 0.1;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  };
}

export default function Hero() {
  const mouse = useRef({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  function handleMouseMove(e: React.MouseEvent) {
    mouse.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -((e.clientY / window.innerHeight) * 2 - 1),
    };
  }

  const Wrapper = prefersReduced ? "div" : motion.div;

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-4rem)] border-b-4 border-white flex flex-col"
    >
      {/* Section number */}
      <span className="absolute top-6 left-6 md:left-12 font-black text-xs uppercase tracking-[0.25em] text-white/40 select-none">
        01
      </span>

      <div className="flex flex-col md:grid md:grid-cols-2 flex-1">
        {/* ── Left: text ── */}
        <div className="flex flex-col justify-center px-6 md:px-12 py-24 md:py-0 border-b-4 md:border-b-0 border-white gap-8">
          {/* Label */}
          <Wrapper
            {...(!prefersReduced ? fadeUp(STAGGER * 0) : {})}
            className="inline-flex"
          >
            <span className="inline-block border-2 border-white px-3 py-1 text-xs font-black uppercase tracking-widest text-[#FFDD00]">
              Apprentice @ BeProject
            </span>
          </Wrapper>

          {/* Headline */}
          <Wrapper {...(!prefersReduced ? fadeUp(STAGGER * 1) : {})}>
            <h1 className="font-black uppercase leading-[0.9] text-white">
              <span className="block text-[clamp(3.5rem,10vw,8rem)]">
                Gabin
              </span>
              <span className="block text-[clamp(3.5rem,10vw,8rem)] text-[#FFDD00]">
                Hallosserie
              </span>
            </h1>
          </Wrapper>

          {/* Role */}
          <Wrapper {...(!prefersReduced ? fadeUp(STAGGER * 2) : {})}>
            <p className="font-bold uppercase tracking-widest text-sm text-white/60 border-l-4 border-[#FFDD00] pl-4">
              Full-Stack Developer
              <br />
              &amp; Creative Engineer
            </p>
          </Wrapper>

          {/* CTA row */}
          <Wrapper
            {...(!prefersReduced ? fadeUp(STAGGER * 3) : {})}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest text-sm bg-white text-black border-2 border-white shadow-[4px_4px_0_#FFDD00] hover:shadow-[6px_6px_0_#FFDD00] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
            >
              See my work
              <span aria-hidden>→</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest text-sm bg-transparent text-white border-2 border-white shadow-[4px_4px_0_#fff] hover:shadow-[6px_6px_0_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
            >
              Contact
            </a>
          </Wrapper>
        </div>

        {/* ── Right: globe ── */}
        <Wrapper
          {...(!prefersReduced ? { ...fadeUp(STAGGER * 2), className: "relative min-h-[50vh] md:min-h-0" } : { className: "relative min-h-[50vh] md:min-h-0" })}
        >
          <ParticleGlobe mouse={mouse} />
        </Wrapper>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none">
        <span className="font-bold uppercase text-[10px] tracking-[0.3em] text-white/40">
          Scroll
        </span>
        <motion.div
          className="w-0.5 h-8 bg-white/40 origin-top"
          animate={prefersReduced ? {} : { scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
