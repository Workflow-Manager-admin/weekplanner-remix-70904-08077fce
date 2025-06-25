import { useSearchParams, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getWeekTasks, resetWeek, Task } from "~/utils/taskStorage";
import { NAV_DAYS, dayNameFor, DayKey } from "~/utils/days";

// PUBLIC_INTERFACE
export default function WeeklyOverview() {
  const [week, setWeek] = useState<Record<DayKey, Task[]>>(() => getWeekTasks());
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  function refreshData() {
    setWeek(getWeekTasks());
  }

  useEffect(() => {
    refreshData();
    // Handle reset week
    if (searchParams.get("reset") === "1") {
      // eslint-disable-next-line no-alert
      if (window.confirm("Reset all tasks for this week?")) {
        resetWeek();
        refreshData();
      }
      // Remove ?reset=1 from URL
      searchParams.delete("reset");
      navigate("/planner", { replace: true });
    }
    // eslint-disable-next-line
  }, [searchParams]);

  // Compute summary
  let completedCount = 0;
  let pendingCount = 0;
  let total = 0;
  NAV_DAYS.forEach((day) => {
    week[day].forEach((task) => {
      total += 1;
      if (task.completed) completedCount += 1;
      else pendingCount += 1;
    });
  });

  return (
    <section aria-labelledby="overview-title" className="h-full flex flex-col gap-8">
      <header>
        <h2 id="overview-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Weekly Overview
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          See your tasks for the week. Click a day to view or edit tasks.
        </p>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 flex-1">
        {NAV_DAYS.map((day) => (
          <a
            key={day}
            href={`/planner/${day}`}
            className="group flex flex-col mb-auto p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:bg-primary/5 transition"
            tabIndex={0}
            aria-label={`Go to ${dayNameFor(day)}`}
          >
            <h3 className="font-semibold text-primary mb-2">{dayNameFor(day)}</h3>
            <div className="flex-1 min-h-6">
              <ul className="text-xs text-gray-700 dark:text-gray-200 flex flex-col gap-1">
                {week[day].length > 0 ? (
                  week[day].slice(0, 3).map((task) => (
                    <li
                      key={task.id}
                      className={`${task.completed ? "line-through text-secondary" : ""} truncate`}
                    >
                      {task.text}
                    </li>
                  ))
                ) : (
                  <li className="italic text-gray-400">No tasks</li>
                )}
                {week[day].length > 3 && (
                  <li className="text-gray-400">+{week[day].length - 3} more…</li>
                )}
              </ul>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {week[day].filter((t) => t.completed).length} / {week[day].length} complete
            </div>
          </a>
        ))}
      </div>
      <footer className="flex flex-col gap-2">
        <div className="text-sm text-gray-700 dark:text-gray-200">
          {total > 0 ? (
            <>
              <span className="font-medium">{completedCount}</span> completed,{" "}
              <span className="font-medium">{pendingCount}</span> pending, of{" "}
              <span className="font-medium">{total}</span> tasks.
            </>
          ) : (
            <>No tasks created yet.</>
          )}
        </div>
      </footer>
    </section>
  );
}
