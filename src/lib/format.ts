/** Format a numeric price as euros, e.g. 11.5 → "€11.50". */
const euros = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(price: number): string {
  // pt-PT renders "11,50 €"; we prefer the symbol-first "€11.50" house style.
  return `€${price.toFixed(2)}`;
}

export { euros };
