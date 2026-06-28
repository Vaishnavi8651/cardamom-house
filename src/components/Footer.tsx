import Image from "next/image";
import type { Restaurant } from "@/types/menu";
import { interiorImage, BLUR_DATA_URL } from "@/data/images";
import { Container } from "./ui/Container";

/** "@cardamomhouse" → Instagram profile URL. */
function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

/** Phone string → tel: href (strip spaces). */
function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/** Postal address → Google Maps search link. */
function mapsHref(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function Footer({ restaurant }: { restaurant: Restaurant }) {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
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
          </div>

          {/* Warm closing image; hidden from print to save ink. */}
          <div className="print-hidden relative hidden aspect-[5/3] overflow-hidden rounded-2xl bg-brand-tint shadow-card md:block">
            <Image
              src={interiorImage.src}
              alt={interiorImage.alt}
              fill
              sizes="(min-width: 768px) 33vw, 0px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
          </div>
        </div>

        <p className="mt-10 text-xs text-ink-soft/70">
          © {restaurant.name}. Menu and prices subject to change.
        </p>
      </Container>
    </footer>
  );
}
