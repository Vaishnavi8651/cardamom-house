import Image from "next/image";
import type { Restaurant } from "@/types/menu";
import type { RestaurantStatus } from "@/lib/getRestaurantStatus";
import { heroImage, BLUR_DATA_URL } from "@/data/images";
import { Container } from "./ui/Container";
import { OpenStatusBadge } from "./OpenStatusBadge";

interface HeroProps {
  restaurant: Restaurant;
  status: RestaurantStatus;
  /** Human label of the simulated moment, e.g. "Tuesday 11:30". */
  nowLabel: string;
}

/**
 * Editorial hero: type on the left, a photo on the right in a softly rotated,
 * layered frame for depth — deliberately not a full-bleed dark-overlay hero,
 * which reads as a generic startup landing page and fights the warm palette.
 */
export function Hero({ restaurant, status, nowLabel }: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Soft amber wash + a single blurred orb for depth — restraint, one gradient. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-tint via-cream to-cream"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
      />

      <Container className="grid items-center gap-10 pb-12 pt-14 sm:pt-20 md:grid-cols-2">
        <div>
          <p className="animate-rise mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            Lisbon · Brunch Café
          </p>

          <h1 className="animate-rise font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            {restaurant.name}
          </h1>

          <p className="animate-rise mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
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

        {/* Layered, hand-placed photo frame. */}
        <div className="animate-rise relative mx-auto w-full max-w-sm md:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 -rotate-3 rounded-[1.75rem] bg-brand-tint-strong"
          />
          <div className="group relative aspect-[4/5] rotate-2 overflow-hidden rounded-[1.5rem] bg-brand-tint shadow-card ring-1 ring-ink/5 transition-transform duration-500 hover:rotate-0">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 90vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
