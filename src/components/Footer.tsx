const socials = [
  { label: "Twitter",    href: "#" },
  { label: "LinkedIn",   href: "#" },
  { label: "GitHub",     href: "#" },
  { label: "Newsletter", href: "#newsletter" },
];

export default function Footer() {
  return (
    <footer
      className="w-full py-section-gap px-margin-mobile md:px-gutter flex flex-col md:flex-row justify-between items-center gap-8 bg-background border-t border-outline-variant/10"
      id="contact"
    >
      <div className="font-label-caps text-label-caps text-on-surface">
        © 2026 ABHISHEK GUPTA. BUILDING AT THE EDGE OF INTELLIGENCE.
      </div>

      <div className="flex gap-12">
        {socials.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-on-surface-variant font-body-md hover:text-primary underline underline-offset-4 transition-all"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
