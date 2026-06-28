import type { MenuItem } from "@/types/menu";
import { formatPrice } from "@/lib/formatPrice";
import { Badge } from "./ui/Badge";
import { TagList } from "./Tag";

interface MenuItemRowProps {
  item: MenuItem;
  /** When true the row dims and shows a "Sold out" pill, but stays in the list. */
  soldOut?: boolean;
}

/**
 * One menu line: "name ………… price", with description and tags beneath.
 *
 * Layout is a baseline-aligned flex row with a dotted leader (a real menu
 * convention that ties name to price), not a 2-column grid which would leave a
 * disconnected gap. Prices use tabular-nums so they form a clean optical column.
 */
export function MenuItemRow({ item, soldOut = false }: MenuItemRowProps) {
  return (
    <li
      className={[
        "flex flex-col gap-1 py-4 print-break-avoid",
        soldOut ? "opacity-55" : "",
      ].join(" ")}
      aria-disabled={soldOut || undefined}
    >
      <div className="flex items-baseline gap-2.5">
        <h3 className="font-display text-lg font-medium leading-snug text-ink">
          {item.name}
        </h3>

        {soldOut ? <Badge tone="dark">Sold out</Badge> : null}

        {/* Dotted leader fills the gap on larger screens; hidden when cramped. */}
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
    </li>
  );
}
