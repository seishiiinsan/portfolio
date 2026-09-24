"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/[locale]/actions";
import type { Dict, Locale } from "@/lib/i18n";

export function NewsletterForm({ dict, locale }: { dict: Dict; locale: Locale }) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { status: "idle" });
  return (
    <form action={action} className="grid gap-3">
      <p className="text-2xl font-medium tracking-tight">{dict.newsletterTitle}</p>
      <p className="text-muted">{dict.newsletterText}</p>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="locale" value={locale} />
      <div className="flex border-b border-line focus-within:border-accent">
        <label htmlFor="nl-email" className="sr-only">
          {dict.email}
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          placeholder="you@domain.com"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-muted/60"
        />
        <button disabled={pending} className="font-mono text-xs uppercase hover:text-accent disabled:opacity-50">
          {dict.subscribe} →
        </button>
      </div>
      <p role="status" className="min-h-4 font-mono text-[11px] uppercase text-accent">
        {state.status === "ok" ? dict.subscribed : state.status === "error" ? dict.subscribeError : ""}
      </p>
    </form>
  );
}
