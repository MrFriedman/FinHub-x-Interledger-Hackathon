import { resolveDemoMode } from "./resolve-demo-mode.js";

/**
 * True when this deployment should bypass Clerk, Prisma, and live Open Payments.
 * The public flag is inlined at build time so client and server agree.
 */
export function isDemoMode(): boolean {
  const flag = process.env.NEXT_PUBLIC_DEMO_MODE;
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  if (typeof window !== "undefined") return false;
  return resolveDemoMode(process.env);
}
