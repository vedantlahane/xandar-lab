import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/ideaforge',
        destination: '/lab/ideas/forge',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
