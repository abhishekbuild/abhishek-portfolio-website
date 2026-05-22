import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Silence Sanity Studio peer-dependency warnings during build
  experimental: {
    serverComponentsExternalPackages: ["sanity"],
  },
};

export default nextConfig;
