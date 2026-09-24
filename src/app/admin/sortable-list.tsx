"use client";

import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";

export type SortableItem = { id: string; label: ReactNode; meta?: ReactNode; href?: string };

/** Liste réordonnable au glisser-déposer (et au clavier via ↑ ↓). Sauvegarde à chaque changement. */
export function SortableList({ items, onReorder }: { items: SortableItem[]; onReorder: (ids: string[]) => Promise<void> }) {
  const [list, setList] = useState(items);
  const [dragged, setDragged] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [pending, start] = useTransition();

  const [prevItems, setPrevItems] = useState(items);
  if (prevItems !== items) {
    setPrevItems(items);
    setList(items);
  }

  function commit(next: SortableItem[]) {
    setList(next);
    start(() => onReorder(next.map((i) => i.id)));
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= list.length || from === to) return;
    const next = [...list];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    commit(next);
  }

  return (
    <ul className={`border-t border-line ${pending ? "opacity-60" : ""}`} aria-busy={pending}>
      {list.map((it, i) => (
        <li
          key={it.id}
          draggable
          onDragStart={(e) => {
            setDragged(i);
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(i);
          }}
          onDragEnd={() => {
            setDragged(null);
            setOver(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragged !== null) move(dragged, i);
            setDragged(null);
            setOver(null);
          }}
          className={`flex items-center gap-4 border-b border-line py-4 transition-colors ${
            over === i && dragged !== i ? "bg-accent/10" : ""
          } ${dragged === i ? "opacity-40" : ""}`}
        >
          <span className="cursor-grab select-none px-1 font-mono text-muted" aria-hidden title="Glisser pour réordonner">
            ⋮⋮
          </span>
          <span className="w-8 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
          {it.href ? (
            <Link href={it.href} className="link-u flex-1 text-xl font-medium tracking-tight">
              {it.label}
            </Link>
          ) : (
            <span className="flex-1 text-xl font-medium tracking-tight">{it.label}</span>
          )}
          {it.meta && <span className="hidden font-mono text-xs uppercase text-muted md:inline">{it.meta}</span>}
          <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="px-2 font-mono text-xs disabled:opacity-20" aria-label="Monter">
            ↑
          </button>
          <button
            type="button"
            onClick={() => move(i, i + 1)}
            disabled={i === list.length - 1}
            className="px-2 font-mono text-xs disabled:opacity-20"
            aria-label="Descendre"
          >
            ↓
          </button>
        </li>
      ))}
    </ul>
  );
}
