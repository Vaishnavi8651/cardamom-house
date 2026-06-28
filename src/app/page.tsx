import { menu, getItemById } from "@/data/menu";
import { getOpenStatus } from "@/lib/hours";
import {
  parseState,
  simulatedNow,
  isSpecialSoldOut,
} from "@/lib/state";
import { Hero } from "@/components/Hero";
import { CategoryNav } from "@/components/CategoryNav";
import { ClosedBanner } from "@/components/ClosedBanner";
import { TodaysSpecial } from "@/components/TodaysSpecial";
import { MenuSection } from "@/components/MenuSection";
import { HoursBlock } from "@/components/HoursBlock";
import { Footer } from "@/components/Footer";

interface PageProps {
  // Next.js 15: searchParams is async.
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MenuPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const state = parseState(params.state);

  const { restaurant, today_special, categories } = menu;
  const now = simulatedNow(state);
  const status = getOpenStatus(restaurant.hours, now);
  const soldOut = isSpecialSoldOut(state);

  const specialItem = getItemById(today_special.item_id);
  const soldOutItemId = soldOut ? today_special.item_id : null;

  const navLinks = [
    ...categories.map((c) => ({ id: c.id, name: c.name })),
    { id: "hours", name: "Hours" },
  ];

  return (
    <>
      {/* Skip link for keyboard users. */}
      <a
        href="#menu"
        className="print-hidden sr-only z-50 rounded-md bg-brand px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to menu
      </a>

      <Hero restaurant={restaurant} status={status} nowLabel={now.label} />

      <CategoryNav links={navLinks} />

      {!status.isOpen && <ClosedBanner nextOpening={status.nextOpening} />}

      <TodaysSpecial
        special={today_special}
        item={specialItem}
        soldOut={soldOut}
      />

      <main id="menu" className="mx-auto max-w-3xl px-5 pt-12">
        <div className="space-y-14">
          {categories.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              soldOutItemId={soldOutItemId}
            />
          ))}

          <HoursBlock hours={restaurant.hours} today={now.day} />
        </div>
      </main>

      <Footer restaurant={restaurant} />
    </>
  );
}
