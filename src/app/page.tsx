import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Work from "@/components/sections/Work";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Marquee />
      <Experience />
      <Work />
      <Marquee />
      <Contact />
    </>
  );
}
