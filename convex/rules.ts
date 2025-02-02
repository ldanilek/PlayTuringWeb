import { v } from "convex/values";
import { ruleValidator } from "./schema";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getChallengeAttempt, getOrCreateChallengeAttempt } from "./challengeAttempts";

export const createRule = mutation({
  args: {
    challengeIndex: v.number(),
    replacingRule: v.optional(ruleValidator),
    rule: ruleValidator,
  },
  handler: async (ctx, args) => {
    const challengeAttemptId = await getOrCreateChallengeAttempt(ctx, args.challengeIndex);
    const userId = (await getAuthUserId(ctx))!;

    const existingRule = await ctx.db.query("rules")
      .withIndex("by_user", (q) => q.eq("userId", userId).eq("challengeAttempt", challengeAttemptId).eq("rule.state", args.rule.state).eq("rule.read", args.rule.read))
      .first();

    if (existingRule) {
      await ctx.db.delete(existingRule._id);
    }

    if (args.replacingRule) {
      const replacingRule = args.replacingRule;
      const replacedRule = await ctx.db.query("rules")
        .withIndex("by_user", (q) => q.eq("userId", userId).eq("challengeAttempt", challengeAttemptId).eq("rule.state", replacingRule.state).eq("rule.read", replacingRule.read))
        .first();

      if (replacedRule) {
        await ctx.db.delete(replacedRule._id);
      }
    }

    await ctx.db.insert("rules", {
      userId,
      challengeAttempt: challengeAttemptId,
      rule: args.rule,
    });
  },
});

export const deleteRule = mutation({
  args: {
    challengeIndex: v.number(),
    rule: ruleValidator,
  },
  handler: async (ctx, args) => {
    const challengeAttemptId = await getOrCreateChallengeAttempt(ctx, args.challengeIndex);
    const userId = (await getAuthUserId(ctx))!;

    const rule = await ctx.db.query("rules")
      .withIndex("by_user", (q) => q.eq("userId", userId).eq("challengeAttempt", challengeAttemptId).eq("rule.state", args.rule.state).eq("rule.read", args.rule.read))
      .first();

    if (rule) {
      await ctx.db.delete(rule._id);
    }
  },
});

export const getRules = query({
  args: {
    challengeIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const challengeAttemptId = await getChallengeAttempt(ctx, args.challengeIndex);
    if (!challengeAttemptId) {
      return [];
    }

    const userId = (await getAuthUserId(ctx))!;

    const rules = await ctx.db.query("rules")
      .withIndex("by_user", (q) => q.eq("userId", userId).eq("challengeAttempt", challengeAttemptId))
      .collect();
    return rules.map(r => r.rule);
  },
});
