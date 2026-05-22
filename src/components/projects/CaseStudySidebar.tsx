"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

interface Links {
  github: string;
  demo: string;
  paper: string;
}

interface Props {
  sections: Section[];
  links: Links;
}

export default function CaseStudySidebar({ sections, links }: Props) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-32 space-y-12">
        <nav className="flex flex-col gap-4">
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-40 mb-2">
            On this page
          </p>
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`text-on-surface-variant hover:text-primary transition-all text-body-md border-l-2 pl-4 ${
                activeSection === id ? "scroll-spy-active" : "border-transparent"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="space-y-4">
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-40">
            Project Links
          </p>
          <div className="flex flex-col gap-2">
            <a
              className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors text-body-md"
              href={links.github}
            >
              <span className="material-symbols-outlined text-[20px]">code</span>
              GitHub Repository
            </a>
            <a
              className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors text-body-md"
              href={links.demo}
            >
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              Live Demo
            </a>
            <a
              className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors text-body-md"
              href={links.paper}
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              Technical Paper
            </a>
          </div>
        </div>

        <div className="p-6 bg-surface-container-low border border-outline-variant/10 rounded-xl">
          <p className="font-headline-md text-[20px] mb-4">Enjoyed this?</p>
          <p className="text-on-surface-variant text-body-md mb-6">
            Deep dives into AI engineering every Sunday.
          </p>
          <a
            className="text-primary hover:underline font-label-caps text-label-caps flex items-center gap-2"
            href="#"
          >
            Read the newsletter{" "}
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
