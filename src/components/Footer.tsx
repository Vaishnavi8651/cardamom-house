import type { Restaurant } from "@/lib/types";

/** Convert "@cardamomhouse" → an Instagram profile URL. */
function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

/** Convert a phone string to a tel: href. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/** Map a postal address to a Google Maps search link. */
function mapsHref(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function Footer({ restaurant }: { restaurant: Restaurant }) {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <p className="font-display text-2xl font-semibold text-brand">
          {restaurant.name}
        </p>
        <p className="mt-1 text-sm text-ink-soft">{restaurant.tagline}</p>

        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Find us
            </h2>
            <a
              href={mapsHref(restaurant.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 block text-sm leading-relaxed text-ink hover:text-brand"
            >
              {restaurant.address}
            </a>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Call
            </h2>
            <a
              href={telHref(restaurant.phone)}
              className="mt-1.5 block text-sm text-ink hover:text-brand"
            >
              {restaurant.phone}
            </a>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Follow
            </h2>
            <a
              href={instagramUrl(restaurant.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 block text-sm text-ink hover:text-brand"
            >
              {restaurant.instagram}
            </a>
          </div>
        </div>

        <p className="mt-10 text-xs text-ink-soft/70">
          © {restaurant.name}. Menu and prices subject to change.
        </p>
      </div>
    </footer>
  );
}
