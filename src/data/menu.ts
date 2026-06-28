import rawMenu from "./menu.json";
import type { MenuData, MenuItem } from "@/lib/types";

/**
 * The menu, typed. We assert the imported JSON to `MenuData` once, here, so the
 * rest of the app consumes a fully-typed object and never touches `any`.
 * The structural shape is kept in lock-step with `lib/types.ts` by hand — it's
 * hard-coded data that changes rarely, which is a deliberate, documented choice.
 */
export const menu: MenuData = rawMenu as MenuData;

/** Flat lookup of every item by id, useful for the "today's special" callout. */
const itemsById: ReadonlyMap<string, MenuItem> = new Map(
  menu.categories.flatMap((category) =>
    category.items.map((item) => [item.id, item] as const),
  ),
);

export function getItemById(id: string): MenuItem | undefined {
  return itemsById.get(id);
}
