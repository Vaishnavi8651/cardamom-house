import Image from "next/image";
import type { Category } from "@/types/menu";
import { BLUR_DATA_URL } from "@/data/images";
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
 * With a banner image: the heading overlays the photo (hover-zoom), with a dark
 * scrim so the cream text always clears contrast. Without one: a plain
 * SectionHeading. Either way the <h2> keeps its id for aria-labelledby + the nav
 * anchor. Scroll offset is handled globally via scroll-padding-top.
 */
export function MenuSection({ category, soldOutItemId }: MenuSectionProps) {
  const headingId = `${category.id}-heading`;

  return (
    <section id={category.id} aria-labelledby={headingId}>
      {category.image ? (
        <div className="group relative mb-5 aspect-[16/7] overflow-hidden rounded-2xl bg-brand-tint shadow-card sm:aspect-[16/5]">
          <Image
            src={category.image}
            alt={`${category.name} dishes`}
            fill
            sizes="(min-width: 768px) 48rem, 100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <h2
              id={headingId}
              className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl"
            >
              {category.name}
            </h2>
            {category.description ? (
              <p className="mt-1 max-w-prose text-sm italic leading-relaxed text-cream/85">
                {category.description}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <SectionHeading
          id={headingId}
          title={category.name}
          description={category.description || undefined}
        />
      )}

      <ul className="divide-y divide-line">
        {category.items.map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            soldOut={item.id === soldOutItemId}
            categoryImage={category.image}
            categoryName={category.name}
          />
        ))}
      </ul>
    </section>
  );
}
