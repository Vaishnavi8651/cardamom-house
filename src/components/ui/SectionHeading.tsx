interface SectionHeadingProps {
  title: string;
  /** Optional blurb under the title; omitted cleanly when empty. */
  description?: string;
  /**
   * id for the <h2>, so the parent <section> can reference it via
   * aria-labelledby — the accessible name comes from the visible heading.
   */
  id?: string;
}

/**
 * The shared section header: a display-serif title with a thin amber rule and an
 * optional italic description. Centralised so every section — menu groups and the
 * hours block — shares the exact same type hierarchy and the brand accent line.
 */
export function SectionHeading({ title, description, id }: SectionHeadingProps) {
  return (
    <header className="mb-3 border-b border-brand/25 pb-3">
      <h2
        id={id}
        className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 text-sm italic leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
    </header>
  );
}
