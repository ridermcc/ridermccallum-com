import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async rewrites() {
    return [
      { source: "/europe", destination: "/europe/index.html" },
      { source: "/herbanist-preview", destination: "/herbanist-preview/index.html" },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
