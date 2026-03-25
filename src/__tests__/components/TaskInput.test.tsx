import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskInput } from "@/components/TaskInput";
import { UI } from "@/lib/i18n";

const renderTaskInput = (onAdd = vi.fn()) => {
  render(<TaskInput onAdd={onAdd} />);
  return {
    input: screen.getByRole("textbox", { name: UI.input.placeholder }),
    addButton: screen.getByRole("button", { name: UI.input.addButton }),
    onAdd,
  };
};

describe("TaskInput", () => {
  describe("rendering", () => {
    it("renders the text input", () => {
      renderTaskInput();

      expect(screen.getByRole("textbox", { name: UI.input.placeholder })).toBeInTheDocument();
    });

    it("renders the Add button", () => {
      renderTaskInput();

      expect(screen.getByRole("button", { name: UI.input.addButton })).toBeInTheDocument();
    });

    it("does not show an error message on initial render", () => {
      renderTaskInput();

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("validation errors", () => {
    it("shows the empty-task error when submitted with an empty value", async () => {
      const { addButton } = renderTaskInput();

      await userEvent.click(addButton);

      expect(screen.getByRole("alert")).toHaveTextContent(UI.input.errorEmpty);
    });

    it("shows the empty-task error when submitted with only whitespace", async () => {
      const { input, addButton } = renderTaskInput();

      await userEvent.type(input, "   ");
      await userEvent.click(addButton);

      expect(screen.getByRole("alert")).toHaveTextContent(UI.input.errorEmpty);
    });

    it("shows the too-long error when submitted with more than 200 characters", async () => {
      const { input, addButton } = renderTaskInput();

      await userEvent.type(input, "a".repeat(201));
      await userEvent.click(addButton);

      expect(screen.getByRole("alert")).toHaveTextContent(UI.input.errorTooLong);
    });

    it("clears the error message on the next keystroke after a validation failure", async () => {
      const { input, addButton } = renderTaskInput();

      await userEvent.click(addButton);
      expect(screen.getByRole("alert")).toBeInTheDocument();

      await userEvent.type(input, "a");

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("successful submission", () => {
    it("calls onAdd with the trimmed text when the Add button is clicked", async () => {
      const onAdd = vi.fn();
      const { input, addButton } = renderTaskInput(onAdd);

      await userEvent.type(input, "  Buy milk  ");
      await userEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledOnce();
      expect(onAdd).toHaveBeenCalledWith("Buy milk");
    });

    it("clears the input field after a successful submission", async () => {
      const { input, addButton } = renderTaskInput();

      await userEvent.type(input, "Buy milk");
      await userEvent.click(addButton);

      expect(input).toHaveValue("");
    });

    it("does not call onAdd when the value is empty", async () => {
      const onAdd = vi.fn();
      const { addButton } = renderTaskInput(onAdd);

      await userEvent.click(addButton);

      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe("Enter key submission", () => {
    it("submits the form when Enter is pressed in the input", async () => {
      const onAdd = vi.fn();
      const { input } = renderTaskInput(onAdd);

      await userEvent.type(input, "Walk the dog");
      await userEvent.keyboard("{Enter}");

      expect(onAdd).toHaveBeenCalledOnce();
      expect(onAdd).toHaveBeenCalledWith("Walk the dog");
    });

    it("shows a validation error when Enter is pressed with an empty input", async () => {
      const { input } = renderTaskInput();

      fireEvent.keyDown(input, { key: "Enter" });

      expect(screen.getByRole("alert")).toHaveTextContent(UI.input.errorEmpty);
    });

    it("does not submit when a non-Enter key is pressed", async () => {
      const onAdd = vi.fn();
      const { input } = renderTaskInput(onAdd);

      await userEvent.type(input, "Walk the dog");
      await userEvent.keyboard("{Tab}");

      expect(onAdd).not.toHaveBeenCalled();
    });
  });
});
