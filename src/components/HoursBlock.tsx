import type { DayKey, Hours } from "@/lib/types";
import { DAY_ORDER, dayLabel, parseHours } from "@/lib/hours";

interface HoursBlockProps {
  hours: Hours;
  /** The simulated "today", emphasised in the list. */
  today: DayKey;
}

export function HoursBlock({ hours, today }: HoursBlockProps) {
  return (
    <section
      aria-labelledby="hours-heading"
      className="scroll-mt-24 print-break-avoid"
      id="hours"
    >
      <header className="mb-2 border-b-2 border-brand/20 pb-3">
        <h2
          id="hours-heading"
          className="font-display text-2xl font-semibold text-ink sm:text-3xl"
        >
          Opening Hours
        </h2>
      </header>

      <dl className="mt-2">
        {DAY_ORDER.map((day) => {
          const value = hours[day];
          const isClosed = parseHours(value) === null;
          const isToday = day === today;

          return (
            <div
              key={day}
              className={[
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm",
                isToday ? "bg-brand-tint" : "",
              ].join(" ")}
              aria-current={isToday ? "date" : undefined}
            >
              <dt
                className={[
                  "flex items-center gap-2 font-medium",
                  isToday ? "text-brand" : "text-ink",
                ].join(" ")}
              >
                {dayLabel(day)}
                {isToday && (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream">
                    Today
                  </span>
                )}
              </dt>
              <dd
                className={[
                  "tabular-nums",
                  isClosed
                    ? "text-ink-soft/60"
                    : isToday
                      ? "font-medium text-brand"
                      : "text-ink-soft",
                ].join(" ")}
              >
                {value}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
