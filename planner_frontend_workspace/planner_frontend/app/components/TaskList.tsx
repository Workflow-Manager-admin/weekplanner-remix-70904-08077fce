import { useState } from "react";
import { Task } from "~/utils/taskStorage";

// PUBLIC_INTERFACE
export type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (ids: string[]) => void;
};

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
}: TaskListProps) {
  // Local drag state if reordering implemented in the future
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  function handleDragStart(idx: number) {
    setDraggedIdx(idx);
  }
  function handleDrop(idx: number) {
    if (
      draggedIdx !== null &&
      draggedIdx !== idx &&
      typeof onReorder === "function"
    ) {
      const newOrder = [...tasks];
      const [moved] = newOrder.splice(draggedIdx, 1);
      newOrder.splice(idx, 0, moved);
      onReorder(newOrder.map((task) => task.id));
    }
    setDraggedIdx(null);
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task, idx) => (
        <li
          key={task.id}
          className="flex items-center group bg-white dark:bg-gray-900 rounded-lg transition-colors border border-gray-100 dark:border-gray-800 px-3 py-2 gap-2"
          draggable={!!onReorder}
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => {
            if (onReorder) e.preventDefault();
          }}
          onDrop={() => handleDrop(idx)}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="w-4 h-4 accent-primary rounded"
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          />
          <span
            className={`flex-1 min-w-0 text-sm break-words ${
              task.completed ? "line-through text-secondary" : ""
            }`}
          >
            {task.text}
          </span>
          <button
            className="text-accent px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              const newText = prompt("Edit task:", task.text);
              if (typeof newText === "string" && newText.trim()) {
                onEdit(task.id, newText.trim());
              }
            }}
            aria-label="Edit task"
          >
            ✎
          </button>
          <button
            className="text-red-400 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() =>
              window.confirm("Delete this task?") && onDelete(task.id)
            }
            aria-label="Delete task"
          >
            🗑
          </button>
        </li>
      ))}
    </ul>
  );
}
