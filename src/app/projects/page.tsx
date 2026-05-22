import type { Metadata } from "next";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects — Abhishek Gupta",
  description:
    "Things I've designed, built, and shipped. AI systems, products, and tools built at the intersection of engineering, product thinking, and business impact.",
};

export default function ProjectsPage() {
  return (
    <main className="max-w-container-max mx-auto pt-48 px-margin-mobile md:px-gutter">
      {/* Page header */}
      <header className="mb-section-gap">
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.2em]">
            Selected Work
          </span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg leading-tight">
            Things I&apos;ve designed,<br className="hidden md:block" /> built, and shipped
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">
            Each project is tagged with the perspective it was built from —
            engineering depth, product thinking, or business impact. Usually all three.
          </p>
        </div>

        {/* Filter tabs live inside ProjectsGrid (client boundary) */}
      </header>

      <ProjectsGrid />

      <Footer />
    </main>
  );
}
