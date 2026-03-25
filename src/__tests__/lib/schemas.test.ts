import { describe, it, expect } from "vitest";
import { taskTextSchema } from "@/lib/schemas";
import { UI } from "@/lib/i18n";

describe("taskTextSchema", () => {
  describe("valid input", () => {
    it("accepts a normal task string", () => {
      const result = taskTextSchema.safeParse("Buy groceries");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Buy groceries");
      }
    });

    it("accepts a string of exactly 200 characters", () => {
      const text = "a".repeat(200);

      const result = taskTextSchema.safeParse(text);

      expect(result.success).toBe(true);
    });

    it("accepts a single character string", () => {
      const result = taskTextSchema.safeParse("x");

      expect(result.success).toBe(true);
    });
  });

  describe("rejects invalid input", () => {
    it("rejects an empty string", () => {
      const result = taskTextSchema.safeParse("");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(UI.input.errorEmpty);
      }
    });

    it("rejects a whitespace-only string", () => {
      const result = taskTextSchema.safeParse("   ");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(UI.input.errorEmpty);
      }
    });

    it("rejects a string of 201 characters", () => {
      const text = "a".repeat(201);

      const result = taskTextSchema.safeParse(text);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(UI.input.errorTooLong);
      }
    });

    it("rejects a string well over 200 characters", () => {
      const text = "a".repeat(500);

      const result = taskTextSchema.safeParse(text);

      expect(result.success).toBe(false);
    });
  });

  describe("trimming behaviour", () => {
    it("trims leading and trailing whitespace before validating", () => {
      const result = taskTextSchema.safeParse("  Buy milk  ");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Buy milk");
      }
    });

    it("trims before applying the max-length check so leading spaces do not inflate the count", () => {
      // 198 real chars + 1 leading space + 1 trailing space = 200 raw chars, 198 after trim
      const text = " " + "a".repeat(198) + " ";

      const result = taskTextSchema.safeParse(text);

      expect(result.success).toBe(true);
    });
  });
});
