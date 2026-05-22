---
name: new-page
description: >
  Use this skill when creating a new page route for the portfolio website.
  Triggers on: "create a new page", "add the [name] page", "scaffold /[route]",
  "build the [name] route", or any request to add a new Next.js App Router page.
---

# new-page

Scaffolds a complete Next.js 14 App Router page for the portfolio.
Every page is server-rendered first, pulls data from Sanity at the server level,
and ships zero client-side data fetching by default.

## Before Writing Any Code

Ask the following if not already clear:
1. **Route** — What is the URL path? (e.g. `/blog`, `/projects/[slug]`)
2. **Dynamic?** — Does it have a `[slug]` or `[id]` segment?
3. **Sanity data** — What content types does this page need from Sanity?
4. **ISR revalidate** — How often does this content change?
   - Rarely (settings, uses): `86400` (24h)
   - Occasionally (projects): `3600` (1h)
   - Regularly (blog): `1800` (30min)
   - Frequently (newsletter, stats): `300` (5min)
5. **OG image** — What metadata should this page have for social sharing?

## Files to Create

### Static route (e.g. `/blog`, `/contact`, `/newsletter`)
```
/src/app/{route}/
  page.tsx          ← main page component
  loading.tsx       ← skeleton shown during ISR revalidation
  not-found.tsx     ← only for pages that could 404
```

### Dynamic route (e.g. `/blog/[slug]`, `/projects/[slug]`)
```
/src/app/{route}/[slug]/
  page.tsx
  loading.tsx
  not-found.tsx
```

## page.tsx Template

### Static page
```tsx
// /src/app/{route}/page.tsx
import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { {QUERY_NAME} } from '@/lib/sanity/queries'
import type { {QueryReturnType} } from '@/sanity/types'

// --- ISR ---
export const revalidate = {seconds}

// --- Metadata ---
export const metadata: Metadata = {
  title: '{Page Title} | Abhishek',
  description: '{Page description for SEO and social sharing}',
  openGraph: {
    title: '{Page Title}',
    description: '{Page description}',
    type: 'website',
  },
}

// --- Data fetching (server-side, zero client JS) ---
async function getData(): Promise<{QueryReturnType}> {
  return sanityFetch<{QueryReturnType}>({
    query: {QUERY_NAME},
    tags: ['{cache-tag}'],   // for on-demand revalidation later
  })
}

// --- Page component ---
export default async function {PageName}Page() {
  const data = await getData()

  return (
    <main className="min-h-screen bg-background">
      {/* Page content here */}
    </main>
  )
}
```

### Dynamic page (with slug)
```tsx
// /src/app/{route}/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity/client'
import { {QUERY_NAME}, {ALL_SLUGS_QUERY} } from '@/lib/sanity/queries'
import type { {QueryReturnType} } from '@/sanity/types'

export const revalidate = {seconds}

// Pre-generate known slugs at build time
export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: { current: string } }[]>({
    query: {ALL_SLUGS_QUERY},
    tags: ['{type}-slugs'],
  })
  return slugs.map(({ slug }) => ({ slug: slug.current }))
}

// Dynamic metadata per document
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await sanityFetch<{QueryReturnType}>({
    query: {QUERY_NAME},
    params: { slug: params.slug },
    tags: [`{type}-${params.slug}`],
  })

  if (!data) return { title: 'Not Found' }

  return {
    title: `${data.title} | Abhishek`,
    description: data.excerpt ?? '',
    openGraph: {
      title: data.title,
      description: data.excerpt ?? '',
      type: 'article',
      // OG image from Sanity image if available
      images: data.coverImage
        ? [{ url: data.coverImage.url, width: 1200, height: 630 }]
        : [],
    },
  }
}

export default async function {PageName}Page({
  params,
}: {
  params: { slug: string }
}) {
  const data = await sanityFetch<{QueryReturnType}>({
    query: {QUERY_NAME},
    params: { slug: params.slug },
    tags: [`{type}-${params.slug}`],
  })

  // Trigger Next.js not-found boundary
  if (!data) notFound()

  return (
    <main className="min-h-screen bg-background">
      {/* Page content here */}
    </main>
  )
}
```

## loading.tsx Template

Always create this — it shows during ISR revalidation and initial load.
Design the skeleton to match the real page layout (no generic spinners).

```tsx
// /src/app/{route}/loading.tsx
export default function {PageName}Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Skeleton matching the real page structure */}
        <div className="animate-pulse space-y-8">
          {/* Headline skeleton */}
          <div className="h-12 bg-white/5 rounded-lg w-2/3" />
          <div className="h-6 bg-white/5 rounded-lg w-1/2" />

          {/* Content skeleton — adjust shape per page */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
```

## not-found.tsx Template

```tsx
// /src/app/{route}/[slug]/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          404
        </p>
        <h1 className="text-4xl font-bold text-foreground">
          {/* Friendly message specific to this content type */}
          This {contentType} doesn't exist
        </h1>
        <p className="text-muted-foreground">
          It may have been moved, deleted, or you may have followed a broken link.
        </p>
        <Link
          href="/{route}"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          ← Back to {section}
        </Link>
      </div>
    </main>
  )
}
```

## Standard Page Layout Wrapper

Most pages use this outer shell. Reference it, don't duplicate it:
```tsx
<main className="min-h-screen bg-background">
  {/* Page header — overline + headline + subheadline */}
  <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      ...
    </div>
  </section>

  {/* Main content */}
  <section className="py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      ...
    </div>
  </section>
</main>
```

## After Creating the Page

1. Use `/groq` skill to write the Sanity query this page needs
2. Add the query to `/src/lib/sanity/queries.ts`
3. Verify `generateStaticParams` works: `npm run build`
4. Check metadata renders correctly with: browser dev tools → View Source
5. Add the route to `sitemap.ts` if it's a public page
