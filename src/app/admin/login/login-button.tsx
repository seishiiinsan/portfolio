"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await createClient().auth.signInWithOAuth({
          provider: "github",
          options: { redirectTo: `${location.origin}/auth/callback?next=/admin` },
        });
      }}
      className="rounded-full bg-fg px-8 py-4 font-mono text-xs uppercase text-bg transition-colors hover:bg-accent disabled:opacity-50"
    >
      {pending ? "Redirection…" : "Continuer avec GitHub →"}
    </button>
  );
}
