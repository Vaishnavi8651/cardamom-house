/**
 * Domain types for the Cardamom House menu.
 *
 * These describe the *shape* of our hard-coded data. `data/menu.ts` then uses
 * `satisfies MenuData` to prove the literal conforms — so a typo in the data is a
 * compile error here, not a runtime surprise. No `any`, ever.
 */

/** The three diet/heat tags an item can carry. A closed union, not `string`. */
export type DietTag = "V" | "GF" | "spicy";

/** Lowercase day keys, in the café's week order (starts Monday). */
export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/** A single orderable item. */
export interface MenuItem {
  id: string;
  name: string;
  /** May be "" for sides/extras — kept required so every item is uniform. */
  description: string;
  /** Price in EUR as a number, e.g. 11.5 → "€11.50". Never a pre-formatted string. */
  price: number;
  tags: DietTag[];
}

/** A named group of items (Brunch, Drinks, …). */
export interface Category {
  id: string;
  name: string;
  /** Optional blurb under the heading; may be empty. */
  description: string;
  items: MenuItem[];
}

/** Weekly opening hours. A closed day holds the literal string "Closed". */
export type Hours = Record<DayKey, string>;

export interface Restaurant {
  name: string;
  tagline: string;
  address: string;
  hours: Hours;
  /** Hex string; surfaced as a CSS token, not used inline. */
  brand_color: string;
  phone: string;
  instagram: string;
}

export interface TodaySpecial {
  /** References a `MenuItem.id`. */
  item_id: string;
  blurb: string;
}

/** The full menu document — the single source of truth for the page. */
export interface MenuData {
  restaurant: Restaurant;
  today_special: TodaySpecial;
  categories: Category[];
}
