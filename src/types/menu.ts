import { z } from "zod";

/**
 * The menu schema — the single source of truth for both runtime validation and
 * the TypeScript types (inferred via `z.infer`). The data lives in
 * `data/menu.json`; `data/menu.ts` parses it through `menuSchema` at load, so a
 * malformed or mistyped menu fails loudly with a precise error instead of
 * rendering broken. Editing the menu is then a pure JSON change, validated
 * automatically.
 */

export const dietTagSchema = z.enum(["V", "GF", "spicy"]);
export type DietTag = z.infer<typeof dietTagSchema>;

export const dayKeySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);
export type DayKey = z.infer<typeof dayKeySchema>;

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Optional in the data — sides omit it; defaults to "" so the UI is uniform. */
  description: z.string().default(""),
  price: z.number().nonnegative(),
  tags: z.array(dietTagSchema).default([]),
  /** Optional photo (e.g. the day's special); any item may carry one. */
  image: z.string().optional(),
});
export type MenuItem = z.infer<typeof menuItemSchema>;

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(""),
  /** Optional section banner photo. */
  image: z.string().optional(),
  items: z.array(menuItemSchema).min(1),
});
export type Category = z.infer<typeof categorySchema>;

export const hoursSchema = z.object({
  monday: z.string(),
  tuesday: z.string(),
  wednesday: z.string(),
  thursday: z.string(),
  friday: z.string(),
  saturday: z.string(),
  sunday: z.string(),
});
export type Hours = z.infer<typeof hoursSchema>;

export const restaurantSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  address: z.string(),
  hours: hoursSchema,
  brand_color: z.string(),
  phone: z.string(),
  instagram: z.string(),
});
export type Restaurant = z.infer<typeof restaurantSchema>;

export const todaySpecialSchema = z.object({
  item_id: z.string(),
  blurb: z.string(),
});
export type TodaySpecial = z.infer<typeof todaySpecialSchema>;

export const menuSchema = z.object({
  restaurant: restaurantSchema,
  today_special: todaySpecialSchema,
  categories: z.array(categorySchema).min(1),
});
export type MenuData = z.infer<typeof menuSchema>;
