"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export const LOADER_EVENT = "intro:done";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

function done() {
  window.__introDone = true;
  window.dispatchEvent(new Event(LOADER_EVENT));
}

export function Loader({ name }: { name: string }) {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro") === "1";
      sessionStorage.setItem("intro", "1");
    } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      done();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const dur = 1600;
    let raf = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          document.documentElement.style.overflow = "";
        }, 250);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={done}>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-fg p-4 text-bg md:p-8"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex justify-between font-mono text-xs uppercase">
            <span>{name}</span>
            <span>Portfolio ©{new Date().getFullYear()}</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="h-px flex-1 bg-current/20 mr-6 mb-4 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${n}%` }} />
            </div>
            <span className="text-[22vw] leading-[0.8] font-medium tracking-tighter tabular-nums md:text-[14vw]">
              {String(n).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
