import { execSync } from "node:child_process";

// Full SHA of the commit being built. The page shows the short form as the
// "last updated" marker and links to the commit. Vercel exposes the SHA as an
// env var; local builds ask git directly.
function commitSha() {
  const fromHost = process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromHost) return fromHost;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
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
