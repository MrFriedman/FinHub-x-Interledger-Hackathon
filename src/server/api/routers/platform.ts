import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "$/src/server/api/trpc";
import { isDemoMode } from "$/src/demo/mode";
import { getDemoStore } from "$/src/demo/store";
function ok<T>(message: string, data: T) {
  return { success: true as const, message, data };
}

const listFilter = z
  .object({
    institutionUserId: z.string().optional(),
    fundingRequestId: z.string().optional(),
    donorId: z.string().optional(),
  })
  .optional();

/**
 * Students, funding requests, donors, and transactions.
 * These collections exist in the demo store. A configured deployment keeps
 * using Prisma for users and campaigns and returns empty lists here.
 */
export const platformRouter = createTRPCRouter({
  students: publicProcedure.query(() => {
    if (!isDemoMode()) return ok("students obtained", []);
    return ok("students obtained", getDemoStore().students);
  }),

  fundingRequests: publicProcedure.input(listFilter).query(({ input }) => {
    if (!isDemoMode()) return ok("funding requests obtained", []);
    const rows = getDemoStore().fundingRequests.filter((request) => {
      if (
        input?.institutionUserId &&
        request.institutionUserId !== input.institutionUserId
      ) {
        return false;
      }
      return true;
    });
    return ok("funding requests obtained", rows);
  }),

  donors: publicProcedure.query(() => {
    if (!isDemoMode()) return ok("donors obtained", []);
    return ok("donors obtained", getDemoStore().donors);
  }),

  transactions: publicProcedure.input(listFilter).query(({ input }) => {
    if (!isDemoMode()) return ok("transactions obtained", []);
    const rows = getDemoStore().transactions.filter((transaction) => {
      if (
        input?.fundingRequestId &&
        transaction.fundingRequestId !== input.fundingRequestId
      ) {
        return false;
      }
      if (input?.donorId && transaction.donorId !== input.donorId) {
        return false;
      }
      return true;
    });
    return ok("transactions obtained", rows);
  }),
});
