import { z } from "zod";
import { UI } from "@/lib/i18n";

export const taskTextSchema = z
  .string()
  .trim()
  .min(1, UI.input.errorEmpty)
  .max(200, UI.input.errorTooLong);

export const taskSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(200),
  done: z.boolean(),
  createdAt: z.number(),
});

export type Task = z.infer<typeof taskSchema>;

export const filterStatusSchema = z.enum(["all", "active", "done"]);

export type FilterStatus = z.infer<typeof filterStatusSchema>;
