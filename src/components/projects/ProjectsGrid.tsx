"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/urlFor";
import type { ProjectCard } from "@/lib/sanity/types";

const FILTER_TABS = [
  "All",
  "LLMs & Agents",
  "RAG & Search",
  "Tools & Products",
  "Research",
  "Business Impact",
];

interface Props {
  projects: ProjectCard[];
}

export default function ProjectsGrid({ projects }: Props) {
  const [active, setActive] = useState("All");

  const featured = projects.filter((p) => p.featured);
  const grid = projects.filter((p) => !p.featured);

  const visibleFeatured =
    active === "All" ? featured : featured.filter((p) => p.categories?.includes(active));
  const visibleGrid =
    active === "All" ? grid : grid.filter((p) => p.categories?.includes(active));

  return (
    <>
      {/* Filter tabs */}
      <div className="mt-12 flex flex-wrap gap-3 overflow-x-auto pb-4 no-scrollbar">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-6 py-2 rounded-full font-label-caps text-label-caps transition-all ${
              active === tab
                ? "bg-primary-container text-on-primary-container"
                : "border border-outline-variant/20 hover:border-primary-container/50 text-on-surface-variant"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured projects — full-width cards */}
      {visibleFeatured.length > 0 && (
        <section className="flex flex-col gap-gutter mb-gutter mt-section-gap">
          {visibleFeatured.map((p) => {
            const isShipped = p.status === "SHIPPED";
            const perspectiveLabel = p.perspective?.join(" + ") ?? "";

            return (
              <div
                key={p._id}
                className="group relative flex flex-col border border-outline-variant/10 hover:border-primary-container/50 transition-all duration-500 overflow-hidden bg-surface-container-lowest"
              >
                <div className="aspect-video w-full relative subtle-grid overflow-hidden border-b border-outline-variant/10">
                  {p.thumbnail?.asset && (
                    <Image
                      src={urlFor(p.thumbnail).width(1200).url()}
                      alt={p.thumbnail.alt ?? p.title}
                      fill
                      className="object-cover mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-[1.02] transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 1200px"
                    />
                  )}
                  {perspectiveLabel && (
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-surface-container-high/90 backdrop-blur-md rounded-sm font-label-caps text-label-caps text-on-surface">
                        [{perspectiveLabel}]
                      </span>
                    </div>
                  )}
                  {p.status && (
                    <div className="absolute top-6 right-6">
                      {isShipped ? (
                        <span className="flex items-center gap-2 px-3 py-1 bg-green-950/30 backdrop-blur-md border border-green-500/30 rounded-sm font-label-caps text-[10px] text-green-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          {p.status}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 px-3 py-1 bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/20 rounded-sm font-label-caps text-[10px] text-on-surface-variant">
                          {p.status}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-10 flex flex-col gap-6">
                  {p.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.techStack.map((tag, i) => (
                        <span key={tag} className="font-mono-data text-mono-data text-on-surface-variant opacity-60">
                          {i > 0 && <span className="mr-2">/</span>}
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div>
                    <h3 className="font-headline-md text-headline-md mb-3">{p.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                      {p.summary}
                    </p>
                  </div>

                  {p.impact && (
                    <p className="font-headline-md text-[20px] text-primary-container font-bold italic tracking-tight">
                      &ldquo;{p.impact}&rdquo;
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-4">
                    <a
                      href={`/projects/${p.slug.current}`}
                      className="px-8 py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps hover:opacity-90 transition-all"
                    >
                      Case Study
                    </a>
                    {p.links?.github && (
                      <a
                        href={p.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 border border-outline-variant/20 font-label-caps text-label-caps text-on-surface hover:border-on-surface transition-all"
                      >
                        GitHub
                      </a>
                    )}
                    {p.links?.demo && (
                      <a
                        href={p.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 border border-outline-variant/20 font-label-caps text-label-caps text-on-surface hover:border-on-surface transition-all"
                      >
                        Live Demo
                      </a>
                    )}
                    {p.links?.paper && (
                      <a
                        href={p.links.paper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 border border-outline-variant/20 font-label-caps text-label-caps text-on-surface hover:border-on-surface transition-all"
                      >
                        Paper
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Perspective callout */}
      <section className="py-section-gap">
        <div className="perspective-line pl-12 max-w-4xl">
          <p className="font-headline-md text-headline-md text-on-background leading-relaxed">
            I approach every project from three angles: Can we engineer it reliably? Does it
            solve a real user problem? Does it create measurable value?{" "}
            <span className="text-primary-container">
              The best work lives at the intersection of all three.
            </span>
          </p>
        </div>
      </section>

      {/* Standard 2-col grid */}
      {visibleGrid.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-section-gap">
          {visibleGrid.map((p) => (
            <div
              key={p._id}
              className="group border border-outline-variant/10 hover:border-primary-container/30 transition-all bg-surface-container-lowest flex flex-col"
            >
              <div className="aspect-[4/3] subtle-grid border-b border-outline-variant/10 relative overflow-hidden">
                {p.thumbnail?.asset && (
                  <Image
                    src={urlFor(p.thumbnail).width(600).url()}
                    alt={p.thumbnail.alt ?? p.title}
                    fill
                    className="object-cover mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
                    sizes="600px"
                  />
                )}
                {p.perspective?.[0] && (
                  <span className="absolute top-4 left-4 px-2 py-0.5 bg-surface-container-high/90 rounded-sm font-label-caps text-[10px] text-on-surface-variant uppercase">
                    {p.perspective[0]}
                  </span>
                )}
              </div>

              <div className="p-8 flex flex-col gap-4">
                <h4 className="font-headline-md text-[24px]">{p.title}</h4>
                <p className="font-body-md text-on-surface-variant line-clamp-2">{p.summary}</p>
                {p.impact && (
                  <p className="font-label-caps text-[14px] text-primary-container font-bold italic tracking-tight">
                    &ldquo;{p.impact}&rdquo;
                  </p>
                )}
                <div className="flex gap-4 pt-2">
                  <a
                    href={`/projects/${p.slug.current}`}
                    className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-[11px] underline underline-offset-4"
                  >
                    Case Study
                  </a>
                  {p.links?.github && (
                    <a
                      href={p.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-[11px] underline underline-offset-4"
                    >
                      GitHub
                    </a>
                  )}
                  {p.links?.demo && (
                    <a
                      href={p.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-[11px] underline underline-offset-4"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-section-gap relative glow-hint">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg">
            Have a project in mind?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant opacity-80 max-w-xl">
            I&apos;m selectively available for consulting and collaboration on AI systems, product
            strategy, and technical writing.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <a
              href="#contact"
              className="px-10 py-4 bg-primary-container text-on-primary-container font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
            >
              Let&apos;s Talk →
            </a>
            <a
              href="#"
              className="px-10 py-4 border border-outline-variant/20 text-on-surface font-label-caps text-label-caps hover:border-on-surface active:scale-95 transition-all"
            >
              Download Resume →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
