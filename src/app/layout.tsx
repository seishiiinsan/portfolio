import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Cursor from "@/components/ui/Cursor";
import ConsoleBranding from "@/components/ui/ConsoleBranding";
import Navbar from "@/components/layout/Navbar";
import { I18nProvider } from "@/context/i18n";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Gabin Hallosserie — Full-Stack Developer",
  description: "Full-stack developer & creative engineer. I build polished interfaces and creative web experiences.",
  openGraph: {
    title: "Gabin Hallosserie — Full-Stack Developer",
    description: "Full-stack developer & creative engineer. I build polished interfaces and creative web experiences.",
    url: "https://gabinhallosserie.dev",
    siteName: "Gabin Hallosserie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabin Hallosserie — Full-Stack Developer",
    description: "Full-stack developer & creative engineer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} dark antialiased`}
    >
      <body className="bg-black text-white">
        <I18nProvider>
          <SmoothScroll>
            <Cursor />
            <ConsoleBranding />
            <ScrollProgress />
            <Navbar />
            <main className="pt-16">{children}</main>
          </SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
