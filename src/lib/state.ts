import type { DayKey } from "./types";

/**
 * The three demo states the brief asks for, switchable via `?state=`.
 *  - open               → default. Tuesday 11:30, café open, special available.
 *  - closed             → Monday, café closed.
 *  - special-sold-out   → Tuesday 11:30, open, but the special is sold out.
 */
export type PageState = "open" | "closed" | "special-sold-out";

export const DEFAULT_STATE: PageState = "open";

const VALID_STATES: readonly PageState[] = [
  "open",
  "closed",
  "special-sold-out",
];

/** Coerce an arbitrary query value into a known PageState (falls back to open). */
export function parseState(raw: string | string[] | undefined): PageState {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return VALID_STATES.includes(value as PageState)
    ? (value as PageState)
    : DEFAULT_STATE;
}

/**
 * A simulated "now" for each demo state. The brief lets us hard-code the clock
 * so reviewers see a deterministic page regardless of when they open it.
 */
export interface SimulatedNow {
  day: DayKey;
  /** Minutes since midnight, e.g. 11:30 → 690. */
  minutes: number;
  /** Human label for the simulated moment, shown in the hero. */
  label: string;
}

export function simulatedNow(state: PageState): SimulatedNow {
  if (state === "closed") {
    return { day: "monday", minutes: 11 * 60 + 30, label: "Monday 11:30" };
  }
  // open + special-sold-out both use the same open moment.
  return { day: "tuesday", minutes: 11 * 60 + 30, label: "Tuesday 11:30" };
}

/** Whether the day's special should render as sold out. */
export function isSpecialSoldOut(state: PageState): boolean {
  return state === "special-sold-out";
}
