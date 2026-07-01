"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black border-b-4 border-white">
        <nav className="flex items-center justify-between px-6 md:px-12 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-black uppercase tracking-tighter text-xl text-white leading-none"
          >
            GH<span className="text-[#FFDD00]">.</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-5 py-1 font-bold uppercase tracking-widest text-sm text-white border-2 border-transparent hover:border-white hover:shadow-[4px_4px_0_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col justify-center gap-1.5 w-10 h-10 border-2 border-white p-2 hover:shadow-[4px_4px_0_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-0.5 bg-white transition-transform duration-200 ${open ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 bg-white transition-transform duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black border-b-4 border-white flex flex-col justify-center items-start px-8 pt-16"
          >
            <ul className="flex flex-col gap-2 w-full">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 font-black uppercase tracking-widest text-4xl text-white border-b-2 border-white hover:text-[#FFDD00] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
