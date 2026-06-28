"use client";

import { useEffect, useState } from "react";

/**
 * Track which section is in view as the user scrolls, returning its id — the
 * data the sticky nav needs to highlight the current category.
 *
 * Uses IntersectionObserver (the browser notifies us off the main thread) rather
 * than a scroll listener (which fires constantly and forces layout). The
 * rootMargin shrinks the observed area to a band ~20%–45% down the viewport, so a
 * section becomes "active" once it reaches the upper-middle of the screen, which
 * reads correctly beneath the sticky bar.
 *
 * Known limitation: a very short final section may never fill the band; a fully
 * robust version would also treat "scrolled to page bottom" as activating the
 * last id. Left out deliberately as scope.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds[0] ?? null,
  );

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }

        // Most-visible section wins; ties resolve to document order.
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = visibility.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
