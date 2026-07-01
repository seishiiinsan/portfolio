import Reveal from "@/components/ui/Reveal";

const SKILLS = [
  "TypeScript", "React", "Next.js", "Node.js",
  "Tailwind CSS", "PostgreSQL", "Docker", "Git",
  "GSAP", "Three.js", "Motion", "REST / GraphQL",
];

export default function About() {
  return (
    <section id="about" className="bg-white text-black border-b-4 border-black min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header bar */}
      <div className="flex items-center gap-6 px-6 md:px-12 py-5 border-b-4 border-black">
        <span className="font-black text-xs uppercase tracking-[0.25em] text-black/40">02</span>
        <span className="font-black uppercase tracking-widest text-sm">About</span>
      </div>

      <div className="grid md:grid-cols-[1fr_1.2fr] flex-1">
        {/* Left — big statement */}
        <div className="flex flex-col justify-between p-6 md:p-12 border-b-4 md:border-b-0 md:border-r-4 border-black gap-12">
          <Reveal>
            <p className="font-black uppercase leading-[0.9] text-[clamp(2.5rem,6vw,5rem)]">
              I build things that{" "}
              <span className="bg-[#FFDD00] px-2">move</span>{" "}
              &amp; last.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-1 border-l-4 border-black pl-4">
              <span className="font-black uppercase text-xs tracking-widest text-black/40">
                Current
              </span>
              <span className="font-bold text-lg">Apprentice @ BeProject</span>
            </div>
          </Reveal>
        </div>

        {/* Right — bio + skills */}
        <div className="flex flex-col justify-between p-6 md:p-12 gap-12">
          <Reveal>
            <p className="text-lg font-medium leading-relaxed max-w-prose">
              Full-stack developer with a passion for polished interfaces and
              creative web experiences. I work at the intersection of code and
              design — from smooth animations to robust architectures. I also
              leverage AI tools daily to ship faster and smarter, turning
              cutting-edge models into concrete product features.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <span className="font-black uppercase text-xs tracking-widest text-black/40">
                Stack
              </span>
              <ul className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <li key={skill}>
                    <span className="inline-block border-2 border-black px-3 py-1 font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white hover:shadow-[4px_4px_0_#FFDD00] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 cursor-default">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-4">
              <a
                href="/cv.pdf"
                className="inline-flex items-center gap-2 px-5 py-3 font-black uppercase tracking-widest text-sm bg-black text-white border-2 border-black shadow-[4px_4px_0_#FFDD00] hover:shadow-[6px_6px_0_#FFDD00] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
              >
                Download CV ↓
              </a>
              <a
                href="https://github.com/seishiiinsan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 font-black uppercase tracking-widest text-sm bg-transparent text-black border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
              >
                GitHub →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
