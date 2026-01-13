import { Poppins } from "next/font/google";
import "./globals.css";

const globalNextFont = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
    title: "Gabin Hallosserie - Portfolio",
    description: "Étudiant en programmation web, venez découvrir mes projets et mes expériences",
};

export default function RootLayout({children}) {
    return (
        <html lang="fr">
            <body className={`${globalNextFont.className} antialiased`}>
                {children}
            </body>
        </html>
    );
}
