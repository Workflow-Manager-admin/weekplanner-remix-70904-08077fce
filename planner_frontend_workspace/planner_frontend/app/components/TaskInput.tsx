import { useRef } from "react";

// PUBLIC_INTERFACE
export default function TaskInput({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ref.current) return;
    const text = ref.current.value.trim();
    if (text) {
      onSubmit(text);
      ref.current.value = "";
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-900"
        placeholder="Add new task..."
        required
        maxLength={100}
        ref={ref}
        aria-label="Add task"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded font-medium hover:bg-primary/90"
      >
        Add
      </button>
    </form>
  );
}
