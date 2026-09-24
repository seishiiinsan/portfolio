import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import type { Post } from "@/lib/types";
import { Title } from "../../ui";

export default async function AdminPosts() {
  const db = await requireAdmin();
  const { data } = await db.from("posts").select("*").order("published_at", { ascending: false });
  const posts = (data ?? []) as Post[];
  const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
  return (
    <>
      <Title
        aside={
          <Link href="/admin/posts/new" className="rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase text-bg hover:bg-accent">
            + Nouvel article
          </Link>
        }
      >
        Blog
      </Title>
      {!posts.length && <p className="text-muted">Aucun article.</p>}
      <ul className="border-t border-line">
        {posts.map((p) => (
          <li key={p.id} className="flex items-center gap-4 border-b border-line py-4">
            <Link href={`/admin/posts/${p.id}`} className="link-u flex-1 text-xl font-medium tracking-tight">
              {p.title.fr || p.title.en || p.slug}
            </Link>
            <span className="font-mono text-xs uppercase text-muted">
              {p.published ? "publié" : "brouillon"} · {fmt.format(new Date(p.published_at))}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
