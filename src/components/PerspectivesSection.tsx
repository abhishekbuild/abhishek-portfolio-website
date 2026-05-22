const pillars = [
  {
    icon: "terminal",
    title: "ENGINEER",
    body: "I design and build production-grade AI systems. From model fine-tuning to deployment pipelines, I care about systems that actually work at scale.",
  },
  {
    icon: "view_quilt",
    title: "PRODUCT",
    body: "I think about users before I write code. Every system I build starts with a clear problem, a defined user, and a measurable outcome.",
  },
  {
    icon: "insights",
    title: "BUSINESS",
    body: "I understand that good technology has to make sense commercially. I think about distribution, monetization, and real-world impact.",
  },
];

export default function PerspectivesSection() {
  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap">
      <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-primary mb-12 border-l-2 border-primary pl-4">
        What I Bring
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {pillars.map(({ icon, title, body }) => (
          <div
            key={title}
            className="group bg-surface-container-low border border-outline-variant/10 p-12 transition-all duration-500 hover:border-primary-container/40"
          >
            <span
              className="material-symbols-outlined text-primary-container mb-8 scale-150 block"
              style={{ fontSize: "24px" }}
            >
              {icon}
            </span>
            <h3 className="font-headline-md text-headline-md mb-6">{title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
