const builtWith = ["PyTorch", "LangChain", "Docker", "FastAPI", "AWS"];
const writesAbout = ["AI Policy", "PLG Loops", "Compute Economics"];

export default function AboutSection() {
  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap">
      <div className="bg-surface-container-low border border-outline-variant/10 p-12 md:p-20 flex flex-col md:flex-row items-center gap-16">
        <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-full border-2 border-primary-container/20 p-2">
          {/* Replace with Sanity author.avatar via next/image + urlFor() */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjQtpKjOTeS7sFcbnGsD6nVSAPwbEHQukl8jO55EDtwczZXqzgtrpgaBrrNijm9yPG-RBvcH6X9yuRwCH3-TsdkqD6pJO1tziu0Rhx2AOEKblvZypMFCJWn2tfLxQYP8H2kN09cRPg6Lu-JT0TAaiC_LtNuNoL9SFW6VW6FexYfDaV7RAgL79VX_v7tYtjYawvRG1KMTEQhWY1yC6xGlLH8amBoBVFBGN_0QxnvQX-vZ6fDcIYwlC3HxQ4IeQBAkDrTyHoVqCseg"
            alt="Abhishek Gupta"
            className="w-full h-full rounded-full object-cover grayscale"
          />
        </div>

        <div className="text-center md:text-left">
          <h2 className="font-headline-md text-headline-md mb-6">
            Builder at the intersection of AI, Product, and Business.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
            I believe the next decade of value creation lies in the seamless
            integration of technical depth and market intuition. My work focuses
            on making intelligent systems predictable, profitable, and
            human-centric.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div>
              <span className="font-label-caps text-label-caps text-outline block mb-4 uppercase tracking-tighter">
                Built with
              </span>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {builtWith.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-surface-container-highest font-mono-data text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-outline block mb-4 uppercase tracking-tighter">
                Writes about
              </span>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {writesAbout.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-surface-container-highest font-mono-data text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
