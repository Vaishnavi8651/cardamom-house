/**
 * Domain types for the Cardamom House menu.
 * These mirror the shape of `src/data/menu.json` exactly so the data file
 * can be imported with full type-safety (no `any`, ever).
 */

/** The three diet/heat tags that can appear on an item. */
export type DietTag = "V" | "GF" | "spicy";

/** Lowercase day keys, in the order the data file declares them. */
export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/** A single orderable item on the menu. */
export interface MenuItem {
  id: string;
  name: string;
  /** May be an empty string for sides/extras. */
  description: string;
  /** Price in EUR, e.g. 11.5 → €11.50. */
  price: number;
  tags: DietTag[];
}

/** A named group of items (Brunch, Drinks, …). */
export interface Category {
  id: string;
  name: string;
  /** Optional blurb under the section heading; may be empty. */
  description: string;
  items: MenuItem[];
}

/** Weekly opening hours. Closed days hold the literal string "Closed". */
export type Hours = Record<DayKey, string>;

export interface Restaurant {
  name: string;
  tagline: string;
  address: string;
  hours: Hours;
  brand_color: string;
  phone: string;
  instagram: string;
}

export interface TodaySpecial {
  /** References a `MenuItem.id`. */
  item_id: string;
  blurb: string;
}

/** The full menu document. */
export interface MenuData {
  restaurant: Restaurant;
  today_special: TodaySpecial;
  categories: Category[];
}
