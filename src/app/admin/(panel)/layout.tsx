import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "../actions";
import { ThemeToggle } from "@/components/theme";

const nav = [
  { href: "/admin", label: "Réglages" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/experiences", label: "Parcours" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/testimonials", label: "Témoignages" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/subscribers", label: "Abonnés" },
  { href: "/admin/stats", label: "Statistiques" },
];

export default async function Panel({ children }: LayoutProps<"/admin">) {
  const db = await requireAdmin();
  const { count } = await db.from("messages").select("id", { count: "exact", head: true }).eq("read", false);
  return (
    <div className="grid min-h-dvh md:grid-cols-[220px_1fr]">
      <aside className="flex flex-col gap-8 border-b border-line p-4 md:sticky md:top-0 md:h-dvh md:border-r md:border-b-0 md:p-6">
        <Link href="/" className="font-mono text-xs uppercase">
          ← Site
        </Link>
        <nav className="flex flex-wrap gap-4 md:flex-col md:gap-2">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="link-u w-fit text-lg font-medium">
              {n.label}
              {n.href === "/admin/messages" && !!count && (
                <span className="ml-2 rounded-full bg-accent px-2 align-middle font-mono text-[10px] text-accent-fg">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between gap-4">
          <ThemeToggle label="Thème" />
          <form action={signOut}>
            <button className="font-mono text-xs uppercase text-muted hover:text-fg">Déconnexion</button>
          </form>
        </div>
      </aside>
      <main className="p-4 md:p-10">{children}</main>
    </div>
  );
}
