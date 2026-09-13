import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /** Surrogate primary key. Auto-incremented numeric value managed by the database. */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from OAuth. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Owner-managed overrides for values that otherwise live in the editorial
 * musical catalog. A record is only created after the owner saves a change.
 */
export const musicalPriceOverrides = mysqlTable("musical_price_overrides", {
  id: int("id").autoincrement().primaryKey(),
  musicalId: varchar("musicalId", { length: 128 }).notNull().unique(),
  priceFrom: varchar("priceFrom", { length: 32 }).notNull(),
  saleEnabled: boolean("saleEnabled").default(false).notNull(),
  saleLabel: varchar("saleLabel", { length: 64 }),
  saleDiscount: varchar("saleDiscount", { length: 64 }),
  saleNote: text("saleNote"),
  saleEndsAt: timestamp("saleEndsAt"),
  updatedByOpenId: varchar("updatedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type MusicalPriceOverride = typeof musicalPriceOverrides.$inferSelect;
export type InsertMusicalPriceOverride = typeof musicalPriceOverrides.$inferInsert;
