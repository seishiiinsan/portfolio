import type { Metadata } from "next";
import "../globals.css";
import { grotesk, mono } from "../fonts";
import { themeScript } from "@/components/theme";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${grotesk.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
