import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { calculateAccuracyForChallenge, mapRule } from "../src/lib/TuringMachine";
import { getOrCreateChallengeAttempt, getRulesHandler } from "./util";

export const getChallengeAttempts = query({
  args: {
  },
  handler: async (ctx) => {
    const userId = (await getAuthUserId(ctx))!;

    return await ctx.db.query("challengeAttempts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const challengeCompleted = mutation({
  args: {
    challengeName: v.string(),
  },
  handler: async (ctx, args) => {
    const challengeAttempt = await getOrCreateChallengeAttempt(ctx, args.challengeName);
    // Confirm that the challenge is completed
    const rules = await getRulesHandler(ctx, { challengeName: args.challengeName });

    const accuracy = calculateAccuracyForChallenge(rules.map(mapRule), args.challengeName);
    if (!accuracy) {
      throw new ConvexError("Challenge not completed");
    }
    
    await ctx.db.patch(challengeAttempt, {
      completed: true,
    });
  },
});