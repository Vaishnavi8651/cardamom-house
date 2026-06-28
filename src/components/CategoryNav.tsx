"use client";

import { useCallback } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

interface NavLink {
  id: string;
  name: string;
}

interface CategoryNavProps {
  links: NavLink[];
}

/**
 * Sticky section navigation. Highlights the section currently in view and
 * smooth-scrolls on click. Hidden from print. Horizontally scrollable on
 * mobile so it never wraps awkwardly.
 */
export function CategoryNav({ links }: CategoryNavProps) {
  const activeId = useActiveSection(links.map((l) => l.id));

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Keep the URL hash in sync without a jump.
      history.replaceState(null, "", `#${id}`);
      // Move focus to the section for keyboard users.
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
      <ul className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2">
        {links.map((link) => {
          const isActive = link.id === activeId;
          return (
            <li key={link.id} className="shrink-0">
              <a
                href={`#${link.id}`}
                onClick={(e) => handleClick(e, link.id)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "inline-block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
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
