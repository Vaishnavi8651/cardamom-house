# Cardamom House — End-to-End Defense & Walkthrough

The single doc to read before the pairing session. It covers what was built, why
each decision was made, how to demo it, and a large bank of likely questions with
crisp answers. Pair this with [ARCHITECTURE.md](ARCHITECTURE.md) (system design)
and [INTERVIEW-PREP.md](INTERVIEW-PREP.md) (rubric mapping + Loom script).

---

## 1. 60-second overview

A single, public-facing menu page for a fictional Lisbon brunch café. Next.js 15
(App Router, RSC), React 19, TypeScript strict, Tailwind v4. No backend; the menu
is JSON, validated at load with zod. Photography-led but typographically anchored,
brand amber `#B45309` used structurally, three demo states via `?state=`, plus
all five stretch goals.

**Run it**
```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

**Demo URLs**
- `/` — open (Tuesday 11:30)
- `/?state=closed` — Monday, closed banner + next opening
- `/?state=special-sold-out` — special dimmed, callout degrades
- `/?diet=V` / `/?diet=GF` — dietary filter (composes with `?state=`)

---

## 2. Architecture in one breath

- **Server-first.** Everything renders as a React Server Component (zero JS)
  except the few genuinely interactive islands.
- **Client islands** (only where the browser is required): `CategoryNav`
  (scroll-spy), `DietFilterControl` (URL update), `ThemeToggle`, and the
  order/modal layer (`OrderProvider`, `ItemModal`, `OrderBar`).
- **State lives in the URL** (`?state=`, `?diet=`) — shareable, server-readable,
  no flash, no state library.
- **Data at the boundary:** `menu.json` → parsed/validated by a zod schema that
  *is* the source of the TypeScript types.
- **Design tokens** drive everything; dark mode just redefines them.

File map: see [ARCHITECTURE.md §4]. Lib is pure functions (`formatPrice`,
`getRestaurantStatus`, `getTodaySpecial`, `state`, `diet`, `contact`).

---

## 3. Feature-by-feature — what & why

### Hero
Name, tagline, **live open/closed badge**, simulated time label, and two CTAs
(**Get directions** → maps, **Call** → `tel:`). Reveals with a subtle *staggered*
fade-up on load. Open/closed comes from `getRestaurantStatus(hours, now)` — `now`
is an argument, so simulated and real clocks share one code path.
*Why CTAs:* the brief frames the page as something customers "land on from the
pavement," so the two most likely phone actions are one tap away.

### Today's special
The boldest amber moment — solid `#B45309` card + the item's photo. "See it on
the menu" deep-links to the exact item (`#brunch_07`) which briefly highlights via
CSS `:target`. Degrades on sold-out (paper card, dimmed photo, pill, friendly
alt copy). The deep-link is dropped if a diet filter hides the item (no dead link).

### Category nav (scroll-spy)
Sticky, horizontally scrollable on mobile. `IntersectionObserver` with a
top-biased `rootMargin` highlights the active section; clicking smooth-scrolls
**and moves focus** into the section. Only client component that *must* be.

### Menu sections & items
Each `<section aria-labelledby>` doubles as scroll anchor + landmark. Items are a
baseline-aligned flex row with a **dotted leader** and `tabular-nums` prices.
Tapping a row opens the detail modal; sold-out rows are non-interactive.

### Dietary filter
`?diet=all|V|GF`, server-side. Drops emptied categories from menu *and* nav.
Accessible native-radio segmented control; preserves other params.

### Item detail modal + "Your picks"
Native `<dialog>` (focus-trap/Esc/backdrop/aria-modal for free) with a larger
photo (item image, else category banner), description, tags, price. "Add to my
picks" feeds a **client-only, localStorage-persisted** list (floating pill +
drawer) — explicitly *not* an order; there's no backend.

### Hours block
Semantic `<dl>`; today's row emphasised with amber + `aria-current="date"`;
closed days muted *and* labelled "Closed" (not colour-only).

### Footer
Address/phone/Instagram as real `tel:`/maps/IG links + interior photo.

### Dark mode
`prefers-color-scheme` + persisted toggle + no-flash inline script. Redefines
semantic tokens; split `--color-brand` (accent) / `--color-on-brand` (text on
fills) keeps amber legible both ways. All pairs ≥ WCAG AA in both themes.

---

## 4. The three states (how they're wired)

`parseState(?state)` → `simulatedNow(state)` gives `{day, minutes, label}` →
`getRestaurantStatus` + `getTodaySpecial`. One sold-out flag drives both the
callout and the matching menu row, so they can't disagree. The clock is faked in
exactly one place (`state.ts`).

---

## 5. Accessibility (they will tab)

Landmarks (`header/nav/main/section/footer`), skip link as first focusable,
`aria-current` on active nav + today's hours, visible `:focus-visible` rings,
`sr-only` full words for `V`/`GF`, native `<dialog>` semantics, `aria-haspopup`
on item triggers, `aria-disabled` on sold-out, `prefers-reduced-motion` disables
all motion, and every interactive element is keyboard reachable.

---

## 6. Responsive strategy

Mobile-first. Single-column hero/special that become two columns at `md`. The
nav scrolls horizontally on small screens; the filter's "Show" label hides below
`sm`; the footer photo is `md`-only; modals are `w-[min(92vw,…)]` with
`max-h-[90dvh]` internal scroll. `overflow-hidden` on the hero clips the rotated
frame so there's no horizontal scroll; `scrollbar-gutter: stable` prevents
modal-open layout shift.

---

## 7. Known trade-offs & edge cases (own these)

- **Simulated clock.** Hard-coded per state (sanctioned by the brief). It's an
  argument to `getRestaurantStatus`, so a real `Europe/Lisbon` clock is a
  one-line swap. *This is my "what I'd revisit" answer.*
- **"Your picks" is not commerce.** No backend; it's a local list to show staff.
  Deliberately not faked as checkout. Removable in ~10 min if deemed off-brief.
- **zod is a dependency.** Justified: validate untrusted JSON at the boundary;
  the schema also generates the types so they can't drift.
- **Special vs filter.** If a diet filter hides the special item, the callout
  stays but its deep-link is suppressed (no dead link).
- **Scroll-spy tail.** A very short last section may not fill the active band; a
  fully robust version would also flag "scrolled to bottom." Left as scope.

---

## 8. Question bank (crisp answers)

**Why Server Components by default?** Static content ships zero JS and the first
paint is correct (no hydration flash on the status badge). I add client only
where the browser is required.

**Why URL state over a store?** Shareable, server-readable, zero deps. A 3-value
enum doesn't need Zustand — that'd be the over-engineering the brief warns of.

**Why zod / why not just `as`?** `as` lies to the compiler; zod *checks* at the
boundary and infers the types, so validation and types share one source. Bad data
fails the build (proven: a string price → `ZodError` at path `price`).

**Why native `<dialog>`?** Focus-trap, Esc, backdrop, `aria-modal` come from the
platform — less code, more correct than a hand-rolled modal. I add scroll-lock +
backdrop-click.

**How does dark mode stay accessible?** Tokens, not `dark:` variants; split brand
token solves the fill-vs-accent contrast conflict; every pair verified ≥ AA;
no-flash script sets the theme before paint.

**Why `Intl` + `en-IE` for price?** `Intl` handles grouping/rounding; `en-IE`
renders the `€11.50` house style, where `pt-PT` would give `11,50 €`.

**Biggest risk in the scroll-spy?** Choosing "active" feels wrong without a
top-biased `rootMargin`; I tuned a `-20%/-55%` band so it activates in the
upper-middle under the sticky bar.

**What would you cut under time pressure?** The picks list first (nice-to-have),
then dark mode. Requirements + the three states are the floor.

**How is the menu extended?** Edit `menu.json`; zod validates on build. Items can
carry `image`; categories can carry a banner `image`.

---

## 9. Loom checklist (3–5 min)
30-sec demo (open → scroll/nav highlight → flip states → filter → dark mode →
tap an item) · proud decision (token-driven theming / server-first) · would-revisit
(real Lisbon clock) · question I wish was answered (is open/closed meant to be
live in prod, or is the queryable clock the final behaviour?).
