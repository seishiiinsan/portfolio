"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/** Erreur fatale au niveau du layout racine : remontée à Sentry, page de secours minimale. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" data-theme="dark">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#0d0d0d", color: "#ecebe6", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ fontSize: 64, fontWeight: 600, margin: 0 }}>
            Oops<span style={{ color: "#be3455" }}>.</span>
          </p>
          <p style={{ opacity: 0.7 }}>Something went wrong. / Une erreur est survenue.</p>
          <button
            onClick={reset}
            style={{ marginTop: 16, padding: "10px 20px", borderRadius: 999, border: "1px solid currentColor", background: "none", color: "inherit", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
