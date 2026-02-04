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
      profileLink: "https://example.com/ahmed-" + Date.now(),
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
      profileLink: "https://example.com/scammer-" + Date.now(),
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

    expect(results).toBeDefined();
    expect(results).toHaveProperty('exact');
    expect(results).toHaveProperty('suggestions');
  });

  it("should search profiles by profile link", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const results = await publicCaller.profiles.search({
      query: "example.com",
    });

    expect(results).toBeDefined();
    expect(results).toHaveProperty('exact');
    expect(results).toHaveProperty('suggestions');
  });

  it("should get profile by id", async () => {
    const profileToGet = await caller.profiles.create({
      name: "Profile to Get",
      profileLink: "https://example.com/get-" + Date.now(),
      status: "trusted",
      proofCount: 100,
    });

    expect(profileToGet).toBeDefined();
    const getProfileId = profileToGet.id;

    const publicCaller = appRouter.createCaller(createPublicContext());
    const result = await publicCaller.profiles.getById({
      id: getProfileId,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Profile to Get");
    expect(result?.status).toBe("trusted");
  });

  it("should update a profile", async () => {
    const profileToUpdate = await caller.profiles.create({
      name: "Profile to Update",
      profileLink: "https://example.com/update-" + Date.now(),
      status: "trusted",
      proofCount: 100,
    });

    expect(profileToUpdate).toBeDefined();
    const updateProfileId = profileToUpdate.id;

    const result = await caller.profiles.update({
      id: updateProfileId,
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

    expect(results).toBeDefined();
    expect(results).toHaveProperty('exact');
    expect(results).toHaveProperty('suggestions');
  });

  it("should delete a profile", async () => {
    // Create a profile to delete
    const profileToDelete = await caller.profiles.create({
      name: "Profile to Delete",
      profileLink: "https://example.com/delete-" + Date.now(),
      status: "trusted",
      proofCount: 0,
    });

    expect(profileToDelete).toBeDefined();
    const deleteId = profileToDelete.id;

    // Delete the profile
    const result = await caller.profiles.delete({
      id: deleteId,
    });

    expect(result.success).toBe(true);

    // Verify deletion
    const publicCaller = appRouter.createCaller(createPublicContext());
    const deleted = await publicCaller.profiles.getById({
      id: deleteId,
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
    const timestamp = Date.now();
    const result = await publicCaller.joinRequests.create({
      email: `newuser${timestamp}@example.com`,
      name: "New User",
      profileLink: `https://example.com/newuser-${timestamp}`,
      message: "I want to join as a trusted user",
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("New User");
    expect(result.status).toBe("pending");
  });

  it("should allow admin to view all join requests", async () => {
    const results = await caller.joinRequests.getAll();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
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
