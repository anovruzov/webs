# Mycelic Website

The marketing site, built as a statically exported Next.js application.

## Stack

- Next.js 15 (App Router) with `output: "export"`, so every route is
  pre-rendered to static HTML at build time.
- TypeScript in strict mode, Tailwind CSS 3, framer-motion, lucide-react.
- Self-hosted fonts in `public/fonts` (Manrope for display, Inter for body).
  Nothing is fetched from a third-party font CDN at runtime.

## Local development

```
npm ci
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build` (static export into `out/`),
`npm run typecheck`, `npm run lint`.

## Deployment

Cloudflare Workers, configured in `wrangler.jsonc`. On deploy, wrangler runs
the build hook (`npm ci && npm run build`) and then uploads `out/` as static
Worker assets. Clean URLs are handled by the assets runtime, and `404.html`
backs the not-found route.

To check the pipeline without deploying:

```
npx wrangler deploy --dry-run
```

## Content

Design and content rules for the site live in `BRIEF.md`. Page copy is kept in
`content/*.ts` modules so it can be replaced without touching components.
