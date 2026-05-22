# Portfolio — AI Engineer Portfolio Website

## Project Overview
Personal portfolio for an AI engineer with product and business perspective.
Stack: Next.js 14 (App Router), Tailwind CSS, Sanity CMS, Framer Motion,
React Three Fiber, Vercel (deployment).

## Identity & Tone
NOT a generic dev portfolio. Three perspectives are core to the brand:
- Engineer: production AI systems, RAG, LLMs, fine-tuning
- Product: user-first thinking, outcomes over outputs
- Business: GTM, monetization, real-world impact

## Design System
- Background: #0A0A0A
- Accent: #7C3AED (violet) — use sparingly
- Font: Inter (body), system-ui fallback
- Dark mode only, generous whitespace
- 3D animations via React Three Fiber (scroll-triggered, not decorative)

---

## Environment Architecture

Two environments. Sanity free tier includes exactly 2 datasets.

| Environment | Git Branch | Sanity Dataset | Vercel          |
|-------------|------------|----------------|-----------------|
| Development | dev/*      | development    | PR preview URLs |
| Production  | main       | production     | yourdomain.com  |

There is no staging environment. Staging is replaced by Vercel
preview deployments — every PR automatically gets a preview URL
pointed at the development dataset.

### Environment rules
- All local development → development dataset
- All production content → authored directly in production Studio
- Schema changes always flow: code → git → GitHub Actions → deployed
- Content never flows dev → prod (dev is for testing only)
- Before any destructive schema change: export prod dataset as backup

### Seeding dev with realistic data
When you need real content to test against locally:
  npx sanity dataset export production ./backups/prod-$(date +%Y%m%d).tar.gz
  npx sanity dataset import ./backups/prod-YYYYMMDD.tar.gz development --replace

### Environment variable files (never committed)
.env.development → NEXT_PUBLIC_SANITY_DATASET=development
.env.production  → NEXT_PUBLIC_SANITY_DATASET=production

### Vercel environment variables
Set in Vercel dashboard, scoped per environment:
  NEXT_PUBLIC_SANITY_PROJECT_ID   → same across both
  NEXT_PUBLIC_SANITY_DATASET      → development (Preview) / production (Production)
  SANITY_API_TOKEN                → separate read tokens per environment
  BEEHIIV_API_KEY                 → same across both (one publication)
  BEEHIIV_PUBLICATION_ID         → same across both
  RESEND_API_KEY                  → same across both

### GitHub Actions — auto deploy Studio on merge to main
On push to main → GitHub Action runs → deploys Sanity Studio to production
Token stored as SANITY_AUTH_TOKEN in GitHub Secrets (never in code)

### Schema migration checklist
1. Make schema change locally (hits development dataset)
2. npx sanity documents validate
3. PR → preview URL confirms it looks right
4. Export prod backup before merging
5. Merge to main → Studio auto-deploys via GitHub Actions
6. Monitor Sanity Studio for validation errors in prod

---

## Pages
/ → Landing
/projects → Project grid
/projects/[slug] → Case study
/blog → Blog list
/blog/[slug] → Post reader
/newsletter → Subscribe + past issues
/uses → Stack page
/contact → Contact form

---

## Content Architecture

ALL content comes from Sanity CMS — no exceptions.
Every piece of text, image, video, and file is authored
in Sanity and fetched via GROQ. Nothing is hardcoded
except UI chrome (nav labels, button text).

### Sanity content types (schemas)
- post         → title, slug, body (Portable Text), tags,
                 coverImage, publishedAt, readTime, perspective[]
- project      → title, slug, summary, thumbnail, techStack[],
                 perspective[], status, impact, caseStudy{}
- author       → name, bio, avatar, socials
- usesItem     → name, description, category, tag, url
- siteSettings → name, tagline, ogImage, socials

### Portable Text (body field)
Supports: h1–h4, p, ul, ol, blockquote
Custom blocks: calloutBox, codeBlock, pullQuote,
               imageWithCaption, videoEmbed

### Images
All images through Sanity's CDN via sanity-image-url.
Use next/image with urlFor() helper. Never raw <img> tags.

### Rendering
Use @portabletext/react with custom components map.

---

## Newsletter — Beehiiv Integration

Read from Beehiiv API:
  Subscriber count → GET /v2/publications/{id}?expand=stats
  Past issues      → GET /v2/publications/{id}/posts

Write to Beehiiv API:
  New subscriber   → POST /v2/publications/{id}/subscriptions

API routes:
  /api/newsletter/subscribe  POST → creates subscription in Beehiiv
  /api/newsletter/issues     GET  → returns past posts from Beehiiv
  /api/newsletter/stats      GET  → returns subscriber count

---

## Blog Search

Strategy: Sanity GROQ native search (no external service needed)
API route: /api/search → debounced, returns posts matching query

GROQ pattern:
  *[_type == "post" && (
    title match $query + "*" ||
    excerpt match $query + "*" ||
    pt::text(body) match $query + "*"
  )] | order(publishedAt desc)[0..9] {
    title, slug, excerpt, publishedAt, tags, perspective
  }

---

## API Routes
/api/newsletter/subscribe  POST → Beehiiv subscribe
/api/newsletter/issues     GET  → Beehiiv posts list
/api/newsletter/stats      GET  → Beehiiv subscriber count
/api/search                GET  → Sanity GROQ search
/api/contact               POST → contact form email

---

## Rendering Strategy
/                  ISR revalidate: 3600
/projects          ISR revalidate: 3600
/projects/[slug]   ISR revalidate: 3600
/blog              ISR revalidate: 1800
/blog/[slug]       ISR revalidate: 1800
/newsletter        ISR revalidate: 300 (live subscriber count)
/uses              ISR revalidate: 86400
/contact           Static

---

## Conventions
- Components: /src/components
- Pages: /src/app
- Sanity schemas: /sanity/schemas
- GROQ queries: /src/lib/sanity/queries.ts
- Beehiiv calls: /src/lib/beehiiv.ts
- TypeScript strict — no `any`
- Tailwind only — no inline styles
- Mobile-first responsive
- Every image through next/image + sanity urlFor()

---

## Connected MCP Servers
- Stitch MCP   → design → code (reads screens, extracts tokens)
- Sanity MCP   → live schema awareness, GROQ testing, content ops
                 endpoint: https://mcp.sanity.io (OAuth)

## Sanity MCP rule
MCP connects to whichever dataset SANITY_STUDIO_DATASET points to.
Locally this is always 'development'. Never run MCP mutations
against production dataset directly from Claude Code.