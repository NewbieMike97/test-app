import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskFilter } from "@/components/TaskFilter";
import { UI } from "@/lib/i18n";
import type { FilterStatus } from "@/lib/schemas";

const renderTaskFilter = (
  current: FilterStatus = "all",
  onChange = vi.fn()
) => {
  render(<TaskFilter current={current} onChange={onChange} />);
  return { onChange };
};

describe("TaskFilter", () => {
  describe("rendering", () => {
    it("renders an All button", () => {
      renderTaskFilter();

      expect(screen.getByRole("button", { name: UI.filter.all })).toBeInTheDocument();
    });

    it("renders an Active button", () => {
      renderTaskFilter();

      expect(screen.getByRole("button", { name: UI.filter.active })).toBeInTheDocument();
    });

    it("renders a Done button", () => {
      renderTaskFilter();

      expect(screen.getByRole("button", { name: UI.filter.done })).toBeInTheDocument();
    });

    it("renders exactly three filter buttons", () => {
      renderTaskFilter();

      expect(screen.getAllByRole("button")).toHaveLength(3);
    });
  });

  describe("active filter highlight — aria-pressed", () => {
    it("marks the All button as pressed when filter is all", () => {
      renderTaskFilter("all");

      expect(screen.getByRole("button", { name: UI.filter.all })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.getByRole("button", { name: UI.filter.active })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
      expect(screen.getByRole("button", { name: UI.filter.done })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });

    it("marks the Active button as pressed when filter is active", () => {
      renderTaskFilter("active");

      expect(screen.getByRole("button", { name: UI.filter.active })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.getByRole("button", { name: UI.filter.all })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
      expect(screen.getByRole("button", { name: UI.filter.done })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });

    it("marks the Done button as pressed when filter is done", () => {
      renderTaskFilter("done");

      expect(screen.getByRole("button", { name: UI.filter.done })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.getByRole("button", { name: UI.filter.all })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
      expect(screen.getByRole("button", { name: UI.filter.active })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });
  });

  describe("interactions", () => {
    it("calls onChange with all when the All button is clicked", async () => {
      const { onChange } = renderTaskFilter("active");

      await userEvent.click(screen.getByRole("button", { name: UI.filter.all }));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith("all");
    });

    it("calls onChange with active when the Active button is clicked", async () => {
      const { onChange } = renderTaskFilter("all");

      await userEvent.click(screen.getByRole("button", { name: UI.filter.active }));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith("active");
    });

    it("calls onChange with done when the Done button is clicked", async () => {
      const { onChange } = renderTaskFilter("all");

      await userEvent.click(screen.getByRole("button", { name: UI.filter.done }));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith("done");
    });

    it("still calls onChange when clicking the already-active filter", async () => {
      const { onChange } = renderTaskFilter("all");

      await userEvent.click(screen.getByRole("button", { name: UI.filter.all }));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith("all");
    });
  });
});
