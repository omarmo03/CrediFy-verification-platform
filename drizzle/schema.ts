import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and type definitions.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add additional tables as your schema grows

/**
 * Profiles table for RPS verification platform
 * Stores information about trusted users, scammers, and unknown profiles
 */
export const profiles = mysqlTable(
  "profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    profileLink: varchar("profileLink", { length: 500 }).notNull().unique(),
    status: mysqlEnum("status", ["trusted", "scammer", "not_found", "suspicious"]).notNull(),
    rank: mysqlEnum("rank", ["verified", "top_seller", "middleman"]).default("verified"),
    proofCount: int("proofCount").default(0).notNull(),
    phone: varchar("phone", { length: 20 }),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ([
    index("idx_name").on(table.name),
    index("idx_profileLink").on(table.profileLink),
    index("idx_status").on(table.status),
    index("idx_rank").on(table.rank),
  ])
);

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * JoinRequests table for storing user join applications
 */
export const joinRequests = mysqlTable(
  "joinRequests",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    profileLink: varchar("profileLink", { length: 500 }).notNull(),
    message: text("message"),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ([
    index("idx_email").on(table.email),
    index("idx_status").on(table.status),
  ])
);

export type JoinRequest = typeof joinRequests.$inferSelect;
export type InsertJoinRequest = typeof joinRequests.$inferInsert;

/**
 * Reports table for storing fraud reports
 */
export const reports = mysqlTable(
  "reports",
  {
    id: int("id").autoincrement().primaryKey(),
    reporterEmail: varchar("reporterEmail", { length: 320 }).notNull(),
    reporterName: varchar("reporterName", { length: 255 }).notNull(),
    scammerName: varchar("scammerName", { length: 255 }).notNull(),
    scammerLink: varchar("scammerLink", { length: 500 }).notNull(),
    description: text("description").notNull(),
    evidence: text("evidence"),
    status: mysqlEnum("status", ["pending", "verified", "rejected"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ([
    index("idx_scammerLink").on(table.scammerLink),
    index("idx_status").on(table.status),
    index("idx_createdAt").on(table.createdAt),
  ])
);

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * ReportEvidence table for storing uploaded evidence files
 */
export const reportEvidence = mysqlTable(
  "reportEvidence",
  {
    id: int("id").autoincrement().primaryKey(),
    reportId: int("reportId").notNull(),
    fileUrl: text("fileUrl").notNull(),
    fileType: varchar("fileType", { length: 50 }).notNull(),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ([
    index("idx_reportId").on(table.reportId),
  ])
);

export type ReportEvidence = typeof reportEvidence.$inferSelect;
export type InsertReportEvidence = typeof reportEvidence.$inferInsert;

/**
 * Appeals table for storing appeals from scammers
 */
export const appeals = mysqlTable(
  "appeals",
  {
    id: int("id").autoincrement().primaryKey(),
    profileId: int("profileId").notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    message: text("message").notNull(),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ([
    index("idx_profileId").on(table.profileId),
    index("idx_status").on(table.status),
  ])
);

export type Appeal = typeof appeals.$inferSelect;
export type InsertAppeal = typeof appeals.$inferInsert;

/**
 * SiteSettings table for dynamic site configuration
 */
export const siteSettings = mysqlTable(
  "siteSettings",
  {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    value: text("value").notNull(),
    type: mysqlEnum("type", ["string", "number", "boolean", "json"]).default("string").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ([
    index("idx_key").on(table.key),
  ])
);

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;