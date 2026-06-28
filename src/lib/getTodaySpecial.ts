import { menu, getItemById } from "@/data/menu";
import type { MenuItem } from "@/types/menu";
import { type PageState, isSpecialSoldOut } from "./state";

/**
 * Everything the UI needs to render "today's special", resolved in one place so
 * the page component stays declarative (it renders a view, it doesn't compute one).
 */
export interface TodaySpecialView {
  /** The resolved item, or undefined if the id no longer matches anything. */
  item: MenuItem | undefined;
  blurb: string;
  isSoldOut: boolean;
  /** Exposed so the matching menu row can be marked sold out from one source. */
  itemId: string;
}

export function getTodaySpecial(state: PageState): TodaySpecialView {
  const { item_id, blurb } = menu.today_special;
  return {
    item: getItemById(item_id),
    blurb,
    isSoldOut: isSpecialSoldOut(state),
    itemId: item_id,
  };
}
