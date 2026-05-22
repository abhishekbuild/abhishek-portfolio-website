import NewsletterForm from "./NewsletterForm";

// Replace with Sanity GROQ: *[_type == "post"] | order(publishedAt desc)[0..2]
const posts = [
  {
    slug: "deconstructing-gpt4o-economics",
    tag: "AI Strategy",
    title: "Deconstructing GPT-4o Economics",
  },
  {
    slug: "case-for-small-language-models",
    tag: "Research",
    title: "The Case for Small Language Models",
  },
  {
    slug: "building-product-loops-with-llms",
    tag: "Product Thinking",
    title: "Building Product Loops with LLMs",
  },
];

export default function WritingSection() {
  return (
    <section
      className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap"
      id="writing"
    >
      <div className="flex flex-col lg:flex-row gap-24">
        {/* Blog list */}
        <div className="lg:w-3/5">
          <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-primary mb-12">
            From the Blog
          </h2>

          <div className="space-y-0">
            {posts.map(({ slug, tag, title }) => (
              <a
                key={slug}
                href={`/blog/${slug}`}
                className="group block py-10 border-b border-outline-variant/10 flex justify-between items-center transition-all hover:pl-4"
              >
                <div>
                  <span className="font-mono-data text-xs text-outline mb-2 block uppercase tracking-tighter">
                    [{tag}]
                  </span>
                  <h3 className="font-headline-md text-2xl group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                </div>
                <span
                  className="material-symbols-outlined transition-transform group-hover:translate-x-2"
                  style={{ fontSize: "24px" }}
                >
                  north_east
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="lg:w-2/5" id="newsletter">
          <div className="sticky top-32 p-12 bg-surface-container-low border border-primary-container/20 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[80px]" />
            <h2 className="font-headline-md text-headline-md mb-4 relative z-10">
              Model Breakdowns, Weekly
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-10 relative z-10">
              Engineering details AND business implications. No fluff.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
