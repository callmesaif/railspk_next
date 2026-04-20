import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: 'out',  // Explicitly set output directory
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;