import type { Restaurant } from "@/lib/types";
import type { OpenStatus } from "@/lib/hours";
import { OpenStatusBadge } from "./OpenStatusBadge";

interface HeroProps {
  restaurant: Restaurant;
  status: OpenStatus;
  /** Human label of the simulated moment, e.g. "Tuesday 11:30". */
  nowLabel: string;
}

export function Hero({ restaurant, status, nowLabel }: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Warm gradient wash + subtle texture lines, all from the brand amber. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-tint via-cream to-cream"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="mx-auto max-w-3xl px-5 pb-10 pt-14 sm:pt-20">
        <p className="animate-rise mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          <span aria-hidden="true" className="h-px w-8 bg-brand" />
          Lisbon · Brunch Café
        </p>

        <h1 className="animate-rise font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          {restaurant.name}
        </h1>

        <p className="animate-rise mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
          {restaurant.tagline}
        </p>

        <div className="animate-rise mt-7 flex flex-wrap items-center gap-3">
          <OpenStatusBadge
            isOpen={status.isOpen}
            nextOpening={status.nextOpening}
          />
          <span className="text-sm text-ink-soft">
            <span className="sr-only">Current time: </span>
            {nowLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
