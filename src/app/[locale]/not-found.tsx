import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col justify-end px-4 pb-10 md:px-8">
      <p className="text-[30vw] leading-[0.8] font-medium tracking-[-0.06em]">
        404<span className="text-accent">.</span>
      </p>
      <Link href="/" className="link-u mt-8 w-fit font-mono text-xs uppercase">
        ← Home
      </Link>
    </section>
  );
}
