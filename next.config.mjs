import { execSync } from "node:child_process";

// Short SHA of the commit being built, shown on the page as the "last updated"
// marker. Vercel exposes the SHA as an env var; local builds ask git directly.
function commitSha() {
  const fromHost = process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromHost) return fromHost.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Validation builds set NEXT_DIST_DIR so they never clobber a running dev
  // server's .next output (which makes dev reload endlessly).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha(),
  },
};

export default nextConfig;
