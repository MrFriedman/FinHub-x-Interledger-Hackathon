import { PrismaClient } from "@prisma/client";

import { env } from "$/src/env";
import { isDemoMode } from "$/src/demo/mode";
import { getMemoryDb } from "$/src/demo/memory-db";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function getPrismaClient() {
  const client = globalForPrisma.prisma ?? createPrismaClient();
  if (env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

/**
 * Demo deployments never construct a Prisma client. The memory adapter
 * implements the calls this app makes and is cast so existing routers stay put.
 */
export const db = (
  isDemoMode() ? getMemoryDb() : getPrismaClient()
) as PrismaClient;
