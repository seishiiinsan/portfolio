import type { Settings } from "@/lib/types";
import { LocalTime } from "./local-time";

export function Footer({ s }: { s: Settings }) {
  return (
    <footer className="relative z-10 px-4 pt-24 pb-6 md:px-8">
      <div className="grid grid-cols-4 gap-4 border-t border-line pt-6 font-mono text-xs uppercase text-muted md:grid-cols-12 md:gap-6">
        <span className="col-span-2 md:col-span-3">
          © {new Date().getFullYear()} {s.name}
        </span>
        <span className="col-span-2 md:col-span-3">
          {s.location} · <LocalTime />
        </span>
        <div className="col-span-4 flex flex-wrap gap-4 md:col-span-6 md:justify-end">
          {s.socials.map((so) => (
            <a key={so.url} href={so.url} target="_blank" rel="noreferrer" className="link-u hover:text-fg">
              {so.label} ↗
            </a>
          ))}
        </div>
      </div>
      <p aria-hidden className="mt-10 select-none text-[16.5vw] leading-[0.75] font-medium tracking-[-0.06em] text-fg">
        {s.name.split(" ")[0]}
        <span className="text-accent">.</span>
      </p>
    </footer>
  );
}
