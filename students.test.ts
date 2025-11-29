import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(role: "admin" | "parent" | "user" = "parent"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-parent",
    email: "parent@example.com",
    name: "Test Parent",
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

describe("students router", () => {
  it("should allow authenticated parent to query their students", async () => {
    const ctx = createMockContext("parent");
    const caller = appRouter.createCaller(ctx);

    // This should not throw an error
    const result = await caller.students.myStudents();
    
    // Result should be an array (might be empty if no students in test DB)
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow admin to query all students", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.students.myStudents();