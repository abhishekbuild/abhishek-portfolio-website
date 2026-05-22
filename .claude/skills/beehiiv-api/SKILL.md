---
name: beehiiv-api
description: >
  Use this skill when creating or modifying any Next.js API route that communicates
  with the Beehiiv newsletter API. Triggers on: "subscribe endpoint", "newsletter API",
  "Beehiiv route", "subscriber count", "past issues", "newsletter integration",
  or any request involving the Beehiiv API.
---

# beehiiv-api

Creates Next.js App Router API routes that communicate with the Beehiiv v2 API.
Beehiiv is the single source of truth for all newsletter data — subscriber count,
past issues, and new subscriptions all flow through these routes.

## Before Writing Any Code

Ask if not already clear:
1. **Operation** — Which of the three operations?
   - `subscribe` → user submits email → add to Beehiiv list
   - `issues` → fetch past newsletter issues for the archive page
   - `stats` → fetch live subscriber count for social proof display
2. **Called from** — Which component or page calls this route?
3. **Error handling** — What should the UI show on failure?

## Environment Variables Required

These must exist in `.env.development`, `.env.production`, and Vercel dashboard:
```
BEEHIIV_API_KEY=your_api_key_here
BEEHIIV_PUBLICATION_ID=pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Get these from: Beehiiv dashboard → Settings → Integrations → API Keys

## Shared Beehiiv Client

Create this once — all routes import from it:

```ts
// /src/lib/beehiiv.ts

const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2'

if (!process.env.BEEHIIV_API_KEY) {
  throw new Error('Missing BEEHIIV_API_KEY environment variable')
}
if (!process.env.BEEHIIV_PUBLICATION_ID) {
  throw new Error('Missing BEEHIIV_PUBLICATION_ID environment variable')
}

const PUB_ID = process.env.BEEHIIV_PUBLICATION_ID

function beehiivFetch(path: string, options?: RequestInit) {
  return fetch(`${BEEHIIV_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
}

// ─── Subscribe ─────────────────────────────────────────────────────────────

export interface SubscribeParams {
  email: string
  firstName?: string
}

export async function subscribeToNewsletter({ email, firstName }: SubscribeParams) {
  const res = await beehiivFetch(`/publications/${PUB_ID}/subscriptions`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      first_name: firstName,
      reactivate_existing: true,
      send_welcome_email: true,
      send_double_opt_in: 'not_set',   // uses your Beehiiv dashboard setting
    }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? `Beehiiv subscribe failed: ${res.status}`)
  }

  return res.json()
}

// ─── Past Issues ───────────────────────────────────────────────────────────

export interface BeehiivPost {
  id: string
  title: string
  subtitle: string | null
  slug: string
  status: string
  publish_date: number    // Unix timestamp
  displayed_date: string
  web_url: string
  thumbnail_url: string | null
  stats?: {
    opens: number
    clicks: number
  }
}

export async function getPastIssues(limit = 10): Promise<BeehiivPost[]> {
  const params = new URLSearchParams({
    status: 'confirmed',
    platform: 'both',
    limit: limit.toString(),
    order_by: 'publish_date',
    direction: 'desc',
    expand: 'stats',
  })

  const res = await beehiivFetch(
    `/publications/${PUB_ID}/posts?${params}`
  )

  if (!res.ok) {
    throw new Error(`Beehiiv posts fetch failed: ${res.status}`)
  }

  const data = await res.json()
  return data.data ?? []
}

// ─── Subscriber Count ──────────────────────────────────────────────────────

export async function getSubscriberCount(): Promise<number> {
  const params = new URLSearchParams({ expand: 'stats' })
  const res = await beehiivFetch(`/publications/${PUB_ID}?${params}`)

  if (!res.ok) {
    throw new Error(`Beehiiv stats fetch failed: ${res.status}`)
  }

  const data = await res.json()
  // active_subscriber_count is the real number to display
  return data.data?.stats?.active_subscriber_count ?? 0
}
```

## API Route: Subscribe

```ts
// /src/app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/beehiiv'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate body
    const body = await request.json()
    const { email, firstName } = body

    // Validate email — never trust client input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Subscribe via Beehiiv
    await subscribeToNewsletter({ email, firstName })

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[newsletter/subscribe]', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

// Block non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
```

## API Route: Past Issues

```ts
// /src/app/api/newsletter/issues/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPastIssues } from '@/lib/beehiiv'

export const revalidate = 3600   // cache for 1 hour — issues don't change often

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(
      parseInt(searchParams.get('limit') ?? '10', 10),
      50   // cap at 50 to prevent abuse
    )

    const issues = await getPastIssues(limit)

    return NextResponse.json(
      { success: true, data: issues },
      {
        status: 200,
        headers: {
          // Cache at CDN level too
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('[newsletter/issues]', error)
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}
```

## API Route: Subscriber Count

```ts
// /src/app/api/newsletter/stats/route.ts
import { NextResponse } from 'next/server'
import { getSubscriberCount } from '@/lib/beehiiv'

export const revalidate = 300   // refresh every 5 minutes

export async function GET() {
  try {
    const count = await getSubscriberCount()

    return NextResponse.json(
      { success: true, count },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('[newsletter/stats]', error)
    // Return 0 gracefully — don't break the UI if stats fail
    return NextResponse.json({ success: false, count: 0 }, { status: 200 })
  }
}
```

## Client-Side Usage (React Component)

How to call these routes from a `use client` component:

### Subscribe form
```tsx
'use client'
import { useState } from 'react'

export function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setStatus('success')
      setEmail('')
      setMessage('You're in! Check your inbox to confirm.')
    } catch (err) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === 'loading'}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
```

### Fetch stats server-side (preferred — no loading state needed)
```tsx
// In a server component or page.tsx
const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/newsletter/stats`, {
  next: { revalidate: 300 }
})
const { count } = await res.json()
// Use `count` directly in JSX
```

## Testing Routes Manually

Before connecting to the UI, test with curl:
```bash
# Test subscribe
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test past issues
curl http://localhost:3000/api/newsletter/issues?limit=5

# Test stats
curl http://localhost:3000/api/newsletter/stats
```

## Common Mistakes

- ❌ Putting `BEEHIIV_API_KEY` in `NEXT_PUBLIC_*` — never expose API keys to browser
- ❌ Calling Beehiiv API directly from client components — always go through API routes
- ❌ Not handling `reactivate_existing: true` — returning subscribers should re-activate
- ❌ Displaying raw Unix timestamps — `publish_date` needs formatting
- ❌ Missing `Cache-Control` headers on GET routes — causes unnecessary API calls
- ❌ Not capping the `limit` parameter — always validate and cap user input
