import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("../sentry.server.config");
  if (process.env.NEXT_RUNTIME === "edge") await import("../sentry.edge.config");
}

// Remonte les erreurs des Server Components, route handlers et server actions.
// Flush explicite : sur Vercel la fonction peut être gelée avant l'envoi en arrière-plan.
export async function onRequestError(...args: Parameters<typeof Sentry.captureRequestError>) {
  Sentry.captureRequestError(...args);
  await Sentry.flush(2000);
}
