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
- **next/image** — optimized, lazy-loaded photography (Unsplash sources)
- **zod** — schema validation + inferred types for the JSON menu

No backend, no CMS. The menu lives in `src/data/menu.json` and is parsed through a
**zod schema** at load (`src/data/menu.ts`). The schema is the single source of
truth for both runtime validation *and* the TypeScript types. Editing the menu —
adding or removing an item, a tag, a photo — is a pure JSON change; if the data
is malformed, the build fails with a precise error instead of shipping a broken
page. Per-category and per-item photos are referenced from the JSON too.

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
    ui/               # reusable primitives: Container, SectionHeading, Badge
  hooks/
    useActiveSection.ts   # IntersectionObserver scroll-spy
  lib/
    formatPrice.ts        # € price formatting (Intl, en-IE)
    getRestaurantStatus.ts # open/closed + next-opening logic
    getTodaySpecial.ts    # resolves the special item + sold-out state
    state.ts              # ?state= parsing + simulated clock
  types/
    menu.ts           # zod schema + inferred domain types
  data/
    menu.json         # the editable menu data (add/remove items here)
    menu.ts           # parses + validates menu.json via zod, + by-id lookup
    images.ts         # curated brand photography (hero, interior)
```

Only `CategoryNav` and the scroll-spy hook are client components; everything else
renders on the server.

## Decisions & trade-offs

- **Photography, engineered.** Real food/interior photos via `next/image`
  (resize, lazy-load, `priority` + blur-up on the hero), sources whitelisted in
  `next.config` and verified to load, with a brand-tint layer behind each image
  so a failed load degrades to colour rather than a broken void. URLs live in one
  typed `data/images.ts` so the café can swap in their own shots.
- **Editorial hero, not a dark-overlay banner.** A full-bleed dark hero reads as
  a generic startup landing page (which the brief warns against); a type-left,
  photo-right layout with a softly layered frame keeps the warm café feel.
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

## Stretch goals implemented

- **Dietary filter** (all / vegetarian / gluten-free) via `?diet=` — server-side,
  shareable, drops emptied categories from both the menu and the nav.
- **Light/dark mode** respecting `prefers-color-scheme`, with a persisted manual
  toggle and a no-flash inline script. Dark mode redefines the semantic colour
  tokens (every component adapts automatically); a split `--color-brand` /
  `--color-on-brand` keeps amber legible as both accent and fill. All colour
  pairs verified ≥ WCAG AA in both themes.
- **Pure-CSS entrance animation** and a **print stylesheet**.
- **HD photography** via `next/image` with hover-zoom.

## What I'd build next

- A real timezone-aware clock (Europe/Lisbon) behind the simulated one, so the
  open/closed badge is live in production.
- A three-way theme control (System / Light / Dark) instead of a two-way toggle.
- Per-item photography for the full menu (the data layer already supports
  `item.image`).
