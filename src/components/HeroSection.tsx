import HeroCanvas from "./HeroCanvas";

const marqueeItems = [
  "LLMs", "RAG Systems", "Product Strategy", "Python",
  "Fine-tuning", "AI Agents", "Go-to-Market", "Next.js", "Business Analysis",
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center px-margin-mobile hero-glow pt-24 overflow-hidden"
      id="hero-section"
    >
      <HeroCanvas />

      <div className="text-center max-w-4xl z-10">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-8 leading-none">
          I build AI systems.<br />
          I think in products.<br />
          I ship things that matter.
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
          I sit at the intersection of AI engineering, product design, and
          business strategy—and I write about all three.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a
            className="bg-primary-container text-white px-10 py-4 font-label-caps text-label-caps tracking-widest hover:brightness-110 transition-all uppercase"
            href="#work"
          >
            See My Work
          </a>
          <a
            className="border border-outline-variant/30 text-on-surface px-10 py-4 font-label-caps text-label-caps tracking-widest hover:border-on-surface transition-all uppercase"
            href="#newsletter"
          >
            Read the Newsletter
          </a>
          <a
            className="border border-outline-variant/30 text-on-surface px-10 py-4 font-label-caps text-label-caps tracking-widest hover:border-on-surface transition-all uppercase flex items-center justify-center gap-2"
            href="#"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download Resume
          </a>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="absolute bottom-12 w-full border-y border-outline-variant/10 py-6 overflow-hidden bg-background/40 z-10">
        <div className="marquee-track flex gap-12 text-on-surface-variant font-mono-data text-mono-data items-center">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap">
              {item}{" "}
              <span className="text-primary-container">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
