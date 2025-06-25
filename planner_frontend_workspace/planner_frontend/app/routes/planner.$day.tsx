import * as React from "react";
import { useParams, useNavigate } from "@remix-run/react";
import { useDayTasks } from "~/utils/taskStorage";
import { dayNameFor, NAV_DAYS, DayKey, todayKey } from "~/utils/days";
import TaskInput from "~/components/TaskInput";
import TaskList from "~/components/TaskList";

// PUBLIC_INTERFACE
/**
 * PlannerDayRoute renders the task manager for a single day,
 * using client-side browser storage for persistence.
 * - Fixes dynamic routing for /planner/:day (Monday-Sunday).
 * - Add Task input is always visible and prominent at the top.
 */
export default function PlannerDayRoute() {
  // Ensure params.day is always lower-case for matching
  const params = useParams();
  const navigate = useNavigate();

  // Find the actual day by normalized param value (case-insensitive)
  let actualDay = NAV_DAYS.find(
    (d) => d === (params.day || "").toLowerCase()
  ) as DayKey | undefined;
  if (!actualDay) {
    actualDay = todayKey();
  }

  // Hooks should always run in same order
  const {
    tasks,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    reorderTasks,
  } = useDayTasks(actualDay);

  // Handle invalid :day route param immediately
  React.useEffect(() => {
    if (params.day?.toLowerCase() !== actualDay) {
      navigate(`/planner/${actualDay}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [params.day, actualDay, navigate]);

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;

  // Do not render (prevents flash of invalid UI)
  if (params.day?.toLowerCase() !== actualDay) {
    return null;
  }

  // -- UI: Add Task always at the very top, visually prominent --
  return (
    <section
      aria-labelledby="day-title"
      className="flex flex-col gap-8"
    >
      <header className="w-full max-w-xl mx-auto">
        <h2
          id="day-title"
          className="text-3xl font-bold text-primary mb-1"
          tabIndex={-1}
        >
          {dayNameFor(actualDay)}&apos;s Tasks
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Organize your {dayNameFor(actualDay)}. Add, complete, edit, or delete tasks.
        </p>
      </header>
      {/* Add Task is now top-level under section, extra spacing for prominence */}
      <div className="w-full max-w-xl mx-auto z-10 flex flex-col sticky top-0 bg-white dark:bg-gray-950 pt-4 pb-4 shadow-md rounded-b-lg mb-2">
        <TaskInput onSubmit={addTask} />
      </div>
      <div className="w-full max-w-xl flex flex-col gap-6 mx-auto">
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={deleteTask}
          onReorder={reorderTasks}
        />
      </div>
      <footer className="mt-auto w-full max-w-xl mx-auto">
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {completed} / {total} complete
        </span>
      </footer>
    </section>
  );
}
