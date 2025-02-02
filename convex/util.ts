import { getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";


export async function getChallengeAttempt(ctx: QueryCtx, challengeName: string): Promise<Id<"challengeAttempts"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const challengeAttempt = await ctx.db.query("challengeAttempts")
    .withIndex("by_user", (q) => q.eq("userId", userId).eq("challengeName", challengeName))
    .order("desc")
    .first();

  return challengeAttempt?._id ?? null;
}

export async function getOrCreateChallengeAttempt(ctx: MutationCtx, challengeName: string): Promise<Id<"challengeAttempts">> {
  const challengeAttempt = await getChallengeAttempt(ctx, challengeName);
  if (challengeAttempt) {
    return challengeAttempt;
  }

  const userId = (await getAuthUserId(ctx))!;

  return await ctx.db.insert("challengeAttempts", {
    userId,
    challengeName,
    completed: false,
  });
}

export async function getRulesHandler(ctx: QueryCtx, args: { challengeName: string }) {
  const challengeAttemptId = await getChallengeAttempt(ctx, args.challengeName);
  if (!challengeAttemptId) {
    return [];
  }

  const userId = (await getAuthUserId(ctx))!;

  const rules = await ctx.db.query("rules")
    .withIndex("by_user", (q) => q.eq("userId", userId).eq("challengeAttempt", challengeAttemptId))
    .collect();
  return rules.map(r => r.rule);
}
