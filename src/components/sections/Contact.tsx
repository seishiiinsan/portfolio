import Reveal from "@/components/ui/Reveal";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/seishiiinsan" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gabin-hallosserie/" },
  { label: "Email", href: "mailto:gabinhalloss@gmail.com" },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-white text-black min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header bar */}
      <div className="flex items-center gap-6 px-6 md:px-12 py-5 border-b-4 border-black">
        <span className="font-black text-xs uppercase tracking-[0.25em] text-black/40">04</span>
        <span className="font-black uppercase tracking-widest text-sm">Contact</span>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 justify-between p-6 md:p-12 gap-16">
        <Reveal>
          <p className="font-black uppercase leading-[0.85] text-[clamp(3rem,9vw,8rem)] max-w-5xl">
            Got a project<span className="text-[#FFDD00] bg-black px-3">?</span>
            <br />
            Let&apos;s build it.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 md:gap-6 items-end">
          {/* Email CTA */}
          <Reveal>
            <a
              href="mailto:gabinhalloss@gmail.com"
              className="group inline-flex flex-col gap-2"
            >
              <span className="font-black uppercase text-xs tracking-widest text-black/40">
                Drop a line
              </span>
              <span className="font-black text-xl md:text-2xl border-b-4 border-black group-hover:border-[#FFDD00] group-hover:text-[#FFDD00] transition-colors duration-150 pb-1">
                gabinhalloss@gmail.com
              </span>
            </a>
          </Reveal>

          {/* Socials */}
          <Reveal delay={0.1}>
            <ul className="flex flex-wrap gap-3 md:justify-end">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center px-5 py-3 font-black uppercase tracking-widest text-sm border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#FFDD00] hover:border-[#FFDD00] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t-4 border-black">
            <span className="font-black uppercase tracking-tighter text-lg">
              GH<span className="text-[#FFDD00]">.</span>
            </span>
            <span className="font-bold text-xs uppercase tracking-widest text-black/40">
              © {new Date().getFullYear()} Gabin Hallosserie — All rights reserved
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
