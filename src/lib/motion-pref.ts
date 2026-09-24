"use client";

import { useSyncExternalStore } from "react";

const KEY = "motion";
const EVENT = "motion-pref";

function read(): boolean {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "reduce") return true;
    if (v === "full") return false;
  } catch {}
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    mq.removeEventListener("change", cb);
  };
}

export function useReducedMotionPref() {
  return useSyncExternalStore(subscribe, read, () => false);
}

export function setReducedMotion(reduce: boolean) {
  try {
    localStorage.setItem(KEY, reduce ? "reduce" : "full");
  } catch {}
  document.documentElement.dataset.motion = reduce ? "reduce" : "full";
  window.dispatchEvent(new Event(EVENT));
}

export function isReducedMotion() {
  return typeof window !== "undefined" && read();
}
