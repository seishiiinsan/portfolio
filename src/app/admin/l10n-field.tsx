"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useState } from "react";
import type { L10n } from "@/lib/i18n";

const input = "w-full border border-line bg-transparent px-3 py-2 outline-none transition-colors focus:border-accent";

const CASE_STUDY = {
  fr: "## Contexte\n\n\n## Problème\n\n\n## Solution\n\n\n## Choix techniques\n\n- \n\n## Résultats\n\n- \n\n## Mon rôle\n\n",
  en: "## Context\n\n\n## Problem\n\n\n## Solution\n\n\n## Technical choices\n\n- \n\n## Results\n\n- \n\n## My role\n\n",
};

/**
 * Champ bilingue FR/EN.
 * - `markdown` : onglets Édition / Aperçu + bouton « modèle étude de cas »
 * - bouton de traduction IA dans chaque sens (via /api/translate)
 */
export function L10nField({
  name,
  label,
  value,
  area,
  rows = 3,
  markdown,
  template,
}: {
  name: string;
  label: string;
  value?: L10n;
  area?: boolean;
  rows?: number;
  markdown?: boolean;
  template?: boolean;
}) {
  const [vals, setVals] = useState<L10n>({ fr: value?.fr ?? "", en: value?.en ?? "" });
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState<"fr" | "en" | null>(null);
  const [err, setErr] = useState("");
  const refs = { fr: useRef<HTMLTextAreaElement & HTMLInputElement>(null), en: useRef<HTMLTextAreaElement & HTMLInputElement>(null) };

  async function translate(to: "fr" | "en") {
    const from = to === "fr" ? "en" : "fr";
    if (!vals[from].trim()) return;
    setBusy(to);
    setErr("");
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: vals[from], from, to, markdown: !!markdown }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => null)) as { text?: string; error?: string } | null;
    setBusy(null);
    if (!res?.ok || !data?.text) return setErr(data?.error ?? "Traduction impossible");
    setVals((v) => ({ ...v, [to]: data.text! }));
  }

  const multiline = area || markdown;

  return (
    <div className="grid gap-2">
      {(markdown || template) && (
        <div className="flex flex-wrap gap-3 font-mono text-[11px] uppercase">
          {markdown && (
            <button type="button" onClick={() => setPreview((p) => !p)} className="link-u">
              {preview ? "Éditer" : "Aperçu"}
            </button>
          )}
          {template && (
            <button
              type="button"
              className="link-u"
              onClick={() =>
                setVals((v) => ({ fr: v.fr.trim() ? v.fr : CASE_STUDY.fr, en: v.en.trim() ? v.en : CASE_STUDY.en }))
              }
            >
              Modèle étude de cas
            </button>
          )}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {(["fr", "en"] as const).map((l) => (
          <div key={l} className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase text-muted">
                {label} ({l})
              </span>
              <button
                type="button"
                onClick={() => translate(l)}
                disabled={!!busy}
                className="font-mono text-[10px] uppercase text-muted hover:text-accent disabled:opacity-40"
                title={`Traduire depuis ${l === "fr" ? "EN" : "FR"}`}
              >
                {busy === l ? "…" : l === "fr" ? "← EN" : "← FR"}
              </button>
            </div>
            {preview && markdown ? (
              <>
                <input type="hidden" name={`${name}_${l}`} value={vals[l]} />
                <div className="prose-swiss min-h-40 border border-line p-3 text-base">
                  <Markdown remarkPlugins={[remarkGfm]}>{vals[l] || "_(vide)_"}</Markdown>
                </div>
              </>
            ) : multiline ? (
              <textarea
                ref={refs[l]}
                name={`${name}_${l}`}
                value={vals[l]}
                onChange={(e) => setVals((v) => ({ ...v, [l]: e.target.value }))}
                rows={rows}
                className={`${input} ${markdown ? "font-mono text-sm" : "font-sans"}`}
              />
            ) : (
              <input
                ref={refs[l]}
                name={`${name}_${l}`}
                value={vals[l]}
                onChange={(e) => setVals((v) => ({ ...v, [l]: e.target.value }))}
                className={input}
              />
            )}
          </div>
        ))}
      </div>
      {err && <p className="font-mono text-[11px] text-accent">{err}</p>}
    </div>
  );
}
