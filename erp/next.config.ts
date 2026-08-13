import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "bcryptjs",
    "pdfkit",
    "razorpay",
  ],
};

export default nextConfig;
