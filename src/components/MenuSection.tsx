import type { Category } from "@/types/menu";
import { SectionHeading } from "./ui/SectionHeading";
import { MenuItemRow } from "./MenuItemRow";

interface MenuSectionProps {
  category: Category;
  /** Id of the one item to render sold out, if any. */
  soldOutItemId: string | null;
}

/**
 * Renders a Category as a labelled section.
 *
 * `id` is the scroll anchor the sticky nav targets; `aria-labelledby` names the
 * region from the visible heading. The sticky-nav scroll offset is handled once,
 * globally, via `scroll-padding-top` on <html> — we deliberately don't add
 * `scroll-mt` here, since the two would stack into a double offset.
 */
export function MenuSection({ category, soldOutItemId }: MenuSectionProps) {
  const headingId = `${category.id}-heading`;

  return (
    <section id={category.id} aria-labelledby={headingId}>
      <SectionHeading
        id={headingId}
        title={category.name}
        description={category.description || undefined}
      />

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
