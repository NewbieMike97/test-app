"use client";

import { Task } from "@/lib/schemas";
import { UI } from "@/lib/i18n";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => (
  <li className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
    <input
      type="checkbox"
      checked={task.done}
      onChange={() => onToggle(task.id)}
      aria-label={UI.item.toggleLabel}
      className="h-4 w-4 cursor-pointer accent-blue-600"
    />
    <span
      className={`flex-1 text-sm ${
        task.done ? "text-gray-400 line-through" : "text-gray-800"
      }`}
    >
      {task.text}
    </span>
    <button
      type="button"
      onClick={() => onDelete(task.id)}
      className="text-xs text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
    >
      {UI.item.deleteButton}
    </button>
  </li>
);
