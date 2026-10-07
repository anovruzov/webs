# Mycelic — myceliclabs.com

The public site for Mycelic: shared enterprise intelligence from local knowledge.
It is a statically exported Next.js application.

## Stack

- Next.js 15 (App Router) with `output: "export"`. Every route is pre-rendered
  to static HTML at build time.
- TypeScript (strict). Hand-written CSS in `app/globals.css`, with no CSS framework.
- Geist Sans and Geist Mono via the `geist` package (SIL Open Font License),
  self-hosted at build time.

## Pages

| Route         | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `/`           | Hero, the problem, how it works, applications, research, contact |
| `/technology` | Principles, the acquisition loop, what is implemented today    |
| `/research`   | Memory, Lineage, and Emergence research tracks, with sources   |
| `/company`    | What we are building and how to reach us                       |

## Visual system

- Paper `#FAFAFA`, ink `#111111`, muted `#666666`, hairline `#E5E5E5`. There is
  no accent color. A dark band (`.night`) is used only where research or
  artwork needs a change of atmosphere.
- One family, Geist. Headlines are sentence case. Mono is used only for
  technical annotation: figure captions, scopes, sources, and data.
- Spacing follows the 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160
  scale defined as CSS variables.
- The hero artwork is generated deterministically at build time from a seeded
  growth model (`lib/mycelium.mjs`). It reveals itself with a CSS-only stroke
  animation, and the animation is disabled under `prefers-reduced-motion`.

## Content and claims

Every benchmark figure lives in `content/research.ts`, with its scope and a link
to the artifact it came from in
[anovruzov/NeuralGraph](https://github.com/anovruzov/NeuralGraph). Change
numbers there, never inline in a page. The contact address is in
`content/site.ts`.

## Local development

```
npm ci
npm run dev      # http://localhost:3000
npm run build    # static export into out/
npm run start    # serve out/ locally
```

## Deployment

The site deploys to Cloudflare Workers, configured in `wrangler.jsonc`.
`.github/workflows/deploy.yml` builds `out/` and uploads it as static assets on
every push to `main`. The workflow needs the `CLOUDFLARE_API_TOKEN` repository
secret.
