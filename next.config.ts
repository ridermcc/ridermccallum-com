import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/europe", destination: "/europe/index.html" },
    ];
  },
};

export default nextConfig;
