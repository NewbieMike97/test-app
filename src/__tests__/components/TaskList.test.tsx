import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskList } from "@/components/TaskList";
import { UI } from "@/lib/i18n";
import type { Task, FilterStatus } from "@/lib/schemas";

const makeTask = (id: string, text: string, done = false): Task => ({
  id,
  text,
  done,
  createdAt: 1_700_000_000_000,
});

const renderTaskList = (
  tasks: Task[],
  filter: FilterStatus = "all",
  onToggle = vi.fn(),
  onDelete = vi.fn()
) => {
  render(
    <TaskList tasks={tasks} filter={filter} onToggle={onToggle} onDelete={onDelete} />
  );
  return { onToggle, onDelete };
};

describe("TaskList", () => {
  describe("with tasks", () => {
    it("renders a list item for each task", () => {
      const tasks = [
        makeTask("1", "Task one"),
        makeTask("2", "Task two"),
        makeTask("3", "Task three"),
      ];

      renderTaskList(tasks);

      expect(screen.getByText("Task one")).toBeInTheDocument();
      expect(screen.getByText("Task two")).toBeInTheDocument();
      expect(screen.getByText("Task three")).toBeInTheDocument();
    });

    it("renders the correct number of list items", () => {
      const tasks = [makeTask("1", "A"), makeTask("2", "B")];

      renderTaskList(tasks);

      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("does not show an empty-state message when tasks are present", () => {
      renderTaskList([makeTask("1", "Something")]);

      expect(screen.queryByText(UI.list.emptyAll)).not.toBeInTheDocument();
      expect(screen.queryByText(UI.list.emptyActive)).not.toBeInTheDocument();
      expect(screen.queryByText(UI.list.emptyDone)).not.toBeInTheDocument();
    });
  });

  describe("empty state messages", () => {
    it("shows the emptyAll message when there are no tasks and filter is all", () => {
      renderTaskList([], "all");

      expect(screen.getByText(UI.list.emptyAll)).toBeInTheDocument();
    });

    it("shows the emptyActive message when there are no tasks and filter is active", () => {
      renderTaskList([], "active");

      expect(screen.getByText(UI.list.emptyActive)).toBeInTheDocument();
    });

    it("shows the emptyDone message when there are no tasks and filter is done", () => {
      renderTaskList([], "done");

      expect(screen.getByText(UI.list.emptyDone)).toBeInTheDocument();
    });

    it("does not render a list element when the task list is empty", () => {
      renderTaskList([], "all");

      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });
});
