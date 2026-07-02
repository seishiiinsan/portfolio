"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&%*";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export default function ScrambleText({ text, className, delay = 0, speed = 32 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        timeout = setTimeout(() => {
          let frame = 0;
          const framesPerChar = 5;
          const nonSpaces = [...text].filter((c) => c !== " " && c !== "\n").length;
          const total = nonSpaces * framesPerChar;

          interval = setInterval(() => {
            let resolved = 0;
            setDisplay(
              [...text]
                .map((char) => {
                  if (char === " " || char === "\n") return char;
                  if (resolved < frame / framesPerChar) {
                    resolved++;
                    return char;
                  }
                  resolved++;
                  return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("")
            );
            frame++;
            if (frame > total) {
              clearInterval(interval);
              setDisplay(text);
            }
          }, speed);
        }, delay);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, speed, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
