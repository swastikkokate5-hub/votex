import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Officers table
export const officers = pgTable("officers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  officerId: text("officer_id").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  boothId: text("booth_id").notNull(),
});

// Voters table
export const voters = pgTable("voters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voterId: text("voter_id").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  address: text("address").notNull(),
  boothId: text("booth_id").notNull(),
  photoUrl: text("photo_url"),
  fingerprintTemplate: text("fingerprint_template"),
  hasVoted: boolean("has_voted").notNull().default(false),
});

// Candidates table
export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  partyName: text("party_name").notNull(),
  partySymbol: text("party_symbol").notNull(),
  boothId: text("booth_id").notNull(),
});

// Votes table
export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voterId: text("voter_id").notNull(),
  candidateId: text("candidate_id").notNull(),
  officerId: text("officer_id").notNull(),
  boothId: text("booth_id").notNull(),
  faceMatchScore: integer("face_match_score").notNull(),
  fingerprintMatchScore: integer("fingerprint_match_score").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  voterId: text("voter_id"),
  officerId: text("officer_id").notNull(),
  boothId: text("booth_id").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert schemas
export const insertOfficerSchema = createInsertSchema(officers).omit({ id: true });
export const insertVoterSchema = createInsertSchema(voters).omit({ id: true });
export const insertCandidateSchema = createInsertSchema(candidates).omit({ id: true });
export const insertVoteSchema = createInsertSchema(votes).omit({ id: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true });

// Types
export type Officer = typeof officers.$inferSelect;
export type InsertOfficer = z.infer<typeof insertOfficerSchema>;
export type Voter = typeof voters.$inferSelect;
export type InsertVoter = z.infer<typeof insertVoterSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
