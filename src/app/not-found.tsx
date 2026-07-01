import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex flex-col">
      {/* Header bar */}
      <div className="flex items-center gap-6 px-8 md:px-16 py-6 md:py-8 border-b-4 border-white shrink-0">
        <span className="font-black text-xs uppercase tracking-[0.25em] text-white/40">404</span>
        <span className="font-black uppercase tracking-widest text-sm text-white/40">Not Found</span>
      </div>

      {/* Content */}
      <div className="flex flex-col md:grid md:grid-cols-2 flex-1">
        {/* Left — big number */}
        <div className="flex items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-white p-8 md:p-16">
          <span className="font-black uppercase leading-none text-[clamp(8rem,22vw,18rem)] text-white/[0.06] select-none border-4 border-white/10 px-8 py-4">
            404
          </span>
        </div>

        {/* Right — message + CTA */}
        <div className="flex flex-col justify-between p-8 md:p-16 gap-12">
          <div className="flex flex-col gap-6 mt-auto">
            <span className="inline-block border-2 border-[#FFDD00] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#FFDD00] w-fit">
              Page introuvable
            </span>
            <h1 className="font-black uppercase leading-[0.9] text-[clamp(2.5rem,6vw,5rem)]">
              Cette page<br />
              <span className="text-[#FFDD00]">n&apos;existe pas.</span>
            </h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-xs">
              Tu t&apos;es perdu ? Pas de panique.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 w-fit px-6 py-4 font-black uppercase tracking-widest text-sm bg-white text-black border-2 border-white shadow-[4px_4px_0_#FFDD00] hover:shadow-[6px_6px_0_#FFDD00] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
            >
              Retour à l&apos;accueil →
            </Link>

            <div className="flex items-center gap-4 pt-4 border-t-2 border-white/10">
              <span className="font-black uppercase tracking-tighter text-sm">
                GH<span className="text-[#FFDD00]">.</span>
              </span>
              <span className="text-white/20 font-bold text-xs uppercase tracking-widest">
                gabinhallosserie.dev
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
