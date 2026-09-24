"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** Carrousel 16:9 à défilement snap + visionneuse plein écran. */
export function GalleryCarousel({ images, title }: { images: string[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (el && slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  function onScroll() {
    const el = track.current;
    if (!el) return;
    const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
    setIndex(Math.min(images.length - 1, Math.round(el.scrollLeft / w)));
  }

  useEffect(() => {
    if (open === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", key);
    window.__lenis?.stop();
    return () => {
      window.removeEventListener("keydown", key);
      window.__lenis?.start();
    };
  }, [open, images.length]);

  const btn =
    "flex size-10 items-center justify-center rounded-full border border-fg/30 font-mono text-xs transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <div
        ref={track}
        onScroll={onScroll}
        data-lenis-prevent
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            data-cursor="view"
            onClick={() => setOpen(i)}
            aria-label={`${title} — ${i + 1}/${images.length}`}
            className="group relative aspect-video w-[85%] shrink-0 snap-start overflow-hidden bg-line md:w-[46%] lg:w-[38%]"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 38vw, (min-width: 768px) 46vw, 85vw"
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-6 flex items-center gap-6">
          <span className="font-mono text-xs tabular-nums text-muted">
            {pad(index + 1)} / {pad(images.length)}
          </span>
          <div className="relative h-px flex-1 bg-fg/15">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent"
              animate={{ width: `${((index + 1) / images.length) * 100}%` }}
              transition={{ duration: 0.6, ease }}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" className={btn} onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous">
              ←
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => goTo(index + 1)}
              disabled={index === images.length - 1}
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      )}

      {typeof document !== "undefined" &&
        createPortal(
      <AnimatePresence>
          {open !== null && (
            <motion.div
              role="dialog"
              aria-modal
              className="fixed inset-0 z-[95] flex flex-col bg-bg/95 p-4 backdrop-blur-sm md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(null)}
            >
              <div className="flex justify-between font-mono text-xs uppercase">
                <span className="tabular-nums">
                  {pad(open + 1)} / {pad(images.length)}
                </span>
                <button type="button" onClick={() => setOpen(null)} className="link-u uppercase">
                  Esc ×
                </button>
              </div>
              <div className="relative my-6 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={open}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <Image src={images[open]} alt="" fill sizes="100vw" className="object-contain" />
                  </motion.div>
                </AnimatePresence>
              </div>
              {images.length > 1 && (
                <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className={btn} onClick={() => setOpen((open - 1 + images.length) % images.length)} aria-label="Previous">
                    ←
                  </button>
                  <button type="button" className={btn} onClick={() => setOpen((open + 1) % images.length)} aria-label="Next">
                    →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
