/**
 * Decide whether the app should run without Clerk, Prisma, or Open Payments.
 * Explicit NEXT_PUBLIC_DEMO_MODE wins. Otherwise demo mode is on when the
 * Clerk publishable key, Clerk secret, or DATABASE_URL is missing.
 *
 * Browser bundles must not infer demo mode from server secrets. next.config
 * always inlines NEXT_PUBLIC_DEMO_MODE as "true" or "false".
 *
 * @param {Record<string, string | undefined>} [env]
 * @returns {boolean}
 */
export function resolveDemoMode(env = process.env) {
  const flag = env.NEXT_PUBLIC_DEMO_MODE;
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  if (typeof window !== "undefined") return false;

  const missingDatabase = !env.DATABASE_URL;
  const missingClerk =
    !env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !env.CLERK_SECRET_KEY;
  return missingDatabase || missingClerk;
}
