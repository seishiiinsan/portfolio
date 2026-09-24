"use client";

import dynamic from "next/dynamic";

// Chargés après l'hydratation : ne bloquent pas le premier rendu.
const SmoothScroll = dynamic(() => import("./smooth-scroll").then((m) => m.SmoothScroll), { ssr: false });
const Cursor = dynamic(() => import("./cursor").then((m) => m.Cursor), { ssr: false });
const EasterEgg = dynamic(() => import("./easter-egg").then((m) => m.EasterEgg), { ssr: false });
const ViewTracker = dynamic(() => import("./view-tracker").then((m) => m.ViewTracker), { ssr: false });

export function ClientExtras() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <EasterEgg />
      <ViewTracker />
    </>
  );
}

