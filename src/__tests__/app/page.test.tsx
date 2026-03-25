import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { UI } from "@/lib/i18n";

// Home is a default export because Next.js pages require it. Tests import it
// directly so no named-export rule is violated in the test files themselves.

const renderHome = () => {
  render(<Home />);

  return {
    getInput: () => screen.getByRole("textbox", { name: UI.input.placeholder }),
    getAddButton: () => screen.getByRole("button", { name: UI.input.addButton }),
    getAllFilter: () => screen.getByRole("button", { name: UI.filter.all }),
    getActiveFilter: () => screen.getByRole("button", { name: UI.filter.active }),
    getDoneFilter: () => screen.getByRole("button", { name: UI.filter.done }),
  };
};

const addTask = async (text: string, helpers: ReturnType<typeof renderHome>) => {
  await userEvent.type(helpers.getInput(), text);
  await userEvent.click(helpers.getAddButton());
};

describe("Home page (integration)", () => {
  describe("adding tasks", () => {
    it("appends a new task to the list after submission", async () => {
      const helpers = renderHome();

      await addTask("Write integration tests", helpers);

      expect(screen.getByText("Write integration tests")).toBeInTheDocument();
    });

    it("appends multiple tasks and shows all of them", async () => {
      const helpers = renderHome();

      await addTask("First task", helpers);
      await addTask("Second task", helpers);

      expect(screen.getByText("First task")).toBeInTheDocument();
      expect(screen.getByText("Second task")).toBeInTheDocument();
    });

    it("clears the input field after a successful add", async () => {
      const helpers = renderHome();

      await addTask("Something", helpers);

      expect(helpers.getInput()).toHaveValue("");
    });

    it("shows the page title", () => {
      renderHome();

      expect(
        screen.getByRole("heading", { name: UI.page.title })
      ).toBeInTheDocument();
    });
  });

  describe("completing a task", () => {
    it("marks the task text with line-through after the checkbox is toggled", async () => {
      const helpers = renderHome();
      await addTask("Read a book", helpers);

      const checkbox = screen.getByRole("checkbox", { name: UI.item.toggleLabel });
      await userEvent.click(checkbox);

      expect(screen.getByText("Read a book")).toHaveClass("line-through");
    });

    it("checks the checkbox after toggling", async () => {
      const helpers = renderHome();
      await addTask("Read a book", helpers);

      const checkbox = screen.getByRole("checkbox", { name: UI.item.toggleLabel });
      await userEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it("un-checks and removes line-through when toggled a second time", async () => {
      const helpers = renderHome();
      await addTask("Read a book", helpers);

      const checkbox = screen.getByRole("checkbox", { name: UI.item.toggleLabel });
      await userEvent.click(checkbox);
      await userEvent.click(checkbox);

      expect(checkbox).not.toBeChecked();
      expect(screen.getByText("Read a book")).not.toHaveClass("line-through");
    });
  });

  describe("deleting a task", () => {
    it("removes the task from the list after the Delete button is clicked", async () => {
      const helpers = renderHome();
      await addTask("To be deleted", helpers);

      const deleteButton = screen.getByRole("button", { name: UI.item.deleteButton });
      await userEvent.click(deleteButton);

      expect(screen.queryByText("To be deleted")).not.toBeInTheDocument();
    });

    it("only removes the targeted task when multiple tasks exist", async () => {
      const helpers = renderHome();
      await addTask("Keep me", helpers);
      await addTask("Delete me", helpers);

      // "Delete me" was added last so it appears first in the list (prepended).
      // Grab the first delete button which corresponds to "Delete me".
      const deleteButtons = screen.getAllByRole("button", { name: UI.item.deleteButton });
      await userEvent.click(deleteButtons[0]);

      expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
      expect(screen.getByText("Keep me")).toBeInTheDocument();
    });

    it("shows the empty-state message after the last task is deleted", async () => {
      const helpers = renderHome();
      await addTask("Only task", helpers);

      const deleteButton = screen.getByRole("button", { name: UI.item.deleteButton });
      await userEvent.click(deleteButton);

      expect(screen.getByText(UI.list.emptyAll)).toBeInTheDocument();
    });
  });

  describe("filter buttons", () => {
    it("shows all tasks when the All filter is active", async () => {
      const helpers = renderHome();
      await addTask("Active task", helpers);
      await addTask("Done task", helpers);

      // Complete the first item in the list (most recently added = "Done task")
      const checkboxes = screen.getAllByRole("checkbox", { name: UI.item.toggleLabel });
      await userEvent.click(checkboxes[0]);

      await userEvent.click(helpers.getAllFilter());

      expect(screen.getByText("Active task")).toBeInTheDocument();
      expect(screen.getByText("Done task")).toBeInTheDocument();
    });

    it("shows only active (not done) tasks when Active filter is selected", async () => {
      const helpers = renderHome();
      await addTask("Active task", helpers);
      await addTask("Done task", helpers);

      // Complete the first item in the list (most recently added = "Done task")
      const checkboxes = screen.getAllByRole("checkbox", { name: UI.item.toggleLabel });
      await userEvent.click(checkboxes[0]);

      await userEvent.click(helpers.getActiveFilter());

      expect(screen.getByText("Active task")).toBeInTheDocument();
      expect(screen.queryByText("Done task")).not.toBeInTheDocument();
    });

    it("shows only completed tasks when Done filter is selected", async () => {
      const helpers = renderHome();
      await addTask("Active task", helpers);
      await addTask("Done task", helpers);

      // Complete the first item in the list (most recently added = "Done task")
      const checkboxes = screen.getAllByRole("checkbox", { name: UI.item.toggleLabel });
      await userEvent.click(checkboxes[0]);

      await userEvent.click(helpers.getDoneFilter());

      expect(screen.queryByText("Active task")).not.toBeInTheDocument();
      expect(screen.getByText("Done task")).toBeInTheDocument();
    });

    it("shows the emptyActive message when Active filter is selected but no active tasks exist", async () => {
      const helpers = renderHome();
      await addTask("Only task", helpers);

      const checkbox = screen.getByRole("checkbox", { name: UI.item.toggleLabel });
      await userEvent.click(checkbox);

      await userEvent.click(helpers.getActiveFilter());

      expect(screen.getByText(UI.list.emptyActive)).toBeInTheDocument();
    });

    it("shows the emptyDone message when Done filter is selected but no completed tasks exist", async () => {
      const helpers = renderHome();
      await addTask("Unfinished task", helpers);

      await userEvent.click(helpers.getDoneFilter());

      expect(screen.getByText(UI.list.emptyDone)).toBeInTheDocument();
    });

    it("marks the All button as the active filter on initial render", () => {
      renderHome();

      expect(
        screen.getByRole("button", { name: UI.filter.all })
      ).toHaveAttribute("aria-pressed", "true");
    });

    it("marks the Active button as pressed after clicking it", async () => {
      const helpers = renderHome();

      await userEvent.click(helpers.getActiveFilter());

      expect(helpers.getActiveFilter()).toHaveAttribute("aria-pressed", "true");
      expect(helpers.getAllFilter()).toHaveAttribute("aria-pressed", "false");
    });
  });
});
