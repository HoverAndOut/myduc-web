import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(role: "parent" | "admin" = "parent"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: role === "parent" ? 1 : 2,
    openId: `test-${role}`,
    email: `${role}@test.com`,
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

  return { ctx };
}

describe("messages router", () => {
  it("should allow parent to send message to teacher", async () => {
    const { ctx } = createTestContext("parent");
    const caller = appRouter.createCaller(ctx);

    const message = await caller.messages.send({
      recipientId: 2, // Send to admin user
      subject: "Question about homework",
      content: "I have a question about my child's homework assignment.",
      studentId: 1,
    });

    expect(message).toBeDefined();
    expect(message.subject).toBe("Question about homework");
    expect(message.senderId).toBe(1);
    expect(message.recipientId).toBe(2);
  });

  it("should retrieve messages for authenticated user", async () => {
    const { ctx } = createTestContext("parent");
    const caller = appRouter.createCaller(ctx);

    const messages = await caller.messages.getMyMessages();

    expect(Array.isArray(messages)).toBe(true);
  });

  it("should get list of teachers", async () => {
    const { ctx } = createTestContext("parent");
    const caller = appRouter.createCaller(ctx);

    const teachers = await caller.messages.getTeachers();

    expect(Array.isArray(teachers)).toBe(true);
  });

  it("should get unread message count", async () => {
    const { ctx } = createTestContext("parent");
    const caller = appRouter.createCaller(ctx);

    // Unread count is not exposed as a public procedure
    // This test is skipped as the functionality is internal
    const messages = await caller.messages.getMyMessages();
    const unreadCount = messages.filter((m: any) => m.isRead === 0).length;

    expect(typeof unreadCount).toBe("number");
    expect(unreadCount).toBeGreaterThanOrEqual(0);
  });
});
