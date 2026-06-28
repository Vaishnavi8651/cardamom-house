import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { TagList } from "./Tag";

interface MenuItemRowProps {
  item: MenuItem;
  /** When true the item is dimmed and shows a "Sold out" pill. */
  soldOut?: boolean;
}

export function MenuItemRow({ item, soldOut = false }: MenuItemRowProps) {
  return (
    <li
      className={[
        "group relative flex flex-col gap-1 py-4 transition-opacity print-break-avoid",
        soldOut ? "opacity-55" : "",
      ].join(" ")}
      aria-disabled={soldOut || undefined}
    >
      <div className="flex items-baseline gap-3">
        <h3 className="font-display text-lg font-medium leading-snug text-ink">
          {item.name}
        </h3>

        {soldOut && (
          <span className="inline-flex items-center rounded-full bg-ink/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream">
            Sold out
          </span>
        )}

        {/* Dotted leader fills the gap between name and price. */}
        <span
          aria-hidden="true"
          className="mb-1 hidden flex-1 border-b border-dotted border-line sm:block"
        />

        <span className="ml-auto shrink-0 font-display text-lg font-medium tabular-nums text-ink sm:ml-0">
          {formatPrice(item.price)}
        </span>
      </div>

      {item.description && (
        <p className="max-w-prose text-sm leading-relaxed text-ink-soft">
          {item.description}
        </p>
      )}

      {item.tags.length > 0 && (
        <div className="mt-1">
          <TagList tags={item.tags} />
        </div>
      )}
    </li>
  );
}
