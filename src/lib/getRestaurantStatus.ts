import type { DayKey, Hours } from "@/types/menu";
import type { SimulatedNow } from "./state";

/** Days in the café's week order (starts Monday). Drives iteration + display. */
export const DAY_ORDER: readonly DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function dayLabel(day: DayKey): string {
  return DAY_LABELS[day];
}

/** A parsed open/close window, in minutes-since-midnight. */
interface OpenWindow {
  open: number;
  close: number;
}

/** "08:00" → 480. Returns null on anything we can't parse. */
function timeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

/**
 * Parse a row like "08:00 – 15:00" into a window. Returns null for "Closed" or
 * any unreadable value — callers treat null as "closed that day". Accepts both
 * en-dash and hyphen separators defensively (the data uses "–").
 */
export function parseHours(raw: string): OpenWindow | null {
  if (!raw || raw.toLowerCase() === "closed") return null;
  const parts = raw.split(/[–-]/).map((part) => part.trim());
  if (parts.length !== 2) return null;
  const open = timeToMinutes(parts[0] ?? "");
  const close = timeToMinutes(parts[1] ?? "");
  if (open === null || close === null) return null;
  return { open, close };
}

/** Render minutes-since-midnight back to a label, e.g. 480 → "08:00". */
function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface RestaurantStatus {
  isOpen: boolean;
  /** Set only when closed: a friendly next-opening label, or null if never. */
  nextOpening: string | null;
}

/**
 * Find the next moment the café opens, relative to `now`, and describe it —
 * "Today at 08:00" / "Tomorrow at 08:00" / "Tuesday at 08:00". Walks the week
 * with modulo so it wraps Sunday → Monday correctly.
 */
function findNextOpening(hours: Hours, now: SimulatedNow): string | null {
  const todayIndex = DAY_ORDER.indexOf(now.day);
  if (todayIndex === -1) return null;

  for (let offset = 0; offset < DAY_ORDER.length; offset += 1) {
    const day = DAY_ORDER[(todayIndex + offset) % DAY_ORDER.length];
    if (!day) continue;

    const window = parseHours(hours[day]);
    if (!window) continue;

    // Today only counts if we haven't yet reached opening time.
    if (offset === 0 && now.minutes >= window.open) continue;

    const time = minutesToLabel(window.open);
    if (offset === 0) return `Today at ${time}`;
    if (offset === 1) return `Tomorrow at ${time}`;
    return `${dayLabel(day)} at ${time}`;
  }
  return null;
}

/**
 * Decide whether the café is open at the given moment. `now` is an *argument*,
 * not `new Date()` — so the simulated demo clock and a real Europe/Lisbon clock
 * are interchangeable without touching this logic.
 */
export function getRestaurantStatus(
  hours: Hours,
  now: SimulatedNow,
): RestaurantStatus {
  const todayWindow = parseHours(hours[now.day]);
  const isOpen =
    todayWindow !== null &&
    now.minutes >= todayWindow.open &&
    now.minutes < todayWindow.close;

  return {
    isOpen,
    nextOpening: isOpen ? null : findNextOpening(hours, now),
  };
}
