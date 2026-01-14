import { Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Noise from "@/components/Noise";
import { LanguageProvider } from "@/context/LanguageContext";

const globalNextFont = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins"
});

export const metadata = {
    title: "Gabin Hallosserie | Creative Developer",
    description: "Portfolio de Gabin Hallosserie, développeur web créatif spécialisé en React, Next.js et design interactif.",
    keywords: ["Développeur Web", "Creative Developer", "Portfolio", "Next.js", "React", "Frontend"],
    openGraph: {
        title: "Gabin Hallosserie | Creative Developer",
        description: "Découvrez mes projets et mon univers créatif.",
        url: "https://gabin.dev",
        siteName: "Gabin Hallosserie Portfolio",
        locale: "fr_FR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Gabin Hallosserie | Creative Developer",
        description: "Découvrez mes projets et mon univers créatif.",
    },
};

export default function RootLayout({children}) {
    return (
        <html lang="fr">
            <body className={`${globalNextFont.variable} font-sans antialiased bg-black text-white selection:bg-white selection:text-black`}>
                <LanguageProvider>
                    <Preloader />
                    <Noise />
                    <SmoothScroll>
                        {children}
                    </SmoothScroll>
                </LanguageProvider>
            </body>
        </html>
    );
}
