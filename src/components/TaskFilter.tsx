"use client";

import { FilterStatus } from "@/lib/schemas";
import { UI } from "@/lib/i18n";

type FilterOption = {
  value: FilterStatus;
  label: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: UI.filter.all },
  { value: "active", label: UI.filter.active },
  { value: "done", label: UI.filter.done },
];

type TaskFilterProps = {
  current: FilterStatus;
  onChange: (status: FilterStatus) => void;
};

export const TaskFilter = ({ current, onChange }: TaskFilterProps) => (
  <div className="flex gap-2" role="group" aria-label="Filter tasks">
    {FILTER_OPTIONS.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
          current === option.value
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        aria-pressed={current === option.value}
      >
        {option.label}
      </button>
    ))}
  </div>
);
