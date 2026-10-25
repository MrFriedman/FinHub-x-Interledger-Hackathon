import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// `prisma generate` does not connect, but the schema references DATABASE_URL.
// A placeholder keeps `next build` working when no database is configured.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://demo:demo@127.0.0.1:5432/demo?schema=public";
}

const prismaEntry = require.resolve("prisma/build/index.js");
const result = spawnSync(process.execPath, [prismaEntry, "generate"], {
  stdio: "inherit",
  env: process.env,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
