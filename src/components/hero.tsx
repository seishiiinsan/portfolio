"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitText, useIntroDone } from "./reveal";
import { LocalTime } from "./local-time";

export function Hero({
  name,
  role,
  text,
  location,
  available,
  labels,
}: {
  name: string;
  role: string;
  text: string;
  location: string;
  available: boolean;
  labels: { available: string; unavailable: string; scroll: string; localTime: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const intro = useIntroDone();
  const [first, ...rest] = name.split(" ");
  const ease = [0.22, 1, 0.36, 1] as const;

  const meta = (d: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: intro ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease, delay: d },
  });

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col justify-between px-4 pt-24 pb-6 md:px-8">
      <motion.div style={{ opacity }} className="grid grid-cols-4 gap-4 font-mono text-xs uppercase md:grid-cols-12 md:gap-6">
        <motion.span {...meta(0.9)} className="col-span-2 md:col-span-3">
          {role}
        </motion.span>
        <motion.span {...meta(1)} className="col-span-2 md:col-span-3">
          {location} — <LocalTime />
        </motion.span>
        <motion.span {...meta(1.1)} className="col-span-4 flex items-center gap-2 md:col-span-3 md:col-start-10 md:justify-end">
          <span className="relative flex size-2">
            {available && <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />}
            <span className={`relative size-2 rounded-full ${available ? "bg-accent" : "bg-muted"}`} />
          </span>
          {available ? labels.available : labels.unavailable}
        </motion.span>
      </motion.div>

      <div className="relative">
        <motion.p
          style={{ y: y2, opacity }}
          className="mb-8 max-w-md text-lg leading-snug md:ml-[calc(50%+0.75rem)] md:text-xl"
          initial={{ opacity: 0 }}
          animate={intro ? { opacity: 1 } : undefined}
          transition={{ duration: 1.2, delay: 1.1 }}
        >
          {text}
        </motion.p>
        <motion.h1 style={{ y: y1 }} className="font-medium leading-[0.82] tracking-[-0.065em]" aria-label={name}>
          <SplitText text={first} waitIntro className="block text-[23vw] md:text-[19vw]" stagger={0.05} />
          <span className="flex items-end justify-between gap-4">
            <SplitText
              text={rest.join(" ")}
              waitIntro
              delay={0.25}
              stagger={0.04}
              className="block text-[14.5vw] md:text-[12.2vw]"
            />
            <motion.span
              className="mb-[2vw] hidden size-[4vw] shrink-0 rounded-full bg-accent md:block"
              initial={{ scale: 0 }}
              animate={intro ? { scale: 1 } : undefined}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1 }}
            />
          </span>
        </motion.h1>
      </div>

      <motion.div
        style={{ opacity }}
        className="mt-6 flex items-center justify-between font-mono text-xs uppercase text-muted"
        {...meta(1.3)}
      >
        <span>(Portfolio ©{new Date().getFullYear()})</span>
        <span className="flex items-center gap-2">
          {labels.scroll}
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            ↓
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
}
