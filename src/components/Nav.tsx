"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Work",       href: "#work" },
  { label: "Writing",    href: "#writing" },
  { label: "Newsletter", href: "#newsletter" },
  { label: "Contact",    href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-gutter py-6 max-w-container-max mx-auto transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-outline-variant/10"
          : "bg-transparent"
      }`}
    >
      <div className="font-headline-md font-bold text-on-background tracking-tighter text-xl">
        ABHISHEK GUPTA
      </div>

      <nav className="hidden md:flex items-center gap-8 font-label-caps text-label-caps uppercase">
        {navLinks.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="text-on-surface-variant hover:text-on-surface transition-colors first:text-primary first:border-b first:border-primary first:pb-1"
          >
            {label}
          </a>
        ))}
      </nav>

      <button className="font-label-caps text-label-caps text-primary border border-primary/40 px-4 py-2 rounded-lg bg-transparent hover:bg-primary/5 hover:border-primary transition-all cursor-pointer text-xs">
        AVAILABLE FOR PROJECTS
      </button>
    </header>
  );
}
