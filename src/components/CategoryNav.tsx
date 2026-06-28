"use client";

import { useCallback, useMemo } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

interface NavLink {
  id: string;
  name: string;
}

interface CategoryNavProps {
  links: NavLink[];
}

/**
 * Sticky section navigation: highlights the section in view and smooth-scrolls
 * (and moves focus) on click. The app's only client component — it needs scroll
 * position, IntersectionObserver, and focus control. Hidden from print.
 */
export function CategoryNav({ links }: CategoryNavProps) {
  // Memoised so the hook's effect doesn't re-run on every highlight re-render.
  const ids = useMemo(() => links.map((link) => link.id), [links]);
  const activeId = useActiveSection(ids);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const target = document.getElementById(id);
      if (!target) return; // let the default hash jump handle it
      event.preventDefault();

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });

      // Keep the URL hash in sync without a second jump.
      history.replaceState(null, "", `#${id}`);

      // Move focus into the section so keyboard/SR users land there too.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [],
  );

  return (
    <nav
      aria-label="Menu sections"
      className="print-hidden sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
        {links.map((link) => {
          const isActive = link.id === activeId;
          return (
            <li key={link.id} className="shrink-0">
              <a
                href={`#${link.id}`}
                onClick={(event) => handleClick(event, link.id)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "inline-block whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand text-cream"
                    : "text-ink-soft hover:bg-brand-tint hover:text-brand",
                ].join(" ")}
              >
                {link.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
