"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { input } from "./ui";

/** Upload vers Supabase Storage (bucket media) ; stocke les URLs publiques dans un champ caché. */
export function MediaInput({
  name,
  defaultValue = [],
  multiple,
  accept = "image/*",
}: {
  name: string;
  defaultValue?: string[];
  multiple?: boolean;
  accept?: string;
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setErr("");
    const sb = createClient();
    const out: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
      const { error } = await sb.storage.from("media").upload(path, file, { contentType: file.type });
      if (error) {
        setErr(error.message);
        continue;
      }
      out.push(sb.storage.from("media").getPublicUrl(path).data.publicUrl);
    }
    setUrls((u) => (multiple ? [...u, ...out] : out.slice(0, 1)));
    setBusy(false);
  }

  const isImg = accept.startsWith("image");

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={urls.join("\n")} />
      {urls.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {urls.map((u, i) => (
            <li key={u} className="group relative">
              {isImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u} alt="" className="h-24 w-32 border border-line object-cover" />
              ) : (
                <a href={u} target="_blank" rel="noreferrer" className="link-u font-mono text-xs">
                  {u.split("/").pop()}
                </a>
              )}
              <div className="absolute top-1 right-1 hidden gap-1 group-hover:flex">
                {multiple && i > 0 && (
                  <button
                    type="button"
                    onClick={() => setUrls((a) => { const b = [...a]; [b[i - 1], b[i]] = [b[i], b[i - 1]]; return b; })}
                    className="bg-bg px-1.5 font-mono text-xs"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setUrls((a) => a.filter((x) => x !== u))}
                  className="bg-accent px-1.5 font-mono text-xs text-accent-fg"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={busy}
        onChange={(e) => upload(e.target.files)}
        className={`${input} font-mono text-xs file:mr-3 file:border-0 file:bg-fg file:px-3 file:py-1 file:text-bg`}
      />
      {busy && <span className="font-mono text-xs text-muted">Upload…</span>}
      {err && <span className="font-mono text-xs text-accent">{err}</span>}
    </div>
  );
}
