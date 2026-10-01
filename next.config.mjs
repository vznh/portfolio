import { execSync } from "node:child_process";

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

const nextConfig = {
  reactStrictMode: true,

  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha(),
  },
};

export default nextConfig;
