"use client";

import { useCallback, useOptimistic, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DietFilter } from "@/lib/diet";

const OPTIONS: { value: DietFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "V", label: "Vegetarian" },
  { value: "GF", label: "Gluten-free" },
];

/**
 * Segmented control that sets `?diet=` while preserving other params (e.g.
 * ?state=). Built from native radios in a fieldset: that gives us correct
 * single-select semantics and arrow-key/Tab support for free, with the radio
 * visually hidden behind a styled pill. `scroll: false` keeps the reader's place.
 */
export function DietFilterControl({ value }: { value: DietFilter }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  // Reflect the choice instantly while the server re-renders in the background.
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);

  const select = useCallback(
    (next: DietFilter) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "all") params.delete("diet");
      else params.set("diet", next);
      const qs = params.toString();
      startTransition(() => {
        setOptimisticValue(next);
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [router, pathname, searchParams, setOptimisticValue],
  );

  return (
    <fieldset className="print-hidden flex items-center gap-2">
      <legend className="sr-only">Filter the menu by dietary preference</legend>
      <span
        aria-hidden="true"
        className="hidden text-sm font-medium text-ink-soft sm:inline"
      >
        Show
      </span>
      <div className="inline-flex rounded-full border border-line bg-paper p-0.5">
        {OPTIONS.map((option) => {
          const checked = option.value === optimisticValue;
          return (
            <label
              key={option.value}
              className="cursor-pointer"
              title={`Show ${option.label.toLowerCase()} items`}
            >
              <input
                type="radio"
                name="diet"
                value={option.value}
                checked={checked}
                onChange={() => select(option.value)}
                className="peer sr-only"
              />
              <span
                className={[
                  "block rounded-full px-3 py-1.5 text-sm font-medium transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                  checked
                    ? "bg-brand text-on-brand"
                    : "text-ink-soft hover:text-brand",
                ].join(" ")}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
