/**
 * Curated photography for the page.
 *
 * Sources are Unsplash (free to use). They live here, in one typed place, so the
 * café can swap in their own shots by editing this file — the components never
 * change. Each entry carries real `alt` text for screen readers.
 *
 * URLs request `auto=format` (WebP/AVIF where supported) and a sensible width;
 * `next/image` then resizes/optimises further per device.
 */

export interface SiteImage {
  src: string;
  alt: string;
}

const UNSPLASH = "https://images.unsplash.com";
// HD source request; next/image downsizes per device via each component's `sizes`.
const COMMON = "auto=format&fit=crop&q=80";

/** Hero — a warm, sunlit brunch table. */
export const heroImage: SiteImage = {
  src: `${UNSPLASH}/photo-1504754524776-8f4f37790ca0?${COMMON}&w=1600`,
  alt: "A sunlit brunch spread of toast, eggs and coffee on a wooden table",
};

/** Today's special — golden French toast (fallback when the item has no image). */
export const specialImage: SiteImage = {
  src: `${UNSPLASH}/photo-1484723091739-30a097e8f929?${COMMON}&w=1200`,
  alt: "Golden French toast, dusted and drizzled, on a plate",
};

/** Footer / brand — the café interior. */
export const interiorImage: SiteImage = {
  src: `${UNSPLASH}/photo-1517248135467-4c7edcad34c4?${COMMON}&w=1400`,
  alt: "The warm, light-filled interior of the café",
};

/**
 * A low-res amber blur used as the placeholder while photos load, so there's
 * never a blank flash — just the brand colour resolving into the image.
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjEwIj48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2YxZGNjMCIvPjwvc3ZnPg==";
