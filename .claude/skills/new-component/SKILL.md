---
name: new-component
description: >
  Use this skill whenever creating a new React component for the portfolio website.
  Triggers on: "create a component", "build a [name] component", "add a [name] section",
  "scaffold a [name] card", or any request to build a new UI piece.
---

# new-component

Creates a production-grade React component following the portfolio design system.
Every component must feel intentional — this is a premium portfolio, not a boilerplate site.

## Before Writing Any Code

Ask the following if not already clear from context:
1. **Name** — What is this component called? (PascalCase)
2. **Category** — Which folder does it belong to?
   - `ui/` → reusable primitives (Button, Badge, Card, Input)
   - `layout/` → structural shells (Nav, Footer, Section, Container)
   - `sections/` → full page sections (Hero, ProjectGrid, NewsletterCTA)
   - `3d/` → Three.js/R3F scenes (use `/r3f-component` skill instead)
   - `blog/` → blog-specific (PostCard, PostHeader, TableOfContents)
3. **Props** — What data does it receive? What is optional vs required?
4. **Animation** — Does it animate? On scroll, on hover, or on mount?
5. **Variants** — Does it have visual variants (e.g. size, style, state)?

## File Structure to Create

```
/src/components/{category}/
  {ComponentName}.tsx      ← main component file
  index.ts                 ← barrel export (create or update)
```

If the component has complex sub-parts, create a subfolder:
```
/src/components/{category}/{ComponentName}/
  {ComponentName}.tsx
  {ComponentName}.types.ts   ← if props are complex
  index.ts
```

## Component File Template

Every component follows this exact structure — no exceptions:

```tsx
// 1. Imports — external libraries first, then internal
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// 2. TypeScript interface — always above the component, never inline
interface {ComponentName}Props {
  // Required props first, optional props below with ?
  children?: React.ReactNode
  className?: string
}

// 3. Animation variants — defined outside the component (no re-creation on render)
const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// 4. Named export — never default export for components
export function {ComponentName}({ children, className }: {ComponentName}Props) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('', className)}
    >
      {children}
    </motion.div>
  )
}
```

## Design System Rules — Apply to Every Component

### Colors (CSS variables — never hardcode hex values in components)
```tsx
// ✅ Correct
className="bg-background text-foreground border-border"
className="text-accent"          // #7C3AED violet

// ❌ Wrong
style={{ backgroundColor: '#0A0A0A' }}
className="bg-[#7C3AED]"         // only if no variable exists
```

### Spacing — generous, intentional
- Section padding: `py-24 md:py-32`
- Card padding: `p-6 md:p-8`
- Element gaps: `gap-4` to `gap-8` (never cramped)
- Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Typography hierarchy
```tsx
// Overline (section label above headline)
<p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
  Label
</p>

// Primary headline
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">

// Subheadline / body
<p className="text-muted-foreground text-lg leading-relaxed">
```

### Animation — scroll-triggered, never distracting
```tsx
// Standard scroll reveal (most components)
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}      // ← ALWAYS once: true, never repeat
  transition={{ duration: 0.5, ease: 'easeOut' }}
>

// Staggered children (card grids, lists)
const container = {
  visible: { transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Hover lift (cards, buttons)
whileHover={{ y: -4 }}
transition={{ duration: 0.2 }}
```

### Dark mode
All components are dark-first. Use Tailwind's `dark:` prefix only for
exceptions. The base styles should already be dark.

### Responsive
Mobile-first always:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="text-2xl md:text-3xl lg:text-4xl"
className="flex flex-col md:flex-row"
```

## Barrel Export

After creating the component, update or create the category `index.ts`:
```ts
export { ComponentName } from './ComponentName'
// Add to existing exports, don't replace them
```

## Quality Checklist Before Finishing

- [ ] TypeScript interface defined with JSDoc comments on non-obvious props
- [ ] No `any` types
- [ ] No inline styles
- [ ] No hardcoded color hex values in className
- [ ] Animation uses `viewport={{ once: true }}`
- [ ] Responsive at mobile, tablet, desktop
- [ ] `className` prop accepted and merged with `cn()`
- [ ] Named export (not default)
- [ ] Barrel export updated
- [ ] Run `/simplify` if the component exceeds 120 lines
