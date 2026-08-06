import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/solutions", destination: "/services", permanent: true },
      { source: "/service", destination: "/services", permanent: true },
      { source: "/pricing", destination: "/erp/pricing", permanent: true },
      { source: "/case-studies", destination: "/work", permanent: true },
      { source: "/demo", destination: "/free-demo", permanent: true },
      { source: "/request-demo", destination: "/free-demo", permanent: true },
    ];
  },
};

export default nextConfig;
