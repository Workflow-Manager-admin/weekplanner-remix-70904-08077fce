import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  getTasksForDay,
  saveTasksForDay,
  Task,
} from "~/utils/taskStorage";
import { dayNameFor, NAV_DAYS, DayKey, todayKey } from "~/utils/days";
import TaskInput from "~/components/TaskInput";
import TaskList from "~/components/TaskList";

// PUBLIC_INTERFACE
export default function PlannerDayRoute() {
  const params = useParams();
  let day = NAV_DAYS.find((d) => d === params.day) as DayKey | undefined;
  if (!day) {
    // If "today" isn't found, fallback to "monday"
    day = todayKey();
  }
  const [tasks, setTasks] = useState<Task[]>(() => getTasksForDay(day!));
  // Remove unused state '_'

  // Update state if day changes route
  useEffect(() => {
    setTasks(getTasksForDay(day!));
  }, [day]);

  // When tasks update, save to localStorage
  useEffect(() => {
    saveTasksForDay(day!, tasks);
  }, [tasks, day]);

  const handleAdd = (text: string) => {
    setTasks((current) => [
      ...current,
      {
        id: `${Date.now()}${Math.random()}`,
        text,
        completed: false,
      },
    ]);
  };
  const handleToggle = (id: string) => {
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };
  const handleEdit = (id: string, newText: string) => {
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };
  const handleDelete = (id: string) => {
    setTasks((current) => current.filter((t) => t.id !== id));
  };
  const handleReorder = (orderedIds: string[]) => {
    setTasks((current) =>
      orderedIds
        .map((id) => current.find((t) => t.id === id))
        .filter((t): t is Task => !!t)
    );
  };

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
        <TaskInput onSubmit={handleAdd} />
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
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
