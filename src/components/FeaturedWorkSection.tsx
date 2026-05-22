"use client";

import { useRef } from "react";

// Replace with Sanity GROQ: *[_type == "project"] | order(_createdAt desc)[0..1]
const projects = [
  {
    slug: "nexus-rag",
    category: "Research",
    title: "Nexus RAG",
    tags: ["LLM", "Python", "RAG"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUw7mQyA80u_KNJwRaoT01jnBo45vUSbGt8cgqNNKuQ6d6RVd5mKpWVDK8PIImGJ0OqAvt9ND3uMfd5lNlWclv8jrFiwUFDbgewMQoR9TdL0agBjPtCdLAIf4esxmVZiOwZw39_XmdVzfSfrmz8R5bczqyjmUe2TfxA2g6S_jjkC-Yc8fB8_jTsbG4P4MenVAtG4y-2BGd4x4BKQK08yPqPqm3-aAuWcvsRRTmfMqKYUMIX-Row6BYLQUOgdyCDRTub3Y2uiLgjw",
    imageAlt: "Nexus RAG visualization",
  },
  {
    slug: "strategy-engine",
    category: "Product",
    title: "Strategy Engine",
    tags: ["GPT-4", "Next.js", "Business"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPZygrmXQTTFN--Uo_62LQdSr48XSsiuedSb5swMIWitSaGZsS4gmb0ldVvgqgqaCDckyTpNW5MdWsKb10aA-IAjmMpxQAh6PRA85ffRmfDwC4gV29FS2SuZRjcgAQfWKy5QLAeNhSiNQltlvZUz5i2ARQWTaIOvWUDCWKTm55ZXk-Os0_t07sJGCtYYk14vuG5c_z_t80sNVlB6WsYVdmOAxJVYjScMf5Cltvnu-miADw7bwGUdHvKqYQa5HhNW06qFfLb7IIjg",
    imageAlt: "Strategy Engine visualization",
  },
];

export default function FeaturedWorkSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "prev" | "next") {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("div") as HTMLElement;
    const amount = card?.offsetWidth + 64 ?? 664;
    scrollRef.current.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap" id="work">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-2">
            Things I&apos;ve Built
          </h2>
          <p className="text-on-surface-variant font-body-md">
            A mix of research, products, and tools.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <a
            className="font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors uppercase tracking-widest"
            href="/projects"
          >
            View all projects →
          </a>
          <div className="font-mono-data text-mono-data text-outline">
            01 / 02 SELECTED WORKS
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button
              onClick={() => scroll("prev")}
              aria-label="Previous projects"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll("next")}
              aria-label="Next projects"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="gap-16 flex overflow-x-auto pb-8 scrollbar-hide">
        {projects.map(({ slug, category, title, tags, image, imageAlt }) => (
          <div key={slug} className="group relative min-w-[320px] md:min-w-[600px] flex-shrink-0">
            <div className="aspect-video bg-surface-container-high mb-8 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-black/60 backdrop-blur px-3 py-1 font-label-caps text-label-caps border border-white/10 uppercase">
                  [{category}]
                </span>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-headline-md mb-3">{title}</h3>
                <div className="flex gap-4 mb-6">
                  {tags.map((tag) => (
                    <span key={tag} className="font-mono-data text-primary text-xs uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <a className="underline-hover font-label-caps text-label-caps text-on-surface uppercase tracking-widest" href={`/projects/${slug}`}>
                  Case Study
                </a>
                <a className="underline-hover font-label-caps text-label-caps text-on-surface uppercase tracking-widest" href="#">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
