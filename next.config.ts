import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Allow up to 10MB uploads for multiple gallery images
    },
  },
};

export default nextConfig;
