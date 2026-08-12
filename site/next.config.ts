import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/service", destination: "/services", permanent: true },
      { source: "/erp", destination: "/services/custom-software", permanent: true },
      { source: "/erp/pricing", destination: "/services/custom-software", permanent: true },
      { source: "/features", destination: "/services/dashboard-development", permanent: true },
      { source: "/pricing", destination: "/contact", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights", permanent: true },
      { source: "/case-studies", destination: "/work", permanent: true },
      { source: "/demo", destination: "/contact", permanent: true },
      { source: "/request-demo", destination: "/contact", permanent: true },
      { source: "/free-demo", destination: "/contact", permanent: true },
      { source: "/free-audit", destination: "/contact", permanent: true },
      { source: "/free-consultation", destination: "/contact", permanent: true },
      { source: "/download-brochure", destination: "/brochure", permanent: true },
    ];
  },
};

export default nextConfig;
