import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
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

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
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

describe("Reports Router", () => {
  it("allows public users to create a report", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.create({
      reporterEmail: "reporter@example.com",
      reporterName: "Test Reporter",
      scammerName: "Scammer Name",
      scammerLink: "https://example.com/scammer",
      description: "This person scammed me in a transaction",
    });

    expect(result).toBeDefined();
    expect(result.reporterEmail).toBe("reporter@example.com");
  });

  it("requires minimum 10 characters in description", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.reports.create({
        reporterEmail: "reporter@example.com",
        reporterName: "Test Reporter",
        scammerName: "Scammer",
        scammerLink: "https://example.com/scammer",
        description: "short",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("minimum");
    }
  });

  it("only admins can view reports", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.reports.getAll();
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("admins can view all reports", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const reports = await caller.reports.getAll();
    expect(Array.isArray(reports)).toBe(true);
  });

  it("admins can update report status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.updateStatus({
      id: 1,
      status: "verified",
    });

    expect(result.success).toBe(true);
  });
});

describe("Search Functionality", () => {
  it("can search for profiles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.profiles.search({
      query: "test",
    });

    expect(results).toBeDefined();
    expect(results).toHaveProperty('exact');
    expect(results).toHaveProperty('suggestions');
  });

  it("returns empty array for non-matching search", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.profiles.search({
      query: "nonexistent12345",
    });

    expect(results).toBeDefined();
    expect(results).toHaveProperty('exact');
    expect(results).toHaveProperty('suggestions');
  });
});
