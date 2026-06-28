import type { DayKey, Hours } from "@/types/menu";
import { DAY_ORDER, dayLabel, parseHours } from "@/lib/getRestaurantStatus";
import { SectionHeading } from "./ui/SectionHeading";
import { Badge } from "./ui/Badge";

interface HoursBlockProps {
  hours: Hours;
  /** The simulated "today", emphasised in the list. */
  today: DayKey;
}

/**
 * Weekly opening hours as a description list (day = term, hours = definition).
 * Today's row is emphasised with the brand tint and aria-current="date"; closed
 * days are muted *and* labelled "Closed", so the distinction never relies on
 * colour alone.
 */
export function HoursBlock({ hours, today }: HoursBlockProps) {
  return (
    <section id="hours" aria-labelledby="hours-heading">
      <SectionHeading id="hours-heading" title="Opening Hours" />

      <dl className="mt-1">
        {DAY_ORDER.map((day) => {
          const value = hours[day];
          const isClosed = parseHours(value) === null;
          const isToday = day === today;

          return (
            <div
              key={day}
              aria-current={isToday ? "date" : undefined}
              className={[
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm",
                isToday ? "bg-brand-tint" : "",
              ].join(" ")}
            >
              <dt
                className={[
                  "flex items-center gap-2 font-medium",
                  isToday ? "text-brand" : "text-ink",
                ].join(" ")}
              >
                {dayLabel(day)}
                {isToday ? <Badge tone="amber">Today</Badge> : null}
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
