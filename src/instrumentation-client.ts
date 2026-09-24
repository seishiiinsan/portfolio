import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === "production",
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  // 10 % des navigations tracées, pas de replay : reste dans le quota gratuit.
  tracesSampleRate: 0.1,
  // Bruit courant sans intérêt (extensions, réseau coupé).
  ignoreErrors: ["ResizeObserver loop", "Failed to fetch", "Load failed", "NetworkError"],
  denyUrls: [/^chrome-extension:\/\//, /^moz-extension:\/\//],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
