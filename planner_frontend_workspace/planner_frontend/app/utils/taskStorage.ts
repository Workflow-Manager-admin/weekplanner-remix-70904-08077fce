import { DayKey, NAV_DAYS } from "./days";

/** Task interface for planner app */
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const LS_KEY = "weekplanner-tasks";

/**
 * Helpers for raw data conversion
 */
function parseWeek(raw: string | null): Record<DayKey, Task[]> {
  if (!raw) return {} as Record<DayKey, Task[]>;
  try {
    const week = JSON.parse(raw) as Record<DayKey, Task[]>;
    return week;
  } catch {
    return {} as Record<DayKey, Task[]>;
  }
}

/**
 * Only call this in the browser (client-side)!
 */
function getTasksForDayBrowser(day: DayKey): Task[] {
  const weekRaw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
  const week = parseWeek(weekRaw);
  return week[day] || [];
}

/**
 * Only call this in the browser (client-side)!
 */
function saveTasksForDayBrowser(day: DayKey, tasks: Task[]): void {
  if (typeof window === "undefined") return;
  const weekRaw = localStorage.getItem(LS_KEY);
  const week = parseWeek(weekRaw);
  week[day] = tasks;
  localStorage.setItem(LS_KEY, JSON.stringify(week));
}

/**
 * Only call this in the browser (client-side)!
 */
function getWeekTasksBrowser(): Record<DayKey, Task[]> {
  const weekRaw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
  const week = parseWeek(weekRaw);
  NAV_DAYS.forEach((d) => {
    if (!week[d]) week[d] = [];
  });
  return week;
}

/**
 * Only call this in the browser (client-side)!
 */
function resetWeekBrowser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LS_KEY);
  }
}

/**
 * ===== PUBLIC HOOKS FOR CLIENT CODE =====
 */

// PUBLIC_INTERFACE
import { useState, useEffect, useCallback } from "react";

/**
 * Hook to get tasks for a day and provide mutate functions.
 */
export function useDayTasks(day: DayKey) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasksForDayBrowser(day));
  }, [day]);

  // Always update localStorage on change
  useEffect(() => {
    saveTasksForDayBrowser(day, tasks);
  }, [tasks, day]);

  // Mutators
  const addTask = useCallback(
    (text: string) => {
      setTasks((current) => [
        ...current,
        { id: `${Date.now()}${Math.random()}`, text, completed: false },
      ]);
    },
    [setTasks]
  );
  const toggleTask = useCallback(
    (id: string) => {
      setTasks((current) =>
        current.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [setTasks]
  );
  const editTask = useCallback(
    (id: string, newText: string) => {
      setTasks((current) =>
        current.map((t) => (t.id === id ? { ...t, text: newText } : t))
      );
    },
    [setTasks]
  );
  const deleteTask = useCallback(
    (id: string) => {
      setTasks((current) => current.filter((t) => t.id !== id));
    },
    [setTasks]
  );
  const reorderTasks = useCallback(
    (orderedIds: string[]) => {
      setTasks((current) =>
        orderedIds
          .map((id) => current.find((t) => t.id === id))
          .filter((t): t is Task => !!t)
      );
    },
    [setTasks]
  );

  return {
    tasks,
    setTasks,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    reorderTasks,
  };
}

/**
 * Hook to get all week tasks.
 */
// PUBLIC_INTERFACE
export function useWeekTasks() {
  const [week, setWeek] = useState<Record<DayKey, Task[]>>({} as Record<DayKey, Task[]>);

  // Provide a stable through-refresh refetch
  const refresh = useCallback(() => {
    setWeek(getWeekTasksBrowser());
  }, []);

  useEffect(() => {
    refresh();
    // Don't re-run automatically
    // eslint-disable-next-line
  }, []);

  return { week, refresh, setWeek };
}

/**
 * Hook to reset all week data. Optionally refresh provided week state after.
 */
// PUBLIC_INTERFACE
export function useResetWeek(refreshWeek?: () => void) {
  return useCallback(() => {
    resetWeekBrowser();
    if (refreshWeek) refreshWeek();
  }, [refreshWeek]);
}
