import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // Static HTML export ke liye
  distDir: 'out',        // Build folder ka naam
  trailingSlash: true,   // /about/index.html wala structure banaye ga
  images: {
    unoptimized: true,   // Static export mein image optimization off karni parti hai
  },
  typescript: {
    ignoreBuildErrors: true, // Build ko crash hone se bachane ke liye
  },
};

export default nextConfig;