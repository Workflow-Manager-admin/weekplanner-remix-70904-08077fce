import * as React from "react";
import { useParams, useNavigate } from "@remix-run/react";
import { useDayTasks } from "~/utils/taskStorage";
import { dayNameFor, NAV_DAYS, DayKey, todayKey } from "~/utils/days";
import TaskInput from "~/components/TaskInput";
import TaskList from "~/components/TaskList";

/**
 * PlannerDayRoute renders the planner day-view and ensures:
 * - Route works for /planner/:day (Remix dynamic route).
 * - Add Task bar is always at the top and highly visible.
 * Also handles day-casing, redirects invalid days to today, and mobile-responsiveness.
 */
// PUBLIC_INTERFACE
export default function PlannerDayRoute() {
  const params = useParams();
  const navigate = useNavigate();

  // Always lower-case for match
  const paramDay = (params.day || "").toLowerCase();
  let actualDay = (NAV_DAYS as string[]).find(d => d === paramDay) as DayKey | undefined;
  if (!actualDay) actualDay = todayKey();

  const {
    tasks,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    reorderTasks
  } = useDayTasks(actualDay);

  // Route-guard: redirect invalid day param
  React.useEffect(() => {
    if (params.day?.toLowerCase() !== actualDay) {
      navigate(`/planner/${actualDay}`, { replace: true });
    }
  }, [params.day, actualDay, navigate]);

  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;

  // Prevent rendering if redirect is pending
  if (params.day?.toLowerCase() !== actualDay) return null;

  // Enhanced UI: Add Task at the very top, always visible and visually distinct
  return (
    <section
      aria-labelledby="day-title"
      className="flex flex-col gap-4 md:gap-8 min-h-full"
      style={{ minHeight: '90vh' }}
    >
      <div className="w-full max-w-xl mx-auto z-20 sticky top-0 bg-white dark:bg-gray-950 pt-6 pb-6 shadow-lg rounded-b-2xl mb-3 border-b border-primary">
        <h2
          id="day-title"
          className="text-3xl font-black text-primary mb-2"
          tabIndex={-1}
        >
          {dayNameFor(actualDay)}&apos;s Tasks
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
          Manage your {dayNameFor(actualDay)} — add, complete, edit or delete tasks below.
        </p>
        {/* Add Task Input & Button: prominent placement */}
        <TaskInput onSubmit={addTask} />
      </div>
      <div className="w-full max-w-xl flex flex-col gap-6 mx-auto flex-1">
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={deleteTask}
          onReorder={reorderTasks}
        />
      </div>
      <footer className="mt-auto w-full max-w-xl mx-auto text-center">
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {completed} / {total} complete
        </span>
      </footer>
    </section>
  );
}
