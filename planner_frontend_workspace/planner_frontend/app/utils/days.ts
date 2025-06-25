export const NAV_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

// PUBLIC_INTERFACE
export type DayKey = (typeof NAV_DAYS)[number];

// PUBLIC_INTERFACE
export function dayNameFor(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

// PUBLIC_INTERFACE
export function todayKey(): DayKey {
  const d = new Date();
  // JS: Sun=0, Mon=1 ... We want Mon=0, so:
  // JS index: 0-6. But our array is Monday=0...Sunday=6
  let idx = d.getDay() - 1;
  if (idx < 0) idx = 6;
  return NAV_DAYS[idx];
}
