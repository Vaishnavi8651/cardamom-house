import rawMenu from "./menu.json";
import { menuSchema, type MenuData, type MenuItem } from "@/types/menu";

/**
 * Parse and validate the JSON menu at module load.
 *
 * `menuSchema.parse` throws a descriptive error if the data is malformed (wrong
 * price type, unknown tag, missing field), so problems surface at build/start —
 * not as a broken page in front of a customer. Downstream code consumes the
 * fully-typed, validated result. Editing the menu means editing `menu.json`.
 */
export const menu: MenuData = menuSchema.parse(rawMenu);

/** Flat id → item lookup, built once, for resolving the day's special. */
const itemsById: ReadonlyMap<string, MenuItem> = new Map(
  menu.categories.flatMap((category) =>
    category.items.map((item) => [item.id, item] as const),
  ),
);

export function getItemById(id: string): MenuItem | undefined {
  return itemsById.get(id);
}
