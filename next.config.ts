import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static HTML/CSS/JS generate karne ke liye
  images: {
    unoptimized: true, // Static export mein image optimization server-side nahi chalti
  },
  // Agar aap sub-folder (e.g. railspk.com/site) mein host kar rahe hain to basepath yahan likhein
  // basePath: '/site', 
};

export default nextConfig;