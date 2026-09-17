import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Let phones on the local network load dev scripts (hydration, HMR).
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*"],
  async rewrites() {
    return [
      { source: "/europe", destination: "/europe/index.html" },
      { source: "/herbanist-preview", destination: "/herbanist-preview/index.html" },
      { source: "/tantanci-preview", destination: "/tantanci-preview/index.html" },
      { source: "/offseason", destination: "/offseason/index.html" },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
