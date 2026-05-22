---
name: deploy
description: >
  Use this skill before merging to main or shipping anything to production.
  Triggers on: "deploy", "ship this", "merge to main", "go to production",
  "push to prod", "release", or any request to publish changes live.
---

# deploy

Pre-deployment checklist and deployment procedure for the portfolio.
Never merge to main without running this. Solo projects rot in production
because shortcuts feel fine in the moment and hurt weeks later.

## Two Environments

```
dev/* branches  →  development dataset  →  Vercel preview URLs
main branch     →  production dataset   →  yourdomain.com
```

Merging to `main` triggers:
1. Vercel builds and deploys the Next.js app (automatic)
2. GitHub Action deploys the Sanity Studio (automatic)

## Pre-flight Checklist

Work through every item. Don't skip, don't assume.

### Code Quality
- [ ] `npm run build` — must complete with zero errors
  ```bash
  npm run build
  # If it fails, fix ALL errors before proceeding
  ```
- [ ] `npm run lint` — zero warnings (warnings become errors in prod mindset)
  ```bash
  npm run lint
  ```
- [ ] `npx tsc --noEmit` — zero TypeScript errors
  ```bash
  npx tsc --noEmit
  ```

### Sanity Schema
- [ ] Any new schema types added to `/sanity/schemas/index.ts`
- [ ] `npx sanity documents validate` — confirms existing content isn't broken
  ```bash
  npx sanity documents validate
  # Output should show 0 errors. Warnings are OK but note them.
  ```
- [ ] TypeScript types regenerated after any schema change
  ```bash
  npx sanity typegen generate
  # Commits the updated /sanity/types.ts
  ```

### Environment Variables
- [ ] Every new env variable added to Vercel dashboard
  - Production scope: variables used in production
  - Preview scope: variables used in Vercel preview URLs
  - Confirm no new `process.env.X` references that aren't in Vercel
- [ ] No secrets committed to Git
  ```bash
  git diff --name-only HEAD~1 | grep -E "\.env"
  # Should return nothing — .env files must not be tracked
  ```

### Content & Data
- [ ] Export production dataset backup BEFORE any destructive schema change
  ```bash
  npx sanity dataset export production ./backups/prod-$(date +%Y%m%d-%H%M).tar.gz
  ```
  Skip this step only if the changes are purely additive (new optional fields).

- [ ] New pages added to sitemap
  Check `/src/app/sitemap.ts` — any new public routes should be listed.

### Metadata & SEO
- [ ] Every new page has `generateMetadata()` or static `metadata` export
- [ ] OG image specified for new pages
- [ ] Page titles follow format: `{Page Name} | Abhishek`

### Performance
- [ ] No new `use client` directives on components that don't need them
  (Server components are the default — only add `use client` for interactivity)
- [ ] No images using `<img>` tag — all use `next/image` with `urlFor()`
- [ ] 3D components wrapped in `dynamic(() => import(...), { ssr: false })`

## Deployment Steps

### Step 1: Final local verification
```bash
# Build once more on a clean slate
npm run build
npm run start
# Open localhost:3000 — spot check the pages you changed
```

### Step 2: Commit and push
```bash
git add .
git commit -m "feat: [brief description of what changed]"

# Push to a feature branch first (not main directly)
git push origin your-branch-name
```

### Step 3: Open a Pull Request
- Title: clear description of what this changes
- Check the Vercel preview URL in the PR — verify it looks correct
- Preview URL uses the development dataset — content may differ from prod

### Step 4: Merge to main
```bash
git checkout main
git merge your-branch-name
git push origin main
```

### Step 5: Monitor deployments
After pushing to main, watch both:

**Vercel** (Next.js app):
- Go to vercel.com → your project → Deployments
- Should show "Building" → "Ready" within ~2 minutes
- If it fails: check build logs for the error

**GitHub Actions** (Sanity Studio):
- Go to GitHub → your repo → Actions tab
- "Deploy Sanity Studio" workflow should be running
- Should complete in ~1 minute
- If it fails: check the SANITY_AUTH_TOKEN secret is set correctly

### Step 6: Post-deployment smoke test
Open `yourdomain.com` and verify:
- [ ] Homepage loads, hero renders, 3D scene appears
- [ ] Blog page shows posts from Sanity
- [ ] Newsletter section shows subscriber count from Beehiiv
- [ ] At least one blog post opens correctly
- [ ] At least one project opens correctly
- [ ] Contact form renders (don't submit in prod smoke test)
- [ ] `/studio` opens Sanity Studio with production dataset label

## If Something Breaks in Production

### Immediate rollback (Vercel)
```
Vercel dashboard → Deployments → find last working deployment → Redeploy
```
This takes ~30 seconds. Do this first, diagnose second.

### Schema rollback (if schema migration broke content)
```bash
# Restore from backup
npx sanity dataset import ./backups/prod-YYYYMMDD-HHMM.tar.gz production --replace
```

### Diagnose before re-deploying
```bash
# Check what changed
git log --oneline -10
git diff HEAD~1 HEAD -- src/

# Check Vercel function logs
vercel logs your-project-name
```

## Commit Message Convention

Use these prefixes consistently — makes git history readable:
```
feat:     new feature or page
fix:      bug fix
schema:   Sanity schema change
content:  content or copy update
style:    visual/CSS change with no logic change
perf:     performance improvement
refactor: code restructure with no behavior change
chore:    dependency update, config change
```
