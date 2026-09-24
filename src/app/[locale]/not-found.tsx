"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDict } from "@/lib/i18n";

export default function NotFound() {
  const locale = usePathname().startsWith("/fr") ? "fr" : "en";
  const dict = getDict(locale);
  return (
    <section className="flex min-h-svh flex-col justify-end px-4 pb-10 md:px-8">
      <p className="font-mono text-xs uppercase text-muted">{dict.notFound}</p>
      <p className="text-[30vw] leading-[0.8] font-medium tracking-[-0.06em]">
        404<span className="text-accent">.</span>
      </p>
      <div className="mt-8 flex gap-6 font-mono text-xs uppercase">
        <Link href={`/${locale}`} className="link-u">
          ← {dict.home}
        </Link>
        <Link href={`/${locale}/projects`} className="link-u">
          {dict.notFoundCta} →
        </Link>
      </div>
    </section>
  );
}
