import type { Category } from "@/lib/types";
import { MenuItemRow } from "./MenuItemRow";

interface MenuSectionProps {
  category: Category;
  /** Id of the item to render as sold out, if any. */
  soldOutItemId: string | null;
}

export function MenuSection({ category, soldOutItemId }: MenuSectionProps) {
  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-heading`}
      className="scroll-mt-24"
    >
      <header className="mb-2 border-b-2 border-brand/20 pb-3">
        <h2
          id={`${category.id}-heading`}
          className="font-display text-2xl font-semibold text-ink sm:text-3xl"
        >
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-1.5 text-sm italic text-ink-soft">
            {category.description}
          </p>
        )}
      </header>

      <ul className="divide-y divide-line">
        {category.items.map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            soldOut={item.id === soldOutItemId}
          />
        ))}
      </ul>
    </section>
  );
}
