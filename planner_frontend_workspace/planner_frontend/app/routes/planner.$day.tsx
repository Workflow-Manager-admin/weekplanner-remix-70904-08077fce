import { useParams } from "@remix-run/react";
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
  let day = NAV_DAYS.find((d) => d === params.day) as DayKey | undefined;
  if (!day) {
    // If "today" isn't found, fallback to "monday"
    day = todayKey();
  }

  // All task state and mutation handled client-side only
  const {
    tasks,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    reorderTasks,
  } = useDayTasks(day!);

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;

  return (
    <section
      aria-labelledby="day-title"
      className="flex flex-col gap-8"
    >
      <header>
        <h2
          id="day-title"
          className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1"
        >
          {dayNameFor(day!)}&apos;s Tasks
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Organize your {dayNameFor(day!)}. Add, complete, edit, or delete tasks.
        </p>
      </header>
      <div className="w-full max-w-xl flex flex-col gap-6">
        <TaskInput onSubmit={addTask} />
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={deleteTask}
          onReorder={reorderTasks}
        />
      </div>
      <footer className="mt-auto">
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {completed} / {total} complete
        </span>
      </footer>
    </section>
  );
}
