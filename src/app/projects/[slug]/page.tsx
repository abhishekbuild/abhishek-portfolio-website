import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/urlFor";
import CaseStudySidebar from "@/components/projects/CaseStudySidebar";
import Footer from "@/components/Footer";

export const revalidate = 3600;

const NAV_SECTIONS = [
  { id: "problem", label: "The Problem" },
  { id: "approach", label: "My Approach" },
  { id: "engineering", label: "Engineering Architecture" },
  { id: "product", label: "Product Decisions" },
  { id: "business", label: "Business Considerations" },
  { id: "results", label: "Results & Impact" },
  { id: "reflection", label: "What I'd Do Differently" },
];

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Abhishek Gupta`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const links = {
    github: project.links?.github ?? "#",
    demo: project.links?.demo ?? "#",
    paper: project.links?.paper ?? "#",
  };

  return (
    <main className="pt-24">
      {/* ── Project Hero ──────────────────────────────────────────────────── */}
      <section className="min-h-[60vh] flex flex-col justify-end px-margin-mobile md:px-gutter max-w-container-max mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-none">
              {project.title}
            </h1>
            <p className="text-on-surface-variant max-w-2xl mb-8">{project.summary}</p>

            {project.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-surface-container-high px-3 py-1 font-mono-data text-mono-data rounded-lg border border-outline-variant/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 items-center">
              {project.timeline && (
                <div className="flex items-center gap-2 text-on-surface-variant text-mono-data font-mono-data">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  Timeline: {project.timeline}
                </div>
              )}
              {project.role && (
                <div className="flex items-center gap-2 text-on-surface-variant text-mono-data font-mono-data">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Role: {project.role}
                </div>
              )}
              {project.status && (
                <div className="flex items-center gap-2 text-on-surface-variant text-mono-data font-mono-data">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Status: {project.status}
                </div>
              )}
            </div>
          </div>

          {project.perspective?.length > 0 && (
            <div className="lg:col-span-4 flex flex-col gap-2">
              <div className="flex gap-2">
                {project.perspective.map((p) => (
                  <span
                    key={p}
                    className="flex-1 text-center py-2 border border-outline-variant/30 rounded text-label-caps font-label-caps text-on-surface-variant"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {project.coverImage?.asset && (
          <div className="mt-16 relative aspect-video w-full overflow-hidden rounded-xl border border-outline-variant/20 group">
            <Image
              src={urlFor(project.coverImage).width(1200).url()}
              alt={project.coverImage.alt ?? project.title}
              fill
              className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          </div>
        )}
      </section>

      {/* ── Main Content + Sticky Sidebar ────────────────────────────────── */}
      {cs && (
        <section className="px-margin-mobile md:px-gutter max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 pb-section-gap">
          <CaseStudySidebar sections={NAV_SECTIONS} links={links} />

          <div className="lg:col-span-9 space-y-[120px]">
            {/* THE PROBLEM */}
            {cs.problem && (
              <section id="problem">
                <span className="font-label-caps text-label-caps text-primary mb-4 block">
                  {cs.problem.label}
                </span>
                <h2 className="font-headline-md text-headline-md mb-8">{cs.problem.heading}</h2>
                <div className="max-w-3xl space-y-8">
                  <p className="text-on-surface-variant leading-relaxed">{cs.problem.body}</p>
                  {cs.problem.items?.length > 0 && (
                    <div className="bg-surface-container border border-outline-variant/10 p-8 rounded-xl">
                      <p className="font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-error">warning</span>
                        Problem Snapshot
                      </p>
                      <ul className="space-y-4 text-on-surface-variant">
                        {cs.problem.items.map((item, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="text-primary">0{i + 1}</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* MY APPROACH */}
            {cs.approach && (
              <section id="approach">
                <span className="font-label-caps text-label-caps text-primary mb-4 block">
                  {cs.approach.label}
                </span>
                <h2 className="font-headline-md text-headline-md mb-12">{cs.approach.heading}</h2>
                {cs.approach.steps?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {cs.approach.steps.map(({ _key, num, title, desc }) => (
                      <div
                        key={_key}
                        className="p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-xl"
                      >
                        <div className="mb-4 text-primary font-mono-data">{num}</div>
                        <div className="font-bold text-on-surface mb-2">{title}</div>
                        <p className="text-on-surface-variant text-[14px]">{desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ENGINEERING ARCHITECTURE */}
            {cs.engineering && (
              <section id="engineering">
                <span className="font-label-caps text-label-caps text-primary mb-4 block">
                  {cs.engineering.label}
                </span>
                <h2 className="font-headline-md text-headline-md mb-8">
                  {cs.engineering.heading}
                </h2>
                <div className="space-y-12">
                  {cs.engineering.archDiagram?.asset && (
                    <div className="bg-surface-container-high aspect-video rounded-xl border border-outline-variant/20 overflow-hidden relative">
                      <Image
                        src={urlFor(cs.engineering.archDiagram).width(1000).url()}
                        alt={cs.engineering.archDiagram.alt ?? "Architecture Diagram"}
                        fill
                        className="object-cover mix-blend-overlay opacity-30"
                        sizes="900px"
                      />
                      {cs.engineering.archDiagramCaption && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-surface/80 backdrop-blur px-6 py-3 border border-outline-variant/20 rounded-lg font-mono-data text-mono-data">
                            {cs.engineering.archDiagramCaption}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {cs.engineering.codeSnippet && (
                    <div className="code-block p-6 rounded-xl overflow-x-auto">
                      <div className="flex justify-between mb-4 border-b border-outline-variant/10 pb-2">
                        <span className="text-mono-data opacity-40 uppercase tracking-widest text-[12px]">
                          {cs.engineering.codeFilename}
                        </span>
                        <span className="text-primary text-[12px] font-mono-data">
                          {cs.engineering.codeLanguage}
                        </span>
                      </div>
                      <pre className="text-mono-data text-[14px] text-on-surface leading-loose">
                        <code>{cs.engineering.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {cs.engineering.keyDecision && (
                    <div className="border-l-4 border-primary p-8 bg-surface-container-low rounded-r-xl">
                      <p className="text-primary font-bold mb-2">Key technical decision:</p>
                      <p className="text-on-surface italic">
                        &ldquo;{cs.engineering.keyDecision}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* PRODUCT DECISIONS */}
            {cs.product && (
              <section id="product">
                <span className="font-label-caps text-label-caps text-primary mb-4 block">
                  {cs.product.label}
                </span>
                <h2 className="font-headline-md text-headline-md mb-8">{cs.product.heading}</h2>
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cs.product.wireframe?.asset && (
                      <div className="bg-surface-container aspect-[4/3] rounded-xl border border-outline-variant/10 flex items-center justify-center overflow-hidden relative">
                        <Image
                          src={urlFor(cs.product.wireframe).width(600).url()}
                          alt={cs.product.wireframe.alt ?? "Wireframe"}
                          fill
                          className="object-cover grayscale opacity-20"
                          sizes="600px"
                        />
                        {cs.product.wireframeCaption && (
                          <span className="absolute text-label-caps font-label-caps opacity-40">
                            {cs.product.wireframeCaption}
                          </span>
                        )}
                      </div>
                    )}
                    {cs.product.body && (
                      <div className="flex flex-col justify-center">
                        <p className="text-on-surface-variant">{cs.product.body}</p>
                      </div>
                    )}
                  </div>

                  {cs.product.tradeoffs?.length > 0 && (
                    <div className="overflow-hidden border border-outline-variant/10 rounded-xl">
                      <table className="w-full text-left">
                        <thead className="bg-surface-container-high border-b border-outline-variant/10">
                          <tr>
                            <th className="p-4 font-label-caps text-label-caps">Option Considered</th>
                            <th className="p-4 font-label-caps text-label-caps">Reason Rejected</th>
                          </tr>
                        </thead>
                        <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/10">
                          {cs.product.tradeoffs.map(({ _key, option, reason }) => (
                            <tr key={_key}>
                              <td className="p-4 text-on-surface font-bold text-body-md">{option}</td>
                              <td className="p-4 text-on-surface-variant text-body-md">{reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* BUSINESS CONSIDERATIONS */}
            {cs.business && (
              <section id="business">
                <span className="font-label-caps text-label-caps text-primary mb-4 block">
                  {cs.business.label}
                </span>
                <h2 className="font-headline-md text-headline-md mb-8">{cs.business.heading}</h2>
                <div className="p-8 border-l-2 border-primary gradient-glow">
                  {cs.business.body && (
                    <p className="text-on-surface mb-6">{cs.business.body}</p>
                  )}
                  {cs.business.metrics?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {cs.business.metrics.map(({ _key, label, value }) => (
                        <div key={_key}>
                          <div className="text-[12px] font-label-caps opacity-40 mb-1">{label}</div>
                          <div className="text-body-md text-on-surface">{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* RESULTS & IMPACT */}
            {cs.results && (
              <section id="results">
                <span className="font-label-caps text-label-caps text-primary mb-4 block">
                  {cs.results.label}
                </span>
                <h2 className="font-headline-md text-headline-md mb-12">{cs.results.heading}</h2>
                {cs.results.metrics?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {cs.results.metrics.map(({ _key, value, label, highlight }) => (
                      <div
                        key={_key}
                        className="p-8 bg-surface-container border border-outline-variant/10 rounded-xl"
                      >
                        <div
                          className={`text-display-lg-mobile font-bold mb-2 ${
                            highlight ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {value}
                        </div>
                        <div className="text-label-caps font-label-caps opacity-60">{label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {cs.results.body && (
                  <p className="text-on-surface-variant max-w-3xl">{cs.results.body}</p>
                )}
              </section>
            )}

            {/* REFLECTION */}
            {cs.reflection && (
              <section id="reflection">
                <span className="font-label-caps text-label-caps text-primary mb-4 block">
                  {cs.reflection.label}
                </span>
                <h2 className="font-headline-md text-headline-md mb-8">{cs.reflection.heading}</h2>
                {cs.reflection.paragraphs?.length > 0 && (
                  <div className="max-w-3xl text-on-surface-variant space-y-6">
                    {cs.reflection.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </section>
      )}

      {/* ── Prev / Next Project Nav ───────────────────────────────────────── */}
      <section className="border-t border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter grid grid-cols-1 md:grid-cols-2">
          {project.prevProject ? (
            <a
              className="group py-20 pr-10 border-r border-outline-variant/10 flex flex-col items-start gap-4"
              href={`/projects/${project.prevProject.slug.current}`}
            >
              <span className="font-label-caps text-label-caps opacity-40 group-hover:text-primary transition-colors">
                ← Previous Project
              </span>
              <div className="flex items-center gap-6">
                {project.prevProject.thumbnail?.asset && (
                  <div className="w-16 h-16 relative rounded overflow-hidden bg-surface-container">
                    <Image
                      src={urlFor(project.prevProject.thumbnail).width(64).height(64).url()}
                      alt={project.prevProject.title}
                      fill
                      className="object-cover grayscale opacity-50 group-hover:grayscale-0 transition-all"
                    />
                  </div>
                )}
                <span className="font-headline-md text-[24px]">{project.prevProject.title}</span>
              </div>
            </a>
          ) : (
            <div className="border-r border-outline-variant/10" />
          )}

          {project.nextProject ? (
            <a
              className="group py-20 pl-10 flex flex-col items-end gap-4"
              href={`/projects/${project.nextProject.slug.current}`}
            >
              <span className="font-label-caps text-label-caps opacity-40 group-hover:text-primary transition-colors">
                Next Project →
              </span>
              <div className="flex items-center gap-6 text-right">
                <span className="font-headline-md text-[24px]">{project.nextProject.title}</span>
                {project.nextProject.thumbnail?.asset && (
                  <div className="w-16 h-16 relative rounded overflow-hidden bg-surface-container">
                    <Image
                      src={urlFor(project.nextProject.thumbnail).width(64).height(64).url()}
                      alt={project.nextProject.title}
                      fill
                      className="object-cover grayscale opacity-50 group-hover:grayscale-0 transition-all"
                    />
                  </div>
                )}
              </div>
            </a>
          ) : (
            <div />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
