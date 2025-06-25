import { useParams, useNavigate } from "@remix-run/react";
import { useDayTasks } from "~/utils/taskStorage";
import { dayNameFor, NAV_DAYS, DayKey, todayKey } from "~/utils/days";
import TaskInput from "~/components/TaskInput";
import TaskList from "~/components/TaskList";

// PUBLIC_INTERFACE
/**
 * PlannerDayRoute renders the task manager for a single day,
 * using client-side browser storage for persistence.
 */
export default function PlannerDayRoute() {
  const params = useParams();
  const navigate = useNavigate();

  // Always determine the intended day first
  let actualDay = NAV_DAYS.find((d) => d === params.day) as DayKey | undefined;
  if (!actualDay) {
    actualDay = todayKey();
  }

  // Always call hooks BEFORE any conditional branch/return
  const {
    tasks,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    reorderTasks,
  } = useDayTasks(actualDay);

  // If route param is invalid, fix via navigation after render
  React.useEffect(() => {
    if (params.day !== actualDay) {
      navigate(`/planner/${actualDay}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [params.day, actualDay, navigate]);

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;

  // Render nothing if redirecting (prevents flash of wrong UI)
  if (params.day !== actualDay) {
    return null;
  }

  return (
    <section
      aria-labelledby="day-title"
      className="flex flex-col gap-8"
    >
      <header className="w-full max-w-xl mx-auto">
        <h2
          id="day-title"
          className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1"
        >
          {dayNameFor(actualDay)}&apos;s Tasks
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Organize your {dayNameFor(actualDay)}. Add, complete, edit, or delete tasks.
        </p>
        {/* Always-visible Add Task input and button */}
        <div className="py-2">
          <TaskInput onSubmit={addTask} />
        </div>
      </header>
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
