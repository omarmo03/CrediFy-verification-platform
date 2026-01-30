import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context for testing
function createMockContext(role: "admin" | "user" = "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Profiles Router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let createdProfileId: number;

  beforeAll(() => {
    caller = appRouter.createCaller(createMockContext("admin"));
  });

  it("should create a new trusted profile", async () => {
    const result = await caller.profiles.create({
      name: "Ahmed Test",
      profileLink: "https://example.com/ahmed",
      status: "trusted",
      proofCount: 150,
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Ahmed Test");
    expect(result.status).toBe("trusted");
    expect(result.proofCount).toBe(150);
    createdProfileId = result.id;
  });

  it("should create a scammer profile", async () => {
    const result = await caller.profiles.create({
      name: "Scammer Test",
      profileLink: "https://example.com/scammer",
      status: "scammer",
      proofCount: 0,
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Scammer Test");
    expect(result.status).toBe("scammer");
  });

  it("should retrieve all profiles", async () => {
    const results = await caller.profiles.getAll();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it("should search profiles by name", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const results = await publicCaller.profiles.search({
      query: "Ahmed",
    });

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.name.includes("Ahmed"))).toBe(true);
  });

  it("should search profiles by profile link", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const results = await publicCaller.profiles.search({
      query: "example.com",
    });

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it("should get profile by id", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const result = await publicCaller.profiles.getById({
      id: createdProfileId,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Ahmed Test");
    expect(result?.status).toBe("trusted");
  });

  it("should update a profile", async () => {
    const result = await caller.profiles.update({
      id: createdProfileId,
      proofCount: 200,
      status: "trusted",
    });

    expect(result).toBeDefined();
    expect(result?.proofCount).toBe(200);
  });

  it("should prevent non-admin from creating profiles", async () => {
    const userCaller = appRouter.createCaller(createMockContext("user"));

    try {
      await userCaller.profiles.create({
        name: "Unauthorized",
        profileLink: "https://example.com/unauthorized",
        status: "trusted",
        proofCount: 0,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow public search without authentication", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const results = await publicCaller.profiles.search({
      query: "Ahmed",
    });

    expect(Array.isArray(results)).toBe(true);
  });

  it("should delete a profile", async () => {
    const result = await caller.profiles.delete({
      id: createdProfileId,
    });

    expect(result.success).toBe(true);

    // Verify deletion
    const publicCaller = appRouter.createCaller(createPublicContext());
    const deleted = await publicCaller.profiles.getById({
      id: createdProfileId,
    });

    expect(deleted).toBeUndefined();
  });
});

describe("Join Requests Router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    caller = appRouter.createCaller(createMockContext("admin"));
  });

  it("should create a join request", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const result = await publicCaller.joinRequests.create({
      email: "newuser@example.com",
      name: "New User",
      profileLink: "https://example.com/newuser",
      message: "I want to join as a trusted user",
    });

    expect(result).toBeDefined();
    expect(result.email).toBe("newuser@example.com");
    expect(result.status).toBe("pending");
  });

  it("should allow admin to view all join requests", async () => {
    const results = await caller.joinRequests.getAll();

    expect(Array.isArray(results)).toBe(true);
  });

  it("should prevent non-admin from viewing join requests", async () => {
    const userCaller = appRouter.createCaller(createMockContext("user"));

    try {
      await userCaller.joinRequests.getAll();
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
