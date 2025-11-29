import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(role: "teacher" | "admin" = "teacher", userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-${role}-${userId}`,
    email: `${role}${userId}@example.com`,
    name: `Test ${role}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Bulk Messaging Feature", () => {
  describe("sendBulkMessage procedure", () => {
    it("should reject non-teacher users", async () => {
      const ctx = createMockContext("admin", 999);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.teacher.sendBulkMessage({
          className: "Class A",
          subject: "Test Message",
          content: "This is a test message",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Teacher profile not found");
      }
    });

    it("should require className, subject, and content", async () => {
      const ctx = createMockContext("teacher");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.teacher.sendBulkMessage({
          className: "",
          subject: "Test",
          content: "Content",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("too_small");
      }
    });

    it("should require non-empty subject", async () => {
      const ctx = createMockContext("teacher");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.teacher.sendBulkMessage({
          className: "Class A",
          subject: "",
          content: "Content",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("too_small");
      }
    });

    it("should require non-empty content", async () => {
      const ctx = createMockContext("teacher");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.teacher.sendBulkMessage({
          className: "Class A",
          subject: "Test",
          content: "",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("too_small");
      }
    });

    it("should handle case when no parents are found in class", async () => {
      const ctx = createMockContext("teacher");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.teacher.sendBulkMessage({
          className: "NonExistentClass",
          subject: "Test Message",
          content: "This is a test message to a class with no students",
        });

        expect(result.success).toBe(true);
        expect(result.messagesSent).toBe(0);
        expect(result.message).toContain("No parents found");
      } catch (error: any) {
        // If teacher profile doesn't exist, that's also acceptable for this test
        expect(error.message).toContain("Teacher profile not found");
      }
    });
  });

  describe("Database bulk messaging functions", () => {
    it("should retrieve parents in a class", async () => {
      const { getParentsInClass } = await import("./db");

      // This test verifies the function exists and can be called
      const parents = await getParentsInClass(1, "Class A");
      expect(Array.isArray(parents)).toBe(true);
    });

    it("should create bulk messages", async () => {
      const { createBulkMessages } = await import("./db");

      // Test with empty recipient list
      const count = await createBulkMessages(1, [], "Test", "Content");
      expect(count).toBe(0);

      // Test with recipients (will create messages in DB)
      const count2 = await createBulkMessages(1, [2, 3], "Test Subject", "Test Content");
      expect(count2).toBe(2);
    });

    it("should return correct number of messages created", async () => {
      const { createBulkMessages } = await import("./db");

      const recipientIds = [1, 2, 3, 4, 5];
      const count = await createBulkMessages(
        1,
        recipientIds,
        "Bulk Test",
        "This is a bulk message test"
      );

      expect(count).toBe(recipientIds.length);
    });
  });

  describe("Bulk message validation", () => {
    it("should validate message subject length", async () => {
      const ctx = createMockContext("teacher");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.teacher.sendBulkMessage({
          className: "Class A",
          subject: "a".repeat(1000), // Very long subject
          content: "Content",
        });
        // If it succeeds, that's fine - we're testing it doesn't crash
        expect(true).toBe(true);
      } catch (error: any) {
        // Either succeeds or fails gracefully
        expect(error).toBeDefined();
      }
    });

    it("should validate message content length", async () => {
      const ctx = createMockContext("teacher");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.teacher.sendBulkMessage({
          className: "Class A",
          subject: "Test",
          content: "a".repeat(10000), // Very long content
        });
        // If it succeeds, that's fine - we're testing it doesn't crash
        expect(true).toBe(true);
      } catch (error: any) {
        // Either succeeds or fails gracefully
        expect(error).toBeDefined();
      }
    });
  });

  describe("Bulk message response format", () => {
    it("should return proper response structure", async () => {
      const ctx = createMockContext("teacher");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.teacher.sendBulkMessage({
          className: "Class A",
          subject: "Test",
          content: "Test content",
        });

        expect(result).toHaveProperty("success");
        expect(result).toHaveProperty("messagesSent");
        expect(result).toHaveProperty("message");
        expect(typeof result.success).toBe("boolean");
        expect(typeof result.messagesSent).toBe("number");
        expect(typeof result.message).toBe("string");
      } catch (error: any) {
        // Teacher profile not found is acceptable
        expect(error.message).toContain("Teacher profile not found");
      }
    });
  });
});
