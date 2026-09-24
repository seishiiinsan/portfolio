"use client";

import { useState } from "react";
import { input } from "./ui";

const presets = ["#be3455", "#3b5bff", "#ff5a1f", "#c6ff3d", "#0f0f0f", "#1f8a70"];

export function AccentPicker({ defaultValue }: { defaultValue: string }) {
  const [c, setC] = useState(defaultValue);
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <input type="color" value={c} onChange={(e) => setC(e.target.value)} className="h-10 w-14 cursor-pointer border border-line bg-transparent" />
        <input name="accent" value={c} onChange={(e) => setC(e.target.value)} pattern="#[0-9a-fA-F]{6}" className={`${input} w-32 font-mono`} />
        {presets.map((p) => (
          <button key={p} type="button" onClick={() => setC(p)} className="size-7 rounded-full border border-line" style={{ background: p }} aria-label={p} />
        ))}
      </div>
      <div className="flex items-center gap-4 border border-line p-4">
        <span className="size-10 rounded-full" style={{ background: c }} />
        <span className="text-3xl font-medium tracking-tight">
          Aperçu<span style={{ color: c }}>.</span>
        </span>
      </div>
    </div>
  );
}
