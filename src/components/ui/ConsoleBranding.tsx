"use client";

import { useEffect } from "react";

export default function ConsoleBranding() {
  useEffect(() => {
    const y = "#FFDD00";
    const b = "color:#fff;font-family:monospace;font-size:11px";
    console.log(
      "%c  ██████╗ ██╗  ██╗\n  ██╔════╝ ██║  ██║\n  ██║  ███╗███████║\n  ██║   ██║██╔══██║\n  ╚██████╔╝██║  ██║\n   ╚═════╝ ╚═╝  ╚═╝",
      `color:${y};font-family:monospace;font-size:11px;line-height:1.4`
    );
    console.log("%c👋 Hey, you found the source.", `${b};font-size:13px;font-weight:bold`);
    console.log(`%c✉  gabinhalloss@gmail.com`, b);
    console.log(`%c⚡  Next.js · TypeScript · Three.js · Motion · GSAP`, b);
  }, []);

  return null;
}
