"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { useLanguage } from "@/context/LanguageContext";

const menuVariants = {
  closed: {
    x: "100%",
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1]
    }
  },
  open: {
    x: "0%",
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

const linkVariants = {
  closed: {
    x: 80,
    opacity: 0
  },
  open: (i) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.1 + i * 0.1,
      ease: [0.76, 0, 0.24, 1]
    }
  })
};

export default function MobileMenu({ isOpen, setIsOpen }) {
  const lenis = useLenis();
  const { t } = useLanguage();

  const links = [
    { title: t.nav.work, href: "#work" },
    { title: t.nav.about, href: "#about" },
    { title: t.nav.contact, href: "#contact" }
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    if (lenis) {
        setTimeout(() => {
            lenis.scrollTo(href);
        }, 300);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed top-0 right-0 w-full md:w-[400px] h-screen bg-neutral-900 z-40 flex flex-col justify-center px-12"
        >
          <div className="flex flex-col gap-8">
            {links.map((link, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={linkVariants}
              >
                <a 
                  href={link.href} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-5xl font-bold text-white hover:text-blue-500 transition-colors cursor-pointer block"
                >
                  {link.title}
                </a>
              </motion.div>
            ))}
          </div>
          
          <div className="absolute bottom-12 left-12 text-gray-500 text-sm">
             <p>{t.menu.socials}</p>
             <div className="flex gap-4 mt-2 text-white">
                 <a href="#" className="hover:text-blue-500">LinkedIn</a>
                 <a href="#" className="hover:text-blue-500">GitHub</a>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
