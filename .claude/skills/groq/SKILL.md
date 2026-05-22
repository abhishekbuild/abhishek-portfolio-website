---
name: groq
description: >
  Use this skill when writing, testing, or optimizing a GROQ query to fetch
  content from Sanity. Triggers on: "write a GROQ query", "fetch [content] from Sanity",
  "query for [data]", "get all posts/projects", "filter by [field]", or any
  Sanity data-fetching need.
---

# groq

Writes, tests, and registers GROQ queries for the portfolio's Sanity content.
Every query is tested live against the development dataset via Sanity MCP
before being added to the codebase.

## Before Writing Any Query

Ask if not already clear:
1. **What data** — Which document type(s) are needed?
2. **Projection** — Which fields? (Never fetch `*` — always project)
3. **Filters** — Any conditions? (status, tags, date range, slug match)
4. **Order** — How should results be sorted?
5. **Pagination** — All results or a limit?
6. **Relations** — Any references to follow (e.g. author on a post)?

## Step 1: Write the Query

Reference the schema types from `CLAUDE.md`. Use these patterns:

### Fetch all documents of a type (list pages)
```groq
*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  readTime,
  tags,
  perspective,
  coverImage {
    asset -> { url },
    alt
  }
}
```

### Fetch single document by slug (detail pages)
```groq
*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  readTime,
  tags,
  perspective,
  coverImage {
    asset -> { url },
    alt
  },
  body[] {
    ...,
    // Resolve image references inside Portable Text
    _type == "imageWithCaption" => {
      ...,
      image {
        asset -> { url },
        alt
      }
    }
  }
}
```

### Fetch slugs only (for generateStaticParams)
```groq
*[_type == "post" && defined(slug.current)] {
  "slug": slug.current
}
```

### Fetch with limit (homepage featured items)
```groq
*[_type == "project"] | order(publishedAt desc) [0..1] {
  _id,
  title,
  "slug": slug.current,
  summary,
  perspective,
  techStack,
  status,
  impact,
  thumbnail {
    asset -> { url },
    alt
  }
}
```

### Filter by field value
```groq
*[_type == "post" && "llm" in tags] | order(publishedAt desc) {
  ...
}
```

### Full-text search (blog search)
```groq
*[_type == "post" && (
  title match $query + "*" ||
  excerpt match $query + "*" ||
  pt::text(body) match $query + "*"
)] | order(publishedAt desc) [0..9] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  tags,
  perspective
}
```

### Fetch site settings (singleton)
```groq
*[_type == "siteSettings"][0] {
  name,
  tagline,
  socials
}
```

### Reference resolution patterns
```groq
// Follow a reference (arrow operator)
author -> { name, avatar { asset -> { url } } }

// Nested reference
techStack[] -> { name, icon { asset -> { url } } }

// Portable Text with resolved images
body[] {
  ...,
  asset -> { url, metadata { dimensions } }
}
```

## Step 2: Test with Sanity MCP

After writing the query, always test it before adding to code:

```
Ask Sanity MCP: "Run this GROQ query against the development dataset
and show me the result shape:

*[_type == "post"] | order(publishedAt desc) [0..2] {
  title, "slug": slug.current, excerpt
}"
```

Verify:
- Results are not empty (if data exists)
- Field names match what the component expects
- No `null` where values should exist (check field name spelling)
- References resolved correctly (not raw `{_ref: "..."}` objects)

## Step 3: Add to queries.ts

Every query lives in one file. Never write GROQ inline in page components.

```ts
// /src/lib/sanity/queries.ts

// --- Posts ---

export const ALL_POSTS_QUERY = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readTime,
    tags,
    perspective,
    coverImage { asset -> { url }, alt }
  }
`

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readTime,
    tags,
    perspective,
    coverImage { asset -> { url }, alt },
    body[] { ..., _type == "imageWithCaption" => {
      ..., image { asset -> { url }, alt }
    }}
  }
`

export const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`

// --- Projects ---

export const ALL_PROJECTS_QUERY = groq`...`
export const PROJECT_BY_SLUG_QUERY = groq`...`
export const PROJECT_SLUGS_QUERY = groq`...`

// --- Search ---

export const SEARCH_QUERY = groq`
  *[_type == "post" && (
    title match $query + "*" ||
    excerpt match $query + "*" ||
    pt::text(body) match $query + "*"
  )] | order(publishedAt desc) [0..9] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    tags,
    perspective
  }
`
```

## Step 4: TypeScript Types

After adding the query, regenerate types:
```bash
npx sanity typegen generate
```

Then use the generated types in the page:
```ts
import type { AllPostsQueryResult } from '@/sanity/types'

const posts = await sanityFetch<AllPostsQueryResult>({ query: ALL_POSTS_QUERY })
```

## GROQ Cheat Sheet

```groq
*[...]           → filter all documents
[0]              → first result only
[0..9]           → first 10 results (inclusive)
| order(x desc)  → sort descending
| order(x asc)   → sort ascending
->               → follow a reference
defined(x)       → field exists and is not null
$param           → variable passed from code
&&               → AND
||               → OR
!                → NOT
in               → array contains value
count(*)         → count matching documents
pt::text(body)   → extract plain text from Portable Text
```

## Common Mistakes

- ❌ Fetching `*[_type == "post"]` without a projection `{...}` — fetches all fields including huge body content
- ❌ `slug` instead of `"slug": slug.current` — returns raw slug object not string
- ❌ `coverImage.url` — images need `asset ->` resolution first
- ❌ Using `[0..10]` for 10 results — GROQ ranges are inclusive, use `[0..9]`
- ❌ Writing queries inline in page.tsx instead of queries.ts
- ❌ Not running `typegen generate` after schema or query changes
