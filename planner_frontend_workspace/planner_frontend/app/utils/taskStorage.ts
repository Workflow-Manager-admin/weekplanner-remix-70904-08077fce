import { DayKey, NAV_DAYS } from "./days";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const LS_KEY = "weekplanner-tasks";

// PUBLIC_INTERFACE
export function getTasksForDay(day: DayKey): Task[] {
  const weekRaw = localStorage.getItem(LS_KEY);
  if (!weekRaw) return [];
  try {
    const week = JSON.parse(weekRaw) as Record<DayKey, Task[]>;
    return week[day] || [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveTasksForDay(day: DayKey, tasks: Task[]) {
  const weekRaw = localStorage.getItem(LS_KEY);
  let week: Record<DayKey, Task[]> = {} as Record<DayKey, Task[]>;
  if (weekRaw) {
    try {
      week = JSON.parse(weekRaw);
    } catch {
      /* ignore parse errors, use empty week */
    }
  }
  week[day] = tasks;
  localStorage.setItem(LS_KEY, JSON.stringify(week));
}

// PUBLIC_INTERFACE
export function getWeekTasks(): Record<DayKey, Task[]> {
  const weekRaw = localStorage.getItem(LS_KEY);
  let week: Record<DayKey, Task[]> = {} as Record<DayKey, Task[]>;
  if (weekRaw) {
    try {
      week = JSON.parse(weekRaw);
    } catch {
      /* ignore parse errors, use empty week */
    }
  }
  // Ensure all days are present
  NAV_DAYS.forEach((d) => {
    if (!week[d]) week[d] = [];
  });
  return week;
}

// PUBLIC_INTERFACE
export function resetWeek() {
  localStorage.removeItem(LS_KEY);
}
