import type { Category } from "@/types/menu";

/**
 * Dietary filter, driven by the `?diet=` query param — consistent with how the
 * page already models state in the URL. Filtering happens server-side (the page
 * re-renders with a filtered menu); only the control is a client component.
 *
 * "spicy" is a heat tag, not a dietary one, so it's deliberately not a filter
 * option (the brief asks for vegetarian / gluten-free / all).
 */
export type DietFilter = "all" | "V" | "GF";

const VALID_FILTERS: readonly DietFilter[] = ["all", "V", "GF"];

export function parseDiet(raw: string | string[] | undefined): DietFilter {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return VALID_FILTERS.includes(value as DietFilter)
    ? (value as DietFilter)
    : "all";
}

/**
 * Return categories with their items filtered to the diet, dropping any category
 * left empty — so neither the menu nor the nav shows a hollow section.
 */
export function filterCategories(
  categories: Category[],
  filter: DietFilter,
): Category[] {
  if (filter === "all") return categories;
  return categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.tags.includes(filter)),
    }))
    .filter((category) => category.items.length > 0);
}
