/** Shared contact-link helpers, used by the hero CTAs and the footer. */

/** "@cardamomhouse" → Instagram profile URL. */
export function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

/** Phone string → tel: href (strip spaces). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/** Postal address → Google Maps search link. */
export function mapsHref(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}
