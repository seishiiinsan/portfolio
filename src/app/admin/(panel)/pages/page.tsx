import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import type { Page } from "@/lib/types";
import { Title } from "../../ui";

const ROUTES: Record<string, string> = { now: "/now", uses: "/uses", studio: "/studio" };

export default async function AdminPages({ searchParams }: PageProps<"/admin/pages">) {
  const db = await requireAdmin();
  const { data } = await db.from("pages").select("*").order("slug");
  const pages = (data ?? []) as Page[];
  const { saved } = await searchParams;
  return (
    <>
      <Title aside={saved && <span className="font-mono text-xs uppercase text-accent">Enregistré ✓</span>}>Pages</Title>
      <ul className="border-t border-line">
        {pages.map((p) => (
          <li key={p.slug} className="flex items-center gap-4 border-b border-line py-4">
            <Link href={`/admin/pages/${p.slug}`} className="link-u flex-1 text-xl font-medium tracking-tight">
              {p.title.fr || p.slug}
            </Link>
            {ROUTES[p.slug] && (
              <a href={`/fr${ROUTES[p.slug]}`} target="_blank" rel="noreferrer" className="font-mono text-xs uppercase text-muted hover:text-fg">
                /fr{ROUTES[p.slug]} ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
