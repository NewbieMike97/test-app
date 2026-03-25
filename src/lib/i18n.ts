export const UI = {
  page: {
    title: "Task Manager",
  },
  input: {
    placeholder: "Add a new task…",
    addButton: "Add",
    errorEmpty: "Task cannot be empty.",
    errorTooLong: "Task must be 200 characters or fewer.",
  },
  filter: {
    all: "All",
    active: "Active",
    done: "Done",
  },
  list: {
    emptyAll: "No tasks yet. Add one above.",
    emptyActive: "No active tasks.",
    emptyDone: "No completed tasks.",
  },
  item: {
    deleteButton: "Delete",
    toggleLabel: "Toggle task completion",
  },
} as const;
