/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import CopyPlugin from "copy-webpack-plugin";
import { resolveDemoMode } from "./src/demo/resolve-demo-mode.js";

const demoMode = resolveDemoMode(process.env);
process.env.NEXT_PUBLIC_DEMO_MODE = demoMode ? "true" : "false";

// Demo builds have nothing to validate. SKIP_ENV_VALIDATION=1 on Vercel does the same.
if (demoMode && !process.env.SKIP_ENV_VALIDATION) {
  process.env.SKIP_ENV_VALIDATION = "1";
}

await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  env: {
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  },
  webpack: (config) => {
    // append the CopyPlugin to copy the file to your public dir
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/@interledger/open-payments/dist/openapi/specs",
            to: "server/vendor-chunks/specs",
          },
        ],
      }),
    );
    // Important: return the modified config
    return config;
  },
};

export default config;
