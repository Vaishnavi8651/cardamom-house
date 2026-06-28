# Cardamom House — System Design & Architecture

This is the "why" document. It explains the rendering model, the state strategy,
the folder structure, and the decisions behind each — written so they can be
defended in a live pairing session.

> **Status:** Implemented. The repo ships the pragmatic-hybrid structure in
> Section 4 (flat components + `ui/` primitives + intention-revealing `lib`
> names + `satisfies`-typed `data/menu.ts` + `types/menu.ts`), with photography
> via `next/image`. All migration bridges have been removed.

---

## 1. Design goals (in priority order, from the brief)

1. Design taste 2. Code quality 3. State/edge-cases 4. Brand fidelity
5. Mobile 6. Accessibility 7. Communication.

Every architectural choice below is justified against *these*, not against
generic "best practice".

---

## 2. Rendering model — server-first with one client island

**Decision:** Render everything as a React Server Component except the sticky
category nav, which is a single `"use client"` island.

**Why:**
- The menu is static, non-interactive content. Server Components ship **zero
  JavaScript** for it — ideal for a page read on mobile data outside a café.
- The first paint is already correct (open/closed, sold-out) because the server
  reads the state — no client-side flash or hydration flicker.
- The *only* thing that needs the browser is "which section am I scrolled to",
  which requires `IntersectionObserver` + scroll position. That justifies exactly
  one client component (`CategoryNav` + its `useActiveSection` hook).

**Trade-off considered:** Making the whole page client-side would be simpler to
reason about but throws away the zero-JS win and risks a hydration flash on the
status badge. Not worth it for one scroll-spy.

---

## 3. State strategy — the URL is the state

**Decision:** The three demo states live in a `?state=` query param, parsed and
validated on the server (`lib/state` → `getRestaurantStatus` consumes it).

```
?state=open              → Tuesday 11:30, open, special available  (default)
?state=closed            → Monday, closed banner + next opening
?state=special-sold-out  → open, Saffron French Toast sold out
```

**Why the URL and not React state / Context / Zustand:**
- **Shareable & demo-able** — the reviewer pastes a link and lands in that state.
- **Server-readable** — first render is correct; no flash, no effect-on-mount.
- **Zero dependencies** — a 3-value enum does not need a state library. Adding one
  would be exactly the "fake enterprise abstraction" the brief warns against.

**The simulated clock.** The brief permits hard-coding the time. Each state maps
to a `SimulatedNow { day, minutes, label }`. Crucially, `getRestaurantStatus()`
takes the moment as a **parameter** — so the simulated clock and a future real
`Europe/Lisbon` clock are interchangeable without touching the open/closed logic.

```
parseState(?state) ─► simulatedNow(state) ─┐
                                            ├─► getRestaurantStatus(hours, now) ─► { isOpen, nextOpening }
restaurant.hours ───────────────────────────┘
```

---

## 4. Folder structure — the one open decision

Your brief proposed **folder-per-component** (`components/Hero/`, …) plus a
`components/ui/` primitives layer. Here is my senior read on it.

### What I'd keep from your proposal (genuinely good)
- **`components/ui/` primitives** — `Badge`, `Container`, `SectionHeading`. These
  are *actually* reused (Badge → tags, sold-out pill, "today" pill, open status;
  Container → consistent max-width/padding; SectionHeading → every section rule).
  A small design-system layer signals reuse-thinking. **Adopt this.**
- **Intention-revealing `lib` names** — `getRestaurantStatus`, `getTodaySpecial`,
  `formatPrice`. Clearer than my `hours.ts`/`state.ts`. **Adopt the names.**
- **`types/menu.ts`** as the home for domain types. Fine, matches the mental model.
- **`data/menu.ts`** typed with `satisfies MenuData` instead of a JSON cast —
  removes the `as` cast and prevents the data drifting from the types. **Upgrade.**

### What I'd push back on (over-engineering for this size)
- **Folder-per-component** (`Hero/index.tsx` + `Hero/Hero.tsx`). For a one-page
  app where each component is a single file with no co-located styles, tests, or
  sub-components, the folders are empty ceremony — re-export `index` files that
  exist only to look enterprise-y. The brief explicitly says *don't* create fake
  abstractions or over-engineer. **Recommend flat files**, promote a component to
  its own folder *only when it grows a second file.**

### Recommended target structure (the pragmatic hybrid)

```
src/
  app/
    layout.tsx          # fonts, metadata
    page.tsx            # server component: reads ?state=, composes the page
    globals.css         # Tailwind v4 @theme tokens + brand palette + print
  components/
    Hero.tsx
    CategoryNav.tsx     # "use client" — scroll-spy island
    ClosedBanner.tsx
    TodaysSpecial.tsx
    MenuSection.tsx
    MenuItemRow.tsx
    HoursBlock.tsx
    Footer.tsx
    ui/                 # reusable primitives (design-system seed)
      Badge.tsx
      Container.tsx
      SectionHeading.tsx
  hooks/
    useActiveSection.ts
  lib/
    formatPrice.ts
    getRestaurantStatus.ts   # parse hours + open/closed + next opening
    getTodaySpecial.ts       # resolve the special item + sold-out state
    state.ts                 # ?state= parsing + simulated clock
  types/
    menu.ts
  data/
    menu.ts             # the data, `satisfies MenuData`
```

**The interview story this gives you:** "I was handed a suggested structure, kept
the parts that paid for themselves (ui primitives, clear lib names, typed data),
and rejected the folder-per-component ceremony because it doesn't earn its keep at
this scope." That *is* the senior judgment they're scoring.

---

## 5. Component responsibilities (single-purpose)

| Component | Responsibility | Server/Client |
|---|---|---|
| `Hero` | Name, tagline, open/closed badge | Server |
| `CategoryNav` | Sticky jump-nav, active-on-scroll | **Client** |
| `ClosedBanner` | Friendly closed message + next opening | Server |
| `TodaysSpecial` | Brand-amber callout; degrades on sold-out | Server |
| `MenuSection` | Heading + description + item list | Server |
| `MenuItemRow` | One item: name, desc, €price, tags, sold-out | Server |
| `HoursBlock` | Weekly hours, today emphasised, closed distinct | Server |
| `Footer` | Address, phone, Instagram (as links) | Server |
| `ui/Badge` | Tag / pill / status chip | Server |

---

## 6. Styling — Tailwind v4, brand as a token

- CSS-first config: design tokens declared in `globals.css` via `@theme`.
- The brand amber is a **named token** (`--color-brand`), so "use the brand
  colour meaningfully" becomes a single source of truth used by the nav pill,
  the special block, section rules, the "today" hours row, links, and focus ring.
- Restraint by policy: one soft card shadow token, gradients limited to the hero
  wash. The brief explicitly warns against shadow/gradient overuse.

---

## 7. Accessibility architecture (real, not theatrical)

- Semantic landmarks: `header`, `nav[aria-label]`, `main`, `section[aria-labelledby]`,
  `footer`.
- Skip-to-menu link as the first focusable element.
- `aria-current` on the active nav item and on today's hours row.
- Visible `:focus-visible` ring driven by the brand token.
- `V`/`GF` tag codes carry `sr-only` full words ("Vegetarian"/"Gluten-free").
- `prefers-reduced-motion` disables the entrance animation and smooth scroll.

---

## 8. Deliberate non-goals (scope discipline)

Stretch-only in the brief; documented instead of half-built:
dietary filter · light/dark mode · real-time Lisbon clock · animation library ·
food photography (intentional typographic choice).
