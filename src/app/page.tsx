import { menu } from "@/data/menu";
import { getRestaurantStatus } from "@/lib/getRestaurantStatus";
import { parseState, simulatedNow } from "@/lib/state";
import { getTodaySpecial } from "@/lib/getTodaySpecial";
import { parseDiet, filterCategories } from "@/lib/diet";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/Hero";
import { CategoryNav } from "@/components/CategoryNav";
import { ClosedBanner } from "@/components/ClosedBanner";
import { TodaysSpecial } from "@/components/TodaysSpecial";
import { MenuSection } from "@/components/MenuSection";
import { DietFilterControl } from "@/components/DietFilterControl";
import { HoursBlock } from "@/components/HoursBlock";
import { Footer } from "@/components/Footer";

interface PageProps {
  // Next.js 15: searchParams is async.
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MenuPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const state = parseState(params.state);

  const diet = parseDiet(params.diet);

  // All decisions resolved up front by the lib layer; the JSX below just renders.
  const { restaurant, categories } = menu;
  const now = simulatedNow(state);
  const status = getRestaurantStatus(restaurant.hours, now);
  const special = getTodaySpecial(state);
  const soldOutItemId = special.isSoldOut ? special.itemId : null;

  const visibleCategories = filterCategories(categories, diet);

  const navLinks = [
    ...visibleCategories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
    { id: "hours", name: "Hours" },
  ];

  return (
    <>
      {/* Skip link: the first focusable element, visible only on focus. */}
      <a
        href="#menu"
        className="print-hidden sr-only z-50 rounded-md bg-brand px-4 py-2 text-on-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to menu
      </a>

      <Hero restaurant={restaurant} status={status} nowLabel={now.label} />

      <CategoryNav links={navLinks} />

      {!status.isOpen ? (
        <ClosedBanner nextOpening={status.nextOpening} />
      ) : null}

      <TodaysSpecial
        item={special.item}
        blurb={special.blurb}
        soldOut={special.isSoldOut}
      />

      <main id="menu">
        <Container className="space-y-14 pt-12">
          <div className="flex items-center justify-end">
            <DietFilterControl value={diet} />
          </div>

          {visibleCategories.length > 0 ? (
            visibleCategories.map((category) => (
              <MenuSection
                key={category.id}
                category={category}
                soldOutItemId={soldOutItemId}
              />
            ))
          ) : (
            <p className="rounded-2xl border border-line bg-paper px-5 py-8 text-center text-ink-soft">
              No dishes match this filter right now.
            </p>
          )}

          <HoursBlock hours={restaurant.hours} today={now.day} />
        </Container>
      </main>

      <Footer restaurant={restaurant} />
    </>
  );
}
