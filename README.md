# Abhishek Sharma — Portfolio

Personal portfolio of **Abhishek Sharma, Full Stack Developer** (4+ years; backend, cloud, integrations, mobile and AI/LLM work).
It is a production Next.js app with a GoodieBag case study, interactive architecture visualizations, a working contact form and
**Ask Abhishek**, an AI assistant built on the Anthropic Claude API that answers only from portfolio content.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Anthropic TypeScript SDK
- **Hosting:** Vercel, functions pinned to Mumbai (`bom1`)
- **No database.** Nothing on the site needs persistent application data: contact messages are delivered by email, and chat
  history lives in the visitor's own tab (`sessionStorage`). Adding PostgreSQL would be infrastructure without a job.

## Content is the single source of truth

Every personal fact lives in typed modules under [`src/content/`](src/content), taken from the resume:

| File | Contains |
| --- | --- |
| `profile.ts` | Name, titles, location, contact links, summary |
| `experience.ts` | XORLABS roles (Software Engineer, Junior Software Engineer) |
| `projects.ts` | GoodieBag, Avery Telehealth, Code Analyzer |
| `goodiebag.ts` | Case-study data: architecture nodes/edges, webhook flow, challenges |
| `metrics.ts` | The only metrics on the site — each with its scope (Career / GoodieBag / Code Analyzer) |
| `skills.ts`, `engineering.ts`, `credentials.ts`, `assistant.ts` | Skills, engineering topics, certifications/awards/education, assistant copy |

The website **and** the AI assistant's knowledge base ([`src/lib/ai/knowledge.ts`](src/lib/ai/knowledge.ts)) are generated from
these files, so they can't disagree. To update the portfolio, edit the content files, not the components.

## Local development

```bash
npm install
cp .env.example .env.local   # add keys (both features degrade gracefully without them)
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests for request/contact validation (Node's built-in test runner, no extra deps) |
| `npm run check` | typecheck + lint + tests |

Node.js 22.18+ is required (the tests use Node's native TypeScript support).

## Environment variables

All secrets are server-side only; nothing is prefixed `NEXT_PUBLIC_` except the optional site URL.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | For the assistant | Claude API key. Without it `/api/chat` returns a clear 503 and the UI says the assistant is unavailable. |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-opus-5`. |
| `ANTHROPIC_EFFORT` | No | `low` (default), `medium` or `high`. Low keeps grounded answers fast and inexpensive. |
| `RESEND_API_KEY` | For the contact form | [Resend](https://resend.com) API key used to deliver messages. |
| `CONTACT_TO_EMAIL` | No | Recipient. Defaults to `abhisheksharma0265@gmail.com`. |
| `CONTACT_FROM_EMAIL` | No | Sender. Defaults to `Portfolio Contact <onboarding@resend.dev>` (see below). |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | No | Shared rate limiting across serverless instances. Without them limits are per instance, in memory. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL. On Vercel it falls back to the project's production domain automatically. |

## How the main features work

### Ask Abhishek (AI assistant)

- `POST /api/chat` ([route](src/app/api/chat/route.ts)) calls the Claude API **server-side** with the Anthropic SDK and streams
  the answer back as newline-delimited JSON (`delta` / `done` / `error` events).
- The system prompt ([`src/lib/ai/prompt.ts`](src/lib/ai/prompt.ts)) holds the grounding rules and the generated knowledge base.
  Personal facts come only from the portfolio; anything missing gets *"I don't have that information in Abhishek's portfolio."*;
  general technical explanations are labelled as general knowledge; metrics stay in their scope.
- The prompt is static per deployment and sent with `cache_control`, so repeat requests are served from the prompt cache.
- **Server-side refusal fallbacks** are enabled (`fallbacks: "default"`, beta `server-side-fallback-2026-07-01`) for
  `claude-opus-5`. A declined request is retried on Anthropic's recommended fallback model inside the same call.
- **Safeguards:** Origin check, per-IP rate limit (20 requests / 10 min), strict validation (alternating roles, 1,000-character
  questions, bounded history), a 64 KB body cap, and `max_tokens` capped at 4,096 per answer.
- The UI ([`src/components/assistant`](src/components/assistant)) is lazy-loaded on first interaction. It has suggested
  questions, streaming, stop, retry, clear, per-tab persistence, keyboard support, and a bottom sheet on mobile.
  Replies are rendered by a tiny Markdown renderer that builds React elements and only allows relative, `https:` and `mailto:` links.

### Contact form

- `POST /api/contact` ([route](src/app/api/contact/route.ts)) validates with the same module the browser uses
  ([`src/lib/validation/contact.ts`](src/lib/validation/contact.ts)), then delivers via the Resend HTTP API with `reply_to` set
  to the sender. All user input is HTML-escaped in the email.
- **Spam protection:** hidden honeypot field, minimum fill time (2.5 s), per-IP rate limit (5 / hour), Origin check. Suspected
  bots get a silent success, so they learn nothing.
- **Resend setup:** create an API key. The default sender `onboarding@resend.dev` can only deliver to the email that owns the
  Resend account, so either sign up with `abhisheksharma0265@gmail.com` or verify a domain in Resend and set `CONTACT_FROM_EMAIL`
  (e.g. `Portfolio <contact@yourdomain.com>`).

### Performance and accessibility

- All pages are statically prerendered; only the two API routes run on demand.
- Client JavaScript is limited to small islands (nav, theme, metrics count-up, diagrams, skills tabs, form). The assistant
  panel and ⌘K command palette load on first use.
- Section reveals use CSS scroll-driven animations (no JS). Every animation respects `prefers-reduced-motion`.
- Fonts are self-hosted via `next/font`. The theme (light / dark / system, persisted) is applied before first paint.
- Local Lighthouse (production build): Performance 96–100, Accessibility 100, Best Practices 100, SEO 100 on the homepage and
  the case study. axe-core reports no WCAG 2.2 AA violations in either theme.

### SEO

Per-page metadata, canonical URLs, Open Graph/Twitter cards (generated images in `opengraph-image.tsx`), `sitemap.xml`,
`robots.txt`, a web manifest, and JSON-LD (`Person`, `WebSite`, `BreadcrumbList`).

### Security headers

Set in [`next.config.ts`](next.config.ts): CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy` and
`Permissions-Policy`. The CSP allows `'unsafe-inline'` scripts because Next.js hydration data, the pre-paint theme script and
JSON-LD are inline. A nonce-based CSP would force every page to render dynamically, trading away the static performance above.

## Deploying to Vercel

1. Import `abhisheksharma9536/portfolio` at [vercel.com/new](https://vercel.com/new). The framework is detected as Next.js; no
   build settings need changing.
2. Add the environment variables above (at minimum `ANTHROPIC_API_KEY` and `RESEND_API_KEY`) for **Production** and **Preview**.
3. Deploy. [`vercel.json`](vercel.json) pins serverless functions to **`bom1` (Mumbai)**. Static pages are served from Vercel's
   global CDN regardless of region.
4. Optional: add a custom domain under **Project → Settings → Domains**, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy so
   canonical URLs, the sitemap and JSON-LD use it.

### About `abhisheksharma9536.github.io`

GitHub Pages and Vercel are separate hosts. **The `*.github.io` domain can't be attached to Vercel**, because GitHub owns
`github.io` DNS and you can't add the records Vercel needs. The production URL will be the Vercel domain
(`<project>.vercel.app`) or a custom domain you own.

To keep `abhisheksharma9536.github.io` useful, turn it into a redirect:

1. Create a public repository named exactly `abhisheksharma9536.github.io`.
2. Copy [`deploy/github-pages-redirect/index.html`](deploy/github-pages-redirect/index.html) and `404.html` into it, replacing
   `PORTFOLIO_URL` with the production domain.
3. Enable **Settings → Pages → Deploy from branch** (`main`, root).

Visitors (and deep links, via `404.html`) are then forwarded to the Vercel site. GitHub Pages can't send a true HTTP 301, so the
redirect page is `noindex` and points its canonical link at the real site. That keeps search engines focused on the Vercel domain.

## Project structure

```
src/
  app/                 routes, metadata files (OG images, sitemap, robots, manifest, icons), API routes
    api/chat/          streaming Claude API endpoint
    api/contact/       contact form endpoint
    work/goodiebag/    GoodieBag case study
  components/
    home/              homepage sections
    case-study/        case-study building blocks, webhook flow, table of contents
    projects/          interactive architecture diagram
    assistant/         Ask Abhishek launcher, panel, chat hook, Markdown renderer
    command/           ⌘K command palette
    layout/ ui/        header, footer, theme toggle, icons, primitives
  content/             all portfolio facts (single source of truth)
  lib/                 site config, theme, events, AI prompt/knowledge/protocol, server utilities
tests/                 unit tests
assets/fonts/          TTFs used to render Open Graph images
deploy/                GitHub Pages redirect page
```
