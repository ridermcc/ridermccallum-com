import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Let phones on the local network load dev scripts (hydration, HMR).
  // 127.0.0.1 is also required for the Keystatic editor in dev: it redirects
  // localhost to 127.0.0.1 for its GitHub sign-in callback.
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*"],
  async rewrites() {
    return [
      { source: "/europe", destination: "/europe/index.html" },
      { source: "/herbanist-preview", destination: "/herbanist-preview/index.html" },
      { source: "/tantanci-preview", destination: "/tantanci-preview/index.html" },
      { source: "/offseason", destination: "/offseason/index.html" },
    ];
  },
  async headers() {
    // Keep the editor out of search results.
    return [
      { source: "/keystatic/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

// Plugins are passed as strings so Turbopack can load them.
// Posts carry YAML frontmatter (written by the Keystatic editor). The
// frontmatter plugin re-exports it as `metadata`, so `mod.metadata` keeps
// working everywhere posts are imported.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "metadata" }],
    ],
    rehypePlugins: [
      // External links open in a new tab, replacing hand-written <a target>.
      ["rehype-external-links", { target: "_blank", rel: ["noopener", "noreferrer"] }],
    ],
  },
});

export default withMDX(nextConfig);
