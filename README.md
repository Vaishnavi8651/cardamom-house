# Cardamom House — Menu Page

A single, public-facing menu page for a fictional Lisbon brunch café. Built as a
focused frontend trial task: typography-led, mobile-first, warm, and brand-true
to the café's amber (`#B45309`).

**Live demo:** _add your Vercel URL here_

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

Requires Node 18.18+ (developed on Node 20).

## Tech

- **Next.js 15** (App Router, React Server Components)
- **React 19**
- **TypeScript** in `strict` mode (plus `noUncheckedIndexedAccess`) — no `any`
- **Tailwind CSS v4** (CSS-first config via `@theme` in `globals.css`)
- **next/font** — Fraunces (display serif) + Inter (body)

No backend, no CMS. The menu is hard-coded in `src/data/menu.json` and read
through a single typed accessor.

## The three states

The brief's three states are driven by a `?state=` query param, parsed and
validated server-side ([`src/lib/state.ts`](src/lib/state.ts)):

| URL | What you see |
| --- | --- |
| `/` or `/?state=open` | **Default.** Tuesday 11:30, café open, special available. |
| `/?state=closed` | Monday — a friendly "We're closed today" banner with the next opening time. |
| `/?state=special-sold-out` | Open, but the Saffron French Toast is dimmed with a *Sold out* pill, and the special callout degrades gracefully. |

The clock is hard-coded per state (allowed by the brief) so reviewers always see
a deterministic page. Open/closed is computed from the real `hours` data against
that simulated moment in [`src/lib/hours.ts`](src/lib/hours.ts), including the
"next opening" lookup that rolls across the week.

## Structure

```
src/
  app/
    layout.tsx        # fonts, metadata, <html>
    page.tsx          # server component — reads ?state=, composes the page
    globals.css       # Tailwind v4 theme tokens + brand palette + print styles
  components/          # presentational, mostly server components
    Hero, OpenStatusBadge, CategoryNav (client), ClosedBanner,
    TodaysSpecial, MenuSection, MenuItemRow, Tag, HoursBlock, Footer
  hooks/
    useActiveSection.ts   # IntersectionObserver scroll-spy
  lib/
    types.ts          # domain types mirroring the JSON
    hours.ts          # open/closed + next-opening logic
    state.ts          # ?state= parsing + simulated clock
    format.ts         # € price formatting
  data/
    menu.json         # source data
    menu.ts           # typed accessor + by-id lookup
```

Only `CategoryNav` and the scroll-spy hook are client components; everything else
renders on the server.

## Decisions & trade-offs

- **Typography over photography.** The brief calls food imagery a defensible
  opt-out. A type-led layout reads faster on a phone outside the café and keeps
  the page light, so I leaned on Fraunces + the amber instead of stock photos.
- **Brand amber used structurally, not decoratively** — the active nav pill, the
  today's-special block, section underlines, the "today" hours row, hover states,
  and links all key off `--color-brand`.
- **Sold-out degrades, doesn't disappear.** The special callout keeps its prime
  position but flips to a calm paper card with an alternative suggestion, so the
  page never looks broken or empty.
- **Accessibility is real:** semantic `<header>/<nav>/<section>/<main>/<footer>`,
  a skip link, `aria-current` on the active section and today's hours, visible
  focus rings, `sr-only` long-forms for the `V`/`GF` tag codes, and
  `prefers-reduced-motion` honoured.
- **Print stylesheet** (stretch goal) collapses the nav/banner and lets the menu
  flow to clean pages via `@media print`.

## What I'd build next

- A real timezone-aware clock (Europe/Lisbon) behind the simulated one, so the
  open/closed badge is live in production.
- A dietary filter (V / GF / all) — the tag data already supports it.
- Light/dark mode honouring `prefers-color-scheme`.
- A small entrance animation with Motion for the special callout.
