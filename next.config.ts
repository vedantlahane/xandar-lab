import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-progress",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
    ],
  },
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
