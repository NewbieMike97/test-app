"use client";

import { useState } from "react";
import { taskTextSchema } from "@/lib/schemas";
import { UI } from "@/lib/i18n";

type TaskInputProps = {
  onAdd: (text: string) => void;
};

export const TaskInput = ({ onAdd }: TaskInputProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const result = taskTextSchema.safeParse(value);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onAdd(result.data);
    setValue("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    handleAdd();
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={UI.input.placeholder}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label={UI.input.placeholder}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {UI.input.addButton}
        </button>
      </div>
      {error !== null && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
