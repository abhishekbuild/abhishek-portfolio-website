"use client";

import { useState } from "react";

// Replace with Sanity GROQ: *[_type == "project"] | order(_createdAt desc)
const FEATURED_PROJECTS = [
  {
    slug: "nebula-autonomous-research-agent",
    title: "Nebula: Autonomous Research Agent",
    description:
      "A multi-agent system designed to crawl, synthesize, and report on emerging market trends. Built using a custom LangGraph implementation with specialized memory retrieval.",
    tags: ["LLM", "Python", "RAG"],
    perspective: "Product + Engineering",
    status: "SHIPPED",
    statusVariant: "green" as const,
    impact: "Reduced retrieval latency by 60% through custom vector indexing.",
    links: [
      { label: "Case Study", href: "#", primary: true },
      { label: "GitHub",     href: "#", primary: false },
      { label: "Live Demo",  href: "#", primary: false },
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA69MpWguRAaJSfAj-eyAjvQGVVSxIlIr8S02Dl-LaJpSXoIaS-Bl-hRHq4CVUYo3Mz3LzSa0gnEEQK4HuqBRozlCJoLY_UUdfFRLVyfvRWMV6y9ijd-oPYFUMX31WSp2sSvUetthmTxbmROgryYh9lWdMhP0RD0UVGOobQRS_JGenY9U5Yo-TCKwl2BmEDB5MZNIKJPOKNpoG4EFrDYJSXapqvgaML9qsk46kYGQGDq_lAfs1sx0WtS9IBB8wqJKG8F64mbGgn8Q",
    categories: ["LLMs & Agents", "RAG & Search"],
  },
  {
    slug: "synccore-realtime-data-pipeline",
    title: "SyncCore: Real-time Data Pipeline",
    description:
      "High-throughput ETL pipeline for enterprise clients migrating legacy database architecture to modern cloud-native solutions. Focused on zero-downtime reliability.",
    tags: ["Rust", "Postgres", "Enterprise"],
    perspective: "Business + Engineering",
    status: "STABLE",
    statusVariant: "neutral" as const,
    impact: "Secured $1.2M in annual savings for Series B client within 3 months.",
    links: [
      { label: "Case Study",         href: "#", primary: true },
      { label: "Read Documentation", href: "#", primary: false },
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSiFsv99fWl7nJZaSxY7qTL7QRIcU6PD4Vmxd35KNGHqKOSMJASwgfUtpqUhu3bi8vUm1Y1W7S5jGOj1nkhJ4HT-xbyvgewiP8nF8x9yoXPnCFE4Y_LMeq6Fx1ClSLg88kMGcALCGuNY_sNoqJMgIcnh_5CGZA_2ztEruC1p7CCEmq9ikpIUyM_HOH6oKtl7ok3EKSuarbppAOFqiwMugBscUjfVq-B8SHgEEmHUWNWi96VjwZ9h62OxoSRc0XfXF0cRfcUc19TQ",
    categories: ["Business Impact"],
  },
];

const GRID_PROJECTS = [
  {
    slug: "vocallink-hub",
    title: "VocalLink Hub",
    description: "Voice-activated terminal for local AI models. Privacy-first hardware integration for home servers.",
    perspective: "PRODUCT",
    impact: "Sold out first batch of 500 units in 48 hours.",
    links: [
      { label: "View Specs", href: "#" },
      { label: "Story",      href: "#" },
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6b9a86akhNPHMvLFwBnUKnAc6L9r2UNYBRXlBptR-Qe7aSG1gTB3VjFM3AT7tvpamZwCpf3bgrV1ByiUQyYD9ZlVXg3DwfA5Tvee15gkgGxkFz_4JBDanKJfaRCe61jJUuoNwahJsKfgpR66YNhmg2qSUR9p-lcNJt0azU_m1VVeIWSsPEOuOHIWPRZDfd1GG7bEb0z6IaGqXHZpRIOagJyIHExqWVrnZGfk0ngQZdOkwuXiLd5vT5mOXXroT7huuYikIkXLiYA",
    categories: ["Tools & Products"],
  },
  {
    slug: "schemaviz",
    title: "SchemaViz",
    description: "Automatic database diagramming tool for SQL and NoSQL. Built for complex enterprise schemas.",
    perspective: "ENGINEERING",
    impact: "Used by 2,000+ engineers at Fortune 500 companies.",
    links: [
      { label: "GitHub",    href: "#" },
      { label: "Live Tool", href: "#" },
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjsn8FRyeW1mL6_xXRhcEO32vOpL3TcIuKhBDDpgf3J1JcCYsNDE8l0B2PW25t4Mt7VOqUGLJEy6auMm2gIr7E1wJbB9GW5JEzkolA4qCa3NXNl3gBg_jM5Tp7yJSBx6l_IppGE3rjaM_srw7ASc6UQtm1vUtf8u8kd1Ix_fZ4zFb45LhDGteZTOWhDGuRVlerMNoUEYur8X-bbBvYw-vBDSfKd1FCS26TLAoHRjVQxnwkF8gEF_xnRjKaiZsbbRO63K7BU8KNvQ",
    categories: ["Tools & Products", "Research"],
  },
  {
    slug: "latentspaces",
    title: "LatentSpaces",
    description: "Python library for geometric interpretation of LLM embeddings. Open-source contribution.",
    perspective: "RESEARCH",
    impact: "500+ stars on GitHub and featured in Weekly AI Digest.",
    links: [
      { label: "View Repo", href: "#" },
      { label: "Paper",     href: "#" },
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9xC_CyyitbR5GsvDd6WiGhb8nIV37OLuAgDwCCrToViiH2J8JeLgtCcURbn4BHp2Vis2uUWoWexCV_bEpjiYSgx5IpJ2SevKdIUSZ3C1mbyQGPLGCYHgowfn5sqZ3FrZP_NJVQAO_Pw_KsNYYFVwjUf1TogOi7PCCUuan6s6FqqisQT_D9fmeYYCMbIYJc3q907SM201NFpL3sDqPvK4AM05aNEy9WneP2h-yXnI65cUZK545OmefTRDNqWkC_-I1ciKRWh0-Ew",
    categories: ["Research", "LLMs & Agents"],
  },
  {
    slug: "flowstate",
    title: "FlowState",
    description: "Mobile-first CRM for independent contractors. Focus on automated invoicing and lead tracking.",
    perspective: "PRODUCT",
    impact: "500+ weekly active users and 4.9 App Store rating.",
    links: [
      { label: "App Store",  href: "#" },
      { label: "Case Study", href: "#" },
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDne3FK8eNJWjNPYfqEvzgteezEh5_RSwm7sLwAS3UxUzRm6Cb-cURAxhUTVzuCKGoxelmlPCZZlOj_oc2qyew0OlOxAG7_awxUYTfLqfSRsg0KAe8z2SpVFOCu5RgmRF2M_hN-w-S3touCT0r-S4hVKmrbgTpOPcNvmyt30HkdvEfAWY5jvU5GRQRcJaXAiOdhT7TrjXzh2aCLyQoi3Lp6j2xp-Qmsk6e73ehcW6THQ12kxZczMhua12cR4ypnMDqxHBNAxKpAZQ",
    categories: ["Tools & Products"],
  },
];

const FILTER_TABS = [
  "All",
  "LLMs & Agents",
  "RAG & Search",
  "Tools & Products",
  "Research",
  "Business Impact",
];

export default function ProjectsGrid() {
  const [active, setActive] = useState("All");

  const visibleFeatured =
    active === "All"
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.categories.includes(active));

  const visibleGrid =
    active === "All"
      ? GRID_PROJECTS
      : GRID_PROJECTS.filter((p) => p.categories.includes(active));

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

      {/* Featured projects */}
      {visibleFeatured.length > 0 && (
        <section className="flex flex-col gap-gutter mb-gutter mt-section-gap">
          {visibleFeatured.map((p) => (
            <div
              key={p.slug}
              className="group relative flex flex-col border border-outline-variant/10 hover:border-primary-container/50 transition-all duration-500 overflow-hidden bg-surface-container-lowest"
            >
              <div className="aspect-video w-full relative subtle-grid overflow-hidden border-b border-outline-variant/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-[1.02] transition-all duration-700"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-surface-container-high/90 backdrop-blur-md rounded-sm font-label-caps text-label-caps text-on-surface">
                    [{p.perspective}]
                  </span>
                </div>
                <div className="absolute top-6 right-6">
                  {p.statusVariant === "green" ? (
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
              </div>

              <div className="p-10 flex flex-col gap-6">
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag, i) => (
                    <span key={tag} className="font-mono-data text-mono-data text-on-surface-variant opacity-60">
                      {i > 0 && <span className="mr-2">/</span>}
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <h3 className="font-headline-md text-headline-md mb-3">{p.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    {p.description}
                  </p>
                </div>

                <p className="font-headline-md text-[20px] text-primary-container font-bold italic tracking-tight">
                  &ldquo;{p.impact}&rdquo;
                </p>

                <div className="flex flex-wrap gap-4 mt-4">
                  {p.links.map(({ label, href, primary }) =>
                    primary ? (
                      <a
                        key={label}
                        href={href}
                        className="px-8 py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps hover:opacity-90 transition-all"
                      >
                        {label}
                      </a>
                    ) : (
                      <a
                        key={label}
                        href={href}
                        className="px-8 py-3 border border-outline-variant/20 font-label-caps text-label-caps text-on-surface hover:border-on-surface transition-all"
                      >
                        {label}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
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
              key={p.slug}
              className="group border border-outline-variant/10 hover:border-primary-container/30 transition-all bg-surface-container-lowest flex flex-col"
            >
              <div className="aspect-[4/3] subtle-grid border-b border-outline-variant/10 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
                />
                <span className="absolute top-4 left-4 px-2 py-0.5 bg-surface-container-high/90 rounded-sm font-label-caps text-[10px] text-on-surface-variant">
                  {p.perspective}
                </span>
              </div>

              <div className="p-8 flex flex-col gap-4">
                <h4 className="font-headline-md text-[24px]">{p.title}</h4>
                <p className="font-body-md text-on-surface-variant line-clamp-2">
                  {p.description}
                </p>
                <p className="font-label-caps text-[14px] text-primary-container font-bold italic tracking-tight">
                  &ldquo;{p.impact}&rdquo;
                </p>
                <div className="flex gap-4 pt-2">
                  {p.links.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-[11px] underline underline-offset-4"
                    >
                      {label}
                    </a>
                  ))}
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
            I&apos;m selectively available for consulting and collaboration on AI
            systems, product strategy, and technical writing.
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
