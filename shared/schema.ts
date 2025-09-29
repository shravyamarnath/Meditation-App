import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Meditation sessions table
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"), // Optional - sessions can be anonymous
  presetName: text("preset_name").notNull(),
  presetType: text("preset_type").notNull(), // 'breathing', 'guided', 'timer'
  technique: text("technique"), // 'box', '4-7-8', 'equal', etc.
  duration: integer("duration").notNull(), // in seconds
  completedDuration: integer("completed_duration").notNull(), // actual time completed
  completionPercentage: integer("completion_percentage").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  startedAt: timestamp("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: timestamp("completed_at"),
});

// User settings table
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"), // Optional - settings can be anonymous/local
  intervalBells: boolean("interval_bells").notNull().default(false),
  intervalDuration: integer("interval_duration").notNull().default(5),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
  bellSound: text("bell_sound").notNull().default('tibetan'),
  volume: integer("volume").notNull().default(50),
  visualCues: boolean("visual_cues").notNull().default(true),
  autoFadeInterface: boolean("auto_fade_interface").notNull().default(true),
  fadeDuration: integer("fade_duration").notNull().default(10),
  updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Schema validation for inserts
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  startedAt: true,
});

// Schema for updating sessions - only allow specific fields
export const updateSessionSchema = createInsertSchema(sessions).pick({
  completedDuration: true,
  completionPercentage: true,
  isCompleted: true,
  completedAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

// Session stats interface (computed from sessions)
export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  thisWeek: number;
  favoriteType: string;
  lastSession: string;
}
