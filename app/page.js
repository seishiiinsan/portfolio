import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import SlidingText from "@/components/SlidingText";
import Contact from "@/components/Contact";

export default function Home() {
    return (
        <>
            <div className="relative z-10 bg-black">
                <Header />
                <main className="selection:bg-white selection:text-black">
                    <Hero />
                    <Work />
                    <About />
                    <SlidingText />
                </main>
            </div>
            <Contact />
        </>
    );
}
