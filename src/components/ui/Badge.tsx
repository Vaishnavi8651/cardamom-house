import type { ReactNode } from "react";

/**
 * Visual tones for the pill. Kept to the four we actually use:
 *  - neutral → dietary tags (V, GF): quiet, subtle, the brief's "distinct but subtle"
 *  - brand   → accent tag (spicy): amber tint, still understated
 *  - amber   → "today" / active emphasis: solid brand fill
 *  - dark    → "Sold out": high-contrast ink fill so it reads as a hard stop
 */
export type BadgeTone = "neutral" | "brand" | "amber" | "dark";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "border border-line bg-paper text-ink-soft",
  brand: "border border-brand/30 bg-brand-tint text-brand",
  amber: "bg-brand text-on-brand",
  dark: "bg-ink/90 text-cream",
};

const BASE =
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide";

/**
 * The one pill shape in the system. Domain components (Tag, sold-out marker,
 * "today" marker) compose this rather than re-declaring pill styling, so the
 * shape changes in exactly one place.
 */
export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span className={[BASE, TONE_CLASSES[tone], className].join(" ")}>
      {children}
    </span>
  );
}
