"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendMessage, type ContactState } from "@/app/[locale]/actions";
import type { Dict } from "@/lib/i18n";

const field =
  "peer w-full border-b border-line bg-transparent pt-6 pb-3 text-xl outline-none transition-colors focus:border-accent md:text-2xl";
const label =
  "pointer-events-none absolute top-6 left-0 font-mono text-xs uppercase text-muted transition-all peer-focus:top-0 peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0";

export function ContactForm({ dict }: { dict: Dict }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { status: "idle" });

  return (
    <form action={action} className="grid gap-8">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-8 md:grid-cols-2">
        <label className="relative block">
          <input name="name" required placeholder=" " maxLength={200} className={field} />
          <span className={label}>{dict.name}</span>
        </label>
        <label className="relative block">
          <input name="email" type="email" required placeholder=" " maxLength={320} className={field} />
          <span className={label}>{dict.email}</span>
        </label>
      </div>
      <label className="relative block">
        <textarea name="body" required placeholder=" " rows={4} maxLength={5000} className={`${field} resize-none`} />
        <span className={label}>{dict.message}</span>
      </label>
      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={pending}
          className="group relative overflow-hidden rounded-full border border-fg px-8 py-4 font-mono text-xs uppercase transition-colors hover:border-accent hover:text-accent-fg disabled:opacity-50"
        >
          <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
          <span className="relative">{pending ? dict.sending : `${dict.send} →`}</span>
        </button>
        <AnimatePresence mode="wait">
          {state.status !== "idle" && !pending && (
            <motion.p
              key={state.status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`font-mono text-xs uppercase ${state.status === "ok" ? "text-accent" : "text-muted"}`}
              role="status"
            >
              {state.status === "ok" ? dict.sent : dict.error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
