import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.INTERNLINK_DIST_DIR || ".next",
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
