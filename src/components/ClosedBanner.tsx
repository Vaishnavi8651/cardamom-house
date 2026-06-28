interface ClosedBannerProps {
  /** e.g. "Tomorrow at 08:00". */
  nextOpening: string | null;
}

/**
 * A friendly, prominent banner shown when the café is closed. Placed directly
 * under the sticky nav so it's the first thing a customer reads, but it does
 * not block the menu — people still want to browse for next time.
 */
export function ClosedBanner({ nextOpening }: ClosedBannerProps) {
  return (
    <div className="print-hidden mx-auto max-w-3xl px-5 pt-6">
      <div
        role="status"
        className="flex flex-col gap-1 rounded-2xl border border-brand/20 bg-brand-tint px-5 py-4 text-ink shadow-card sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-display text-lg font-semibold text-brand">
            We&rsquo;re closed today
          </p>
          <p className="text-sm text-ink-soft">
            Come say hi another day — the kettle&rsquo;s always on.
          </p>
        </div>
        {nextOpening && (
          <p className="shrink-0 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink">
            Opens <span className="text-brand">{nextOpening}</span>
          </p>
        )}
      </div>
    </div>
  );
}
