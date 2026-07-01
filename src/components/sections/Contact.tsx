"use client";

import Reveal from "@/components/ui/Reveal";
import { useI18n } from "@/context/i18n";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/seishiiinsan" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gabin-hallosserie/" },
  { label: "Email", href: "mailto:gabinhalloss@gmail.com" },
];

export default function Contact() {
  const { t } = useI18n();

  return (
    <section id="contact" className="bg-black text-white min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header bar */}
      <div className="flex items-center gap-6 px-8 md:px-16 py-6 md:py-8 border-b-4 border-white">
        <span className="font-black text-xs uppercase tracking-[0.25em] text-white/40">05</span>
        <span className="font-black uppercase tracking-widest text-sm">{t.contact.title}</span>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 justify-between p-8 md:p-16 gap-20">
        <Reveal>
          <p className="font-black uppercase leading-[0.85] text-[clamp(3rem,9vw,8rem)] max-w-5xl">
            {t.contact.headline1}<span className="text-[#FFDD00] px-3">?</span>
            <br />
            {t.contact.headline2}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 md:gap-6 items-end">
          {/* Email CTA */}
          <Reveal>
            <a
              href="mailto:gabinhalloss@gmail.com"
              className="group inline-flex flex-col gap-2"
            >
              <span className="font-black uppercase text-xs tracking-widest text-white/40">
                {t.contact.drop}
              </span>
              <span className="font-black text-xl md:text-2xl border-b-4 border-white group-hover:border-[#FFDD00] group-hover:text-[#FFDD00] transition-colors duration-150 pb-1">
                gabinhalloss@gmail.com
              </span>
            </a>
          </Reveal>

          {/* Socials */}
          <Reveal delay={0.1}>
            <ul className="flex flex-wrap gap-4 md:justify-end">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center px-5 py-3 font-black uppercase tracking-widest text-sm border-2 border-white shadow-[4px_4px_0_#fff] hover:shadow-[6px_6px_0_#FFDD00] hover:border-[#FFDD00] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
                  >
                    {s.label} →
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Footer */}
        <Reveal delay={0.15}>
          <div className="flex flex-col gap-6 pt-8 border-t-4 border-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="font-black uppercase tracking-tighter text-lg">
                GH<span className="text-[#FFDD00]">.</span>
              </span>
              <span className="font-bold text-xs uppercase tracking-widest text-white/40">
                © {new Date().getFullYear()} Gabin Hallosserie — {t.contact.copyright}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
