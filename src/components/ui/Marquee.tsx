"use client";

const ITEMS = [
  "Next.js",
  "TypeScript",
  "React",
  "GSAP",
  "Three.js",
  "PostgreSQL",
  "Supabase",
  "Docker",
  "Tailwind CSS",
  "Motion",
  "Full-Stack",
  "Creative Engineering",
  "AI-Powered",
  "Node.js",
  "REST / GraphQL",
];

const SEP = <span className="mx-6 text-black/40">★</span>;

function Track({ reverse = false }: { reverse?: boolean }) {
  const content = ITEMS.map((item, i) => (
    <span key={i} className="inline-flex shrink-0 items-center font-black uppercase text-sm tracking-widest">
      {item}{SEP}
    </span>
  ));

  return (
    <div className={`inline-flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
      {content}{content}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-[#FFDD00] text-black border-y-4 border-black py-3.5 select-none">
      <Track />
    </div>
  );
}
