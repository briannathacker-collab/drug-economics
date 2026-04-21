import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/ira-effect", destination: "/the-ira-effect", permanent: true },
    ];
  },
};

export default nextConfig;
