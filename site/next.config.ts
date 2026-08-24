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
      { source: "/erp/pricing", destination: "/pricing", permanent: false },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:slug", destination: "/", permanent: true },
      { source: "/faq", destination: "/", permanent: true },
      { source: "/insights", destination: "/", permanent: true },
      { source: "/insights/:slug", destination: "/", permanent: true },
      { source: "/case-studies", destination: "/work", permanent: true },
      { source: "/case-studies/:slug", destination: "/work/:slug", permanent: false },
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
