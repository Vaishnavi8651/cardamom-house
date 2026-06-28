interface OpenStatusBadgeProps {
  isOpen: boolean;
  /** Shown when closed, e.g. "Tomorrow at 08:00". */
  nextOpening: string | null;
}

/**
 * Live open/closed pill. The "open" dot is emerald, not brand amber: open/closed
 * is semantic status that must read instantly (green = go), and reserving amber
 * for brand accents keeps both signals clear. `role="status"` so assistive tech
 * announces it.
 */
export function OpenStatusBadge({ isOpen, nextOpening }: OpenStatusBadgeProps) {
  return (
    <span
      role="status"
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        isOpen
          ? "border-emerald-600/30 bg-emerald-50 text-emerald-800"
          : "border-line bg-paper text-ink-soft",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "h-2 w-2 rounded-full",
          isOpen ? "bg-emerald-600" : "bg-ink-soft/60",
        ].join(" ")}
      />
      {isOpen ? (
        <span>Open now</span>
      ) : (
        <span>Closed{nextOpening ? ` · Opens ${nextOpening}` : ""}</span>
      )}
    </span>
  );
}
