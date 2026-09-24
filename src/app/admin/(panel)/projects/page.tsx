import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import type { Project } from "@/lib/types";
import { moveProject } from "../../actions";
import { Title } from "../../ui";

export default async function AdminProjects() {
  const db = await requireAdmin();
  const { data } = await db.from("projects").select("*").order("position").order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  return (
    <>
      <Title
        aside={
          <Link href="/admin/projects/new" className="rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase text-bg hover:bg-accent">
            + Nouveau
          </Link>
        }
      >
        Projets
      </Title>
      {!projects.length && <p className="text-muted">Aucun projet.</p>}
      <ul className="border-t border-line">
        {projects.map((p, i) => (
          <li key={p.id} className="flex items-center gap-4 border-b border-line py-4">
            <span className="w-8 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
            <Link href={`/admin/projects/${p.id}`} className="link-u flex-1 text-xl font-medium tracking-tight">
              {p.title.fr || p.title.en || p.slug}
            </Link>
            <span className="hidden font-mono text-xs uppercase text-muted md:inline">
              {p.featured && "★ "}
              {p.published ? "publié" : "brouillon"} · {p.year ?? "—"}
            </span>
            {(["up", "down"] as const).map((dir) => (
              <form key={dir} action={moveProject}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="dir" value={dir} />
                <button
                  disabled={(dir === "up" && i === 0) || (dir === "down" && i === projects.length - 1)}
                  className="px-2 font-mono text-xs disabled:opacity-20"
                  aria-label={dir}
                >
                  {dir === "up" ? "↑" : "↓"}
                </button>
              </form>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
}
