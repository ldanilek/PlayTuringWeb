import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const ruleValidator = v.object({
  state: v.number(),
  read: v.string(),
  newState: v.number(),
  write: v.string(),
  direction: v.union(v.literal("left"), v.literal("right")),
});

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  challengeAttempts: defineTable({
    userId: v.id("users"),
    challengeName: v.string(),
    completed: v.boolean(),
  }).index("by_user", ["userId", "challengeName"]),
  rules: defineTable({
    userId: v.id("users"),
    challengeAttempt: v.id("challengeAttempts"),
    rule: ruleValidator,
  }).index("by_user", ["userId", "challengeAttempt", "rule.state", "rule.read"]),
});
