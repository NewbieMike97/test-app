"use client";

import { useState, useMemo } from "react";
import { Task, FilterStatus } from "@/lib/schemas";
import { TaskInput } from "@/components/TaskInput";
import { TaskFilter } from "@/components/TaskFilter";
import { TaskList } from "@/components/TaskList";
import { UI } from "@/lib/i18n";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const handleAdd = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      done: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{UI.page.title}</h1>
        <TaskInput onAdd={handleAdd} />
        <TaskFilter current={filter} onChange={setFilter} />
        <TaskList
          tasks={filteredTasks}
          filter={filter}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
