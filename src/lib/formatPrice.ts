/**
 * Format a price as euros in the café's house style: "€11.50".
 *
 * We use `Intl.NumberFormat` (locale-aware grouping + rounding) rather than
 * hand-rolling `€${n.toFixed(2)}`, which silently drops thousands separators and
 * hard-codes the decimal mark. The locale is deliberately `en-IE`, not `pt-PT`:
 * Portuguese renders "11,50 €" (symbol last, comma decimal), whereas Irish
 * English euro formatting gives the "€11.50" we want.
 *
 * The formatter is created once at module load, not per call — constructing an
 * `Intl.NumberFormat` is comparatively expensive.
 */
const eurFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(price: number): string {
  return eurFormatter.format(price);
}
