import Image from "next/image";
import type { MenuItem } from "@/types/menu";
import { formatPrice } from "@/lib/formatPrice";
import { specialImage, BLUR_DATA_URL } from "@/data/images";
import { Container } from "./ui/Container";
import { Badge } from "./ui/Badge";

interface TodaysSpecialProps {
  item: MenuItem | undefined;
  blurb: string;
  soldOut: boolean;
}

/**
 * The day's-special callout — the boldest use of the brand amber on the page.
 *
 * Sold-out degrades rather than disappears: it keeps its prominent slot but
 * recedes to a calm paper card with a dimmed photo, a "Sold out" pill and a
 * friendly alternative, so the page never looks broken. Renders nothing if the
 * referenced item can't be resolved.
 */
export function TodaysSpecial({ item, blurb, soldOut }: TodaysSpecialProps) {
  if (!item) return null;

  return (
    <Container className="pt-8">
      <section aria-labelledby="special-heading" className="print-break-avoid">
        <div
          className={[
            "grid overflow-hidden rounded-3xl shadow-card md:grid-cols-2",
            soldOut ? "border border-line bg-paper" : "bg-brand text-on-brand",
          ].join(" ")}
        >
          {/* Text — second on desktop, below the photo on mobile. */}
          <div className="order-2 p-6 sm:p-8 md:order-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                id="special-heading"
                className={[
                  "text-xs font-semibold uppercase tracking-[0.2em]",
                  soldOut ? "text-brand" : "text-on-brand/80",
                ].join(" ")}
              >
                Today&rsquo;s Special
              </p>
              {soldOut ? <Badge tone="dark">Sold out</Badge> : null}
            </div>

            <h2
              className={[
                "mt-3 font-display text-2xl font-semibold sm:text-3xl",
                soldOut ? "text-ink" : "text-on-brand",
              ].join(" ")}
            >
              {item.name}
              <span
                className={[
                  "ml-3 align-middle text-lg font-medium tabular-nums",
                  soldOut ? "text-ink-soft" : "text-on-brand/80",
                ].join(" ")}
              >
                {formatPrice(item.price)}
              </span>
            </h2>

            <p
              className={[
                "mt-2 max-w-prose text-sm leading-relaxed sm:text-base",
                soldOut ? "text-ink-soft" : "text-on-brand/90",
              ].join(" ")}
            >
              {soldOut
                ? `Today's ${item.name} has sold out — it tends to go fast. Ask our team what's good instead, or catch it fresh tomorrow.`
                : blurb}
            </p>

            {!soldOut ? (
              <a
                href="#brunch"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-brand transition-transform hover:-translate-y-0.5"
              >
                See it on the menu
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>

          {/* Photo — first on mobile (appetising lead), right column on desktop.
              Uses the item's own image when present, else the curated fallback. */}
          <div className="group relative order-1 min-h-[12rem] overflow-hidden md:order-2 md:min-h-full">
            <Image
              src={item.image ?? specialImage.src}
              alt={item.image ? item.name : specialImage.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className={[
                "object-cover transition-transform duration-700 ease-out",
                soldOut ? "opacity-50 grayscale" : "group-hover:scale-105",
              ].join(" ")}
            />
            {soldOut ? (
              <div aria-hidden="true" className="absolute inset-0 bg-paper/30" />
            ) : null}
          </div>
        </div>
      </section>
    </Container>
  );
}
