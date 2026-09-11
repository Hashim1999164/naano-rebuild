import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**": ["./data/db.json"],
    "/data/db.json": ["./data/db.json"],
  },
  async rewrites() {
    return [{ source: "/data/db.json", destination: "/api/data" }];
  },
};

export default nextConfig;
