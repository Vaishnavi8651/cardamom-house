import type { DayKey, Hours } from "./types";
import type { SimulatedNow } from "./state";

/** Days in display/iteration order (the café week starts on Monday). */
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

/** A parsed open/close window in minutes-since-midnight. */
interface OpenWindow {
  open: number;
  close: number;
}

/** "08:00" → 480. Returns null on anything unparseable. */
function timeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const mins = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(mins)) return null;
  return hours * 60 + mins;
}

/**
 * Parse a row like "08:00 – 15:00" into an OpenWindow.
 * Returns null for "Closed" or anything we can't read (treated as closed).
 * Handles both en-dash and hyphen separators defensively.
 */
export function parseHours(raw: string): OpenWindow | null {
  if (!raw || raw.toLowerCase() === "closed") return null;
  const parts = raw.split(/[–-]/).map((p) => p.trim());
  if (parts.length !== 2) return null;
  const open = timeToMinutes(parts[0] ?? "");
  const close = timeToMinutes(parts[1] ?? "");
  if (open === null || close === null) return null;
  return { open, close };
}

export interface OpenStatus {
  isOpen: boolean;
  /** Set when closed: a friendly description of the next opening. */
  nextOpening: string | null;
}

/** Format a window's open time for display, e.g. "08:00". */
function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Find the next day (including today, later) that the café opens, relative to
 * the simulated now, and describe it — e.g. "Tomorrow at 08:00" or
 * "Tuesday at 08:00".
 */
function findNextOpening(hours: Hours, now: SimulatedNow): string | null {
  const todayIndex = DAY_ORDER.indexOf(now.day);
  if (todayIndex === -1) return null;

  for (let offset = 0; offset < DAY_ORDER.length; offset += 1) {
    const index = (todayIndex + offset) % DAY_ORDER.length;
    const day = DAY_ORDER[index];
    if (!day) continue;
    const window = parseHours(hours[day]);
    if (!window) continue;

    // Today only counts if we haven't yet passed opening time.
    if (offset === 0 && now.minutes >= window.open) continue;

    const time = minutesToLabel(window.open);
    if (offset === 0) return `Today at ${time}`;
    if (offset === 1) return `Tomorrow at ${time}`;
    return `${dayLabel(day)} at ${time}`;
  }
  return null;
}

/** Compute whether the café is currently open given a simulated moment. */
export function getOpenStatus(hours: Hours, now: SimulatedNow): OpenStatus {
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
