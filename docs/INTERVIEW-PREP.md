# Cardamom House — What the Interviewer Actually Wants

A decoding of the trial-task PDF, the evaluation rubric, and how each of our
decisions maps to it. This is the doc to read the night before the pairing call.

---

## 1. The meta-signal (read between the lines)

The brief says it out loud in a few places — worth taking literally:

- _"The goal is not for us to extract free work… we won't ship what you build."_
  → They don't care about features. They care about **how you think**.
- _"how you handle ambiguity, and how you make design decisions when nobody is
  over your shoulder."_
  → **Judgment under ambiguity** is the actual test. Every gap in the spec is an
  invitation to make and *justify* a call.
- _"We will ask you about your code in the live pairing session — be ready to
  defend the choices."_
  → **Defensibility > cleverness.** A simple thing you can explain beats a clever
  thing you can't.
- _"feel like Cardamom House, not a Notion template"_ and _"not a stock
  template."_
  → **Taste and brand fidelity** are scored, not decoration.
- _"Accessibility. Real, not theatrical. We will tab through your page."_
  → They will literally keyboard-test it. No `aria` theatre — real semantics.
- _"We'd rather see crisp judgment about scope than a sprawling half-finished
  project."_
  → **Scope discipline is a graded skill.** Saying "I deliberately didn't do X"
  scores points.

**Conclusion:** this is a product-thinking + communication test wearing a
frontend-task costume. The code is the artifact; the *reasoning* is the deliverable.

---

## 2. The rubric, in their priority order, mapped to our work

| # | They evaluate | What earns the marks | Where we address it |
|---|---|---|---|
| 1 | **Design taste** (highest) | Intentional spacing, type hierarchy, warmth; looks café-proud | Typography-led layout (Fraunces + Inter), warm cream palette, restrained shadows/gradients, generous whitespace |
| 2 | **Code quality** | Small typed components, no `any`, clean Tailwind, sane structure | `strict` + `noUncheckedIndexedAccess`, one-responsibility components, `satisfies`-typed data, `ui/` primitives |
| 3 | **State & edge cases** | The 3 states make sense; sold-out degrades; closed banner placed well | `?state=` parsed server-side; simulated clock; sold-out keeps the callout but changes its message |
| 4 | **Brand fidelity** | `#B45309` used *meaningfully*, not sprinkled | Brand token drives: active nav pill, today's-special block, section rules, "today" hours row, links, focus ring |
| 5 | **Mobile experience** | Tap targets, scroll, sticky nav on a phone | Mobile-first; horizontally-scrollable sticky nav; ≥44px targets; tested at 360px |
| 6 | **Accessibility** | Real semantics, keyboard, focus, contrast | Landmarks, skip link, `aria-current`, visible focus, `sr-only` tag long-forms, reduced-motion |
| 7 | **Communication** | Loom + README explain trade-offs plainly | README + these docs + the Loom script below |

If you can speak to each row in one or two sentences, you've covered the rubric.

---

## 3. The deliverables checklist (from the PDF)

- [ ] GitHub repo (public or shared private)
- [ ] Vercel deployment link (clickable, working)
- [ ] Loom / screen recording, **3–5 min**
- [ ] Short README (run locally · tech · what you'd build next) — ✅ done

### The Loom must explicitly cover (they list these):
1. **30-second demo** — load `?state=open`, scroll the menu, show the sticky nav
   highlight, then flip to `?state=closed` and `?state=special-sold-out`.
2. **One decision you're proud of** → *Typography-led, no stock photos.* It's a
   defensible design call the brief invites, it loads fast on a pavement phone,
   and it forces the brand colour and type to carry the warmth. (Backup:
   server-first rendering with state in the URL.)
3. **One decision you'd revisit with another half-day** → *The clock is
   simulated per state.* I'd wire a real `Europe/Lisbon` time source behind the
   same `getRestaurantStatus()` interface so the badge is live in production.
4. **One question you wish they'd answered up front** → *"Should open/closed be
   real-time in production, or is the simulated/queryable clock the intended
   final behaviour?"* It changes whether the page can be statically cached.

---

## 4. Likely pairing-session questions + strong answers

**"Why is most of the page a Server Component?"**
The menu is static data with no interactivity. Server Components ship zero JS for
that content, which is the right default for a page mostly read on mobile data.
Only the sticky nav needs the client (scroll position + IntersectionObserver), so
that's the one `"use client"` island.

**"Why put state in a query param instead of React state / a store?"**
Three reasons: it's shareable and demo-able (paste a URL, get a state), it's
server-readable so the first paint is already correct (no flash), and it needs no
extra library. A store would be over-engineering for a 3-value enum.

**"How does the open/closed logic work, and is it timezone-correct?"**
`getRestaurantStatus()` parses the hours strings into minute ranges and compares
against a "now". Today the "now" is simulated per state (the brief allows
hard-coding). The function signature already takes the moment as input, so
swapping in a real Lisbon clock is a one-line change — the logic doesn't move.

**"Why not folder-per-component / a bigger structure?"**
For a single page, folder-per-component is ceremony — empty `index.ts`
re-exports and one-file folders. I kept flat files but did add a `ui/` primitives
layer (Badge, Container, SectionHeading) because those are genuinely reused. I
optimise structure for *this* size, not an imagined future one.

**"Show me your accessibility."** (they will tab)
Landmarks (`header/nav/main/section/footer`), a skip link, `aria-current` on the
active nav item and today's hours row, visible focus rings, and the `V`/`GF`
codes have `sr-only` full words so a screen reader says "Vegetarian", not "vee".

**"How does sold-out degrade?"**
The item dims with a `Sold out` pill (kept in the list — people still want to see
it). The top callout doesn't vanish; it switches to a calm paper card with an
alternative suggestion, so the page never looks broken.

**"What did you deliberately leave out?"**
Dietary filter, dark mode, real-time clock, animation library. All are
stretch-only in the brief; I time-boxed and listed them in the README instead of
half-building them.

---

## 5. One-line trade-off cheat sheet

- Server-first, one client island → less JS, correct first paint.
- URL state, no store → shareable, server-readable, zero deps.
- Typography over photos → fast, on-brand, defensible.
- Flat components + `ui/` primitives → no ceremony, real reuse.
- Simulated clock behind a real interface → meets brief, trivially upgradable.
- Scope cut, documented → judgment over feature-count.
