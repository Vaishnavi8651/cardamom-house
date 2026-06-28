"use client";

import type { MenuItem } from "@/types/menu";
import { formatPrice } from "@/lib/formatPrice";
import { useOrder } from "./order/OrderProvider";
import { Badge } from "./ui/Badge";
import { TagList } from "./Tag";

interface MenuItemRowProps {
  item: MenuItem;
  /** When true the row dims and shows a "Sold out" pill, and isn't clickable. */
  soldOut?: boolean;
  /** Fallback header image for the detail modal when the item has no photo. */
  categoryImage?: string;
  categoryName?: string;
}

/**
 * One menu line: "name ………… price", with description and tags beneath. Clicking
 * opens the item detail modal (unless sold out). Layout uses a baseline-aligned
 * flex row with a dotted leader (a real menu convention) and tabular-nums prices.
 */
export function MenuItemRow({
  item,
  soldOut = false,
  categoryImage,
  categoryName,
}: MenuItemRowProps) {
  const { openItem } = useOrder();

  const content = (
    <>
      <div className="flex items-baseline gap-2.5">
        <h3 className="font-display text-lg font-medium leading-snug text-ink">
          {item.name}
        </h3>

        {soldOut ? <Badge tone="dark">Sold out</Badge> : null}

        <span
          aria-hidden="true"
          className="mb-1.5 hidden flex-1 self-end border-b border-dotted border-line sm:block"
        />

        <span className="ml-auto shrink-0 font-display text-lg font-medium tabular-nums text-ink sm:ml-0">
          {formatPrice(item.price)}
        </span>
      </div>

      {item.description ? (
        <p className="max-w-prose text-sm leading-relaxed text-ink-soft">
          {item.description}
        </p>
      ) : null}

      {item.tags.length > 0 ? (
        <div className="mt-0.5">
          <TagList tags={item.tags} />
        </div>
      ) : null}
    </>
  );

  if (soldOut) {
    return (
      <li className="px-2 py-4 opacity-55 print-break-avoid" aria-disabled="true">
        {content}
      </li>
    );
  }

  return (
    <li className="print-break-avoid">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`${item.name}, ${formatPrice(item.price)}. View details`}
        onClick={() =>
          openItem({
            item,
            image: item.image ?? categoryImage,
            category: categoryName,
          })
        }
        className="block w-full rounded-lg px-2 py-4 text-left transition-colors hover:bg-brand-tint/40"
      >
        {content}
      </button>
    </li>
  );
}
