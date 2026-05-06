import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // Static HTML export
  distDir: 'out',        // Build folder
  trailingSlash: true,   // /about/index.html structure
  images: {
    unoptimized: true,   // Required for static export
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
  // Note: Ye redirects 'output: export' ke saath kaam nahi karein ge
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;