import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co").hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Logs de build uniquement en CI.
  silent: !process.env.CI,
  // Source maps plus complètes pour des stack traces lisibles.
  widenClientFileUpload: true,
  // Passe les événements par /monitoring pour contourner les bloqueurs de pub.
  tunnelRoute: "/monitoring",
  telemetry: false,
});
