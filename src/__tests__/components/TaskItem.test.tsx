import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskItem } from "@/components/TaskItem";
import { UI } from "@/lib/i18n";
import type { Task } from "@/lib/schemas";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "00000000-0000-0000-0000-000000000001",
  text: "Default task text",
  done: false,
  createdAt: 1_700_000_000_000,
  ...overrides,
});

const renderTaskItem = (task: Task, onToggle = vi.fn(), onDelete = vi.fn()) => {
  render(<TaskItem task={task} onToggle={onToggle} onDelete={onDelete} />);
  return { onToggle, onDelete };
};

describe("TaskItem", () => {
  describe("rendering", () => {
    it("renders the task text", () => {
      renderTaskItem(makeTask({ text: "Write unit tests" }));

      expect(screen.getByText("Write unit tests")).toBeInTheDocument();
    });

    it("renders the toggle checkbox", () => {
      renderTaskItem(makeTask());

      expect(
        screen.getByRole("checkbox", { name: UI.item.toggleLabel })
      ).toBeInTheDocument();
    });

    it("renders the delete button", () => {
      renderTaskItem(makeTask());

      expect(
        screen.getByRole("button", { name: UI.item.deleteButton })
      ).toBeInTheDocument();
    });

    it("renders the checkbox unchecked when the task is not done", () => {
      renderTaskItem(makeTask({ done: false }));

      expect(
        screen.getByRole("checkbox", { name: UI.item.toggleLabel })
      ).not.toBeChecked();
    });

    it("renders the checkbox checked when the task is done", () => {
      renderTaskItem(makeTask({ done: true }));

      expect(
        screen.getByRole("checkbox", { name: UI.item.toggleLabel })
      ).toBeChecked();
    });
  });

  describe("done state styling", () => {
    it("applies the line-through class when the task is done", () => {
      renderTaskItem(makeTask({ text: "Done task", done: true }));

      const textNode = screen.getByText("Done task");

      expect(textNode).toHaveClass("line-through");
    });

    it("does not apply the line-through class when the task is not done", () => {
      renderTaskItem(makeTask({ text: "Active task", done: false }));

      const textNode = screen.getByText("Active task");

      expect(textNode).not.toHaveClass("line-through");
    });
  });

  describe("interactions", () => {
    it("calls onToggle with the task id when the checkbox is clicked", async () => {
      const task = makeTask({ id: "test-id-toggle" });
      const { onToggle } = renderTaskItem(task);

      await userEvent.click(
        screen.getByRole("checkbox", { name: UI.item.toggleLabel })
      );

      expect(onToggle).toHaveBeenCalledOnce();
      expect(onToggle).toHaveBeenCalledWith("test-id-toggle");
    });

    it("calls onDelete with the task id when the delete button is clicked", async () => {
      const task = makeTask({ id: "test-id-delete" });
      const { onDelete } = renderTaskItem(task);

      await userEvent.click(
        screen.getByRole("button", { name: UI.item.deleteButton })
      );

      expect(onDelete).toHaveBeenCalledOnce();
      expect(onDelete).toHaveBeenCalledWith("test-id-delete");
    });

    it("does not call onDelete when the checkbox is clicked", async () => {
      const task = makeTask();
      const { onDelete } = renderTaskItem(task);

      await userEvent.click(
        screen.getByRole("checkbox", { name: UI.item.toggleLabel })
      );

      expect(onDelete).not.toHaveBeenCalled();
    });

    it("does not call onToggle when the delete button is clicked", async () => {
      const task = makeTask();
      const { onToggle } = renderTaskItem(task);

      await userEvent.click(
        screen.getByRole("button", { name: UI.item.deleteButton })
      );

      expect(onToggle).not.toHaveBeenCalled();
    });
  });
});
