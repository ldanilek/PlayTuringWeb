import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export async function getChallengeAttempt(ctx: QueryCtx, challengeIndex: number): Promise<Id<"challengeAttempts"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const challengeAttempt = await ctx.db.query("challengeAttempts")
    .withIndex("by_user", (q) => q.eq("userId", userId).eq("index", challengeIndex))
    .order("desc")
    .first();

  return challengeAttempt?._id ?? null;
}

export async function getOrCreateChallengeAttempt(ctx: MutationCtx, challengeIndex: number): Promise<Id<"challengeAttempts">> {
  const challengeAttempt = await getChallengeAttempt(ctx, challengeIndex);
  if (challengeAttempt) {
    return challengeAttempt;
  }

  const userId = (await getAuthUserId(ctx))!;

  return await ctx.db.insert("challengeAttempts", {
    userId,
    index: challengeIndex,
    completed: false,
  });
}

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
    challengeIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const challengeAttempt = await getOrCreateChallengeAttempt(ctx, args.challengeIndex);
    await ctx.db.patch(challengeAttempt, {
      completed: true,
    });
  },
});