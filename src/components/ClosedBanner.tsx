import { Container } from "./ui/Container";

interface ClosedBannerProps {
  /** e.g. "Tomorrow at 08:00". */
  nextOpening: string | null;
}

/**
 * Shown under the nav when the café is closed. Deliberately an inline banner,
 * not a blocking modal: a customer standing outside still wants to read the menu
 * for next time, so we inform without obstructing. Hidden from print.
 */
export function ClosedBanner({ nextOpening }: ClosedBannerProps) {
  return (
    <Container className="print-hidden pt-6">
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
        {nextOpening ? (
          <p className="shrink-0 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink">
            Opens <span className="text-brand">{nextOpening}</span>
          </p>
        ) : null}
      </div>
    </Container>
  );
}
