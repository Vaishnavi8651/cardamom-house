import type { MenuItem, TodaySpecial as TodaySpecialData } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface TodaysSpecialProps {
  special: TodaySpecialData;
  item: MenuItem | undefined;
  soldOut: boolean;
}

/**
 * The day's-special callout — the loudest use of the brand amber on the page.
 * Degrades gracefully when sold out: it keeps its prominence but swaps the
 * message and tones down the colour so it reads as "noted, but gone".
 */
export function TodaysSpecial({ special, item, soldOut }: TodaysSpecialProps) {
  // Defensive: if the referenced item is missing, render nothing rather than crash.
  if (!item) return null;

  return (
    <section
      aria-labelledby="special-heading"
      className="mx-auto max-w-3xl px-5 pt-8 print-break-avoid"
    >
      <div
        className={[
          "relative overflow-hidden rounded-3xl px-6 py-7 shadow-card sm:px-8 sm:py-8",
          soldOut
            ? "border border-line bg-paper"
            : "bg-brand text-cream",
        ].join(" ")}
      >
        {/* Decorative accent only when available, kept out of the a11y tree. */}
        {!soldOut && (
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-soft/40 blur-2xl"
          />
        )}

        <div className="relative flex flex-wrap items-center gap-2">
          <p
            className={[
              "text-xs font-semibold uppercase tracking-[0.2em]",
              soldOut ? "text-brand" : "text-cream/80",
            ].join(" ")}
            id="special-heading"
          >
            Today&rsquo;s Special
          </p>
          {soldOut && (
            <span className="inline-flex items-center rounded-full bg-ink/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream">
              Sold out
            </span>
          )}
        </div>

        <h2
          className={[
            "mt-3 font-display text-2xl font-semibold sm:text-3xl",
            soldOut ? "text-ink" : "text-cream",
          ].join(" ")}
        >
          {item.name}
          <span
            className={[
              "ml-3 align-middle text-lg font-medium tabular-nums",
              soldOut ? "text-ink-soft" : "text-cream/80",
            ].join(" ")}
          >
            {formatPrice(item.price)}
          </span>
        </h2>

        <p
          className={[
            "mt-2 max-w-xl text-sm leading-relaxed sm:text-base",
            soldOut ? "text-ink-soft" : "text-cream/90",
          ].join(" ")}
        >
          {soldOut
            ? `Today's ${item.name} has sold out — it tends to go fast. Ask our team what's good instead, or catch it fresh tomorrow.`
            : special.blurb}
        </p>

        {!soldOut && (
          <a
            href={`#brunch`}
            className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-brand transition-transform hover:-translate-y-0.5"
          >
            See it on the menu
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </section>
  );
}
