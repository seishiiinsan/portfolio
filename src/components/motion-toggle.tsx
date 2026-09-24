"use client";

import { setReducedMotion, useReducedMotionPref } from "@/lib/motion-pref";

export function MotionToggle({ labels }: { labels: { reduceMotion: string; motionOn: string } }) {
  const reduce = useReducedMotionPref();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={reduce}
      onClick={() => setReducedMotion(!reduce)}
      className="link-u w-fit uppercase hover:text-fg"
    >
      {reduce ? `${labels.motionOn} ↺` : labels.reduceMotion}
    </button>
  );
}
