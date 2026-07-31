/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    // Without this Next only ever negotiates WebP. AVIF is materially smaller
    // on the photographic work here, and browsers that lack it fall through to
    // the WebP entry, so the list costs nothing to add.
    formats: ["image/avif", "image/webp"],
  },
  // Avoid the flaky persistent pack-file cache during local Webpack refreshes.
  // Production builds keep Next's normal cache behavior.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }

    return config;
  },
};

export default nextConfig;
