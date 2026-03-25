"use client";

import { Task, FilterStatus } from "@/lib/schemas";
import { TaskItem } from "@/components/TaskItem";
import { UI } from "@/lib/i18n";

const EMPTY_MESSAGES: Record<FilterStatus, string> = {
  all: UI.list.emptyAll,
  active: UI.list.emptyActive,
  done: UI.list.emptyDone,
};

type TaskListProps = {
  tasks: Task[];
  filter: FilterStatus;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export const TaskList = ({ tasks, filter, onToggle, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 py-6">
        {EMPTY_MESSAGES[filter]}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
