interface OpenStatusBadgeProps {
  isOpen: boolean;
  /** Shown when closed, e.g. "Opens Tomorrow at 08:00". */
  nextOpening: string | null;
}

/** A small pill communicating live open/closed state. */
export function OpenStatusBadge({ isOpen, nextOpening }: OpenStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        isOpen
          ? "border-emerald-600/30 bg-emerald-50 text-emerald-800"
          : "border-line bg-paper text-ink-soft",
      ].join(" ")}
      role="status"
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
        <span>
          Closed
          {nextOpening ? ` · Opens ${nextOpening}` : ""}
        </span>
      )}
    </span>
  );
}
