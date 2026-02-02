import { eq, or, ilike } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, profiles, InsertProfile, Profile, joinRequests, InsertJoinRequest, JoinRequest, reports, InsertReport, Report, reportEvidence, InsertReportEvidence, ReportEvidence } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Profile queries
export async function searchProfiles(query: string): Promise<Profile[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search profiles: database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(profiles)
      .where(
        or(
          ilike(profiles.name, `%${query}%`),
          ilike(profiles.profileLink, `%${query}%`)
        )
      )
      .limit(10);

    return results;
  } catch (error) {
    console.error("[Database] Failed to search profiles:", error);
    return [];
  }
}

export async function getProfileById(id: number): Promise<Profile | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get profile: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get profile:", error);
    return undefined;
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get profiles: database not available");
    return [];
  }

  try {
    return await db.select().from(profiles).orderBy(profiles.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get profiles:", error);
    return [];
  }
}

export async function createProfile(data: InsertProfile): Promise<Profile | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create profile: database not available");
    return null;
  }

  try {
    await db.insert(profiles).values(data);
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.profileLink, data.profileLink))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create profile:", error);
    return null;
  }
}

export async function updateProfile(id: number, data: Partial<InsertProfile>): Promise<Profile | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update profile: database not available");
    return null;
  }

  try {
    await db.update(profiles).set(data).where(eq(profiles.id, id));
    const result = await getProfileById(id);
    return result || null;
  } catch (error) {
    console.error("[Database] Failed to update profile:", error);
    return null;
  }
}

export async function deleteProfile(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete profile: database not available");
    return false;
  }

  try {
    await db.delete(profiles).where(eq(profiles.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete profile:", error);
    return false;
  }
}

// Join Request queries
export async function createJoinRequest(data: InsertJoinRequest): Promise<JoinRequest | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create join request: database not available");
    return null;
  }

  try {
    await db.insert(joinRequests).values(data);
    const result = await db
      .select()
      .from(joinRequests)
      .orderBy(joinRequests.createdAt)
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create join request:", error);
    return null;
  }
}

export async function getJoinRequests(status?: string): Promise<JoinRequest[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get join requests: database not available");
    return [];
  }

  try {
    if (status) {
      return await db
        .select()
        .from(joinRequests)
        .where(eq(joinRequests.status, status as any))
        .orderBy(joinRequests.createdAt);
    }
    return await db.select().from(joinRequests).orderBy(joinRequests.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get join requests:", error);
    return [];
  }
}

// Report queries

export async function createReport(data: InsertReport): Promise<Report | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create report: database not available");
    return null;
  }

  try {
    await db.insert(reports).values(data);
    const result = await db
      .select()
      .from(reports)
      .orderBy(reports.createdAt)
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create report:", error);
    return null;
  }
}

export async function getReports(status?: string): Promise<Report[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get reports: database not available");
    return [];
  }

  try {
    if (status) {
      return await db
        .select()
        .from(reports)
        .where(eq(reports.status, status as any))
        .orderBy(reports.createdAt);
    }
    return await db.select().from(reports).orderBy(reports.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get reports:", error);
    return [];
  }
}

export async function updateReportStatus(id: number, status: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update report: database not available");
    return false;
  }

  try {
    await db.update(reports).set({ status: status as any }).where(eq(reports.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update report:", error);
    return false;
  }
}

export async function addReportEvidence(data: InsertReportEvidence): Promise<ReportEvidence | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add evidence: database not available");
    return null;
  }

  try {
    await db.insert(reportEvidence).values(data);
    const result = await db
      .select()
      .from(reportEvidence)
      .orderBy(reportEvidence.createdAt)
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to add evidence:", error);
    return null;
  }
}

export async function getReportEvidence(reportId: number): Promise<ReportEvidence[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get evidence: database not available");
    return [];
  }

  try {
    return await db
      .select()
      .from(reportEvidence)
      .where(eq(reportEvidence.reportId, reportId))
      .orderBy(reportEvidence.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get evidence:", error);
    return [];
  }
}

export async function updateProfileRank(id: number, rank: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update profile: database not available");
    return false;
  }

  try {
    await db.update(profiles).set({ rank: rank as any }).where(eq(profiles.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update profile rank:", error);
    return false;
  }
}

export async function smartSearch(query: string): Promise<Profile[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search: database not available");
    return [];
  }

  try {
    return await db.select().from(profiles);
  } catch (error) {
    console.error("[Database] Failed to search:", error);
    return [];
  }
}


// Site Settings queries
import { siteSettings, SiteSetting, InsertSiteSetting, appeals, Appeal, InsertAppeal } from "../drizzle/schema";

export async function getSiteSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get setting: database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    return result.length > 0 ? result[0].value : null;
  } catch (error) {
    console.error("[Database] Failed to get setting:", error);
    return null;
  }
}

export async function getAllSiteSettings(): Promise<SiteSetting[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get settings: database not available");
    return [];
  }

  try {
    return await db.select().from(siteSettings);
  } catch (error) {
    console.error("[Database] Failed to get settings:", error);
    return [];
  }
}

export async function updateSiteSetting(key: string, value: string, type: string = "string"): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update setting: database not available");
    return false;
  }

  try {
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value, type: type as any, updatedAt: new Date() })
        .where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value, type: type as any });
    }
    return true;
  } catch (error) {
    console.error("[Database] Failed to update setting:", error);
    return false;
  }
}

// Appeals queries
export async function createAppeal(data: InsertAppeal): Promise<Appeal | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create appeal: database not available");
    return null;
  }

  try {
    await db.insert(appeals).values(data);
    const result = await db
      .select()
      .from(appeals)
      .orderBy(appeals.createdAt)
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create appeal:", error);
    return null;
  }
}

export async function getAppeals(status?: string): Promise<Appeal[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get appeals: database not available");
    return [];
  }

  try {
    if (status) {
      return await db
        .select()
        .from(appeals)
        .where(eq(appeals.status, status as any))
        .orderBy(appeals.createdAt);
    }
    return await db.select().from(appeals).orderBy(appeals.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get appeals:", error);
    return [];
  }
}

export async function updateAppealStatus(id: number, status: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update appeal: database not available");
    return false;
  }

  try {
    await db.update(appeals).set({ status: status as any }).where(eq(appeals.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update appeal:", error);
    return false;
  }
}
