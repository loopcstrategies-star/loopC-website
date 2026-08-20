import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

function poolOptions(connectionString: string) {
  // Railway public TCP proxies present a self-signed cert chain.
  // URL sslmode=require is treated as verify-full by node-pg, so strip it
  // and force rejectUnauthorized:false when talking to Railway proxies.
  const allowInsecureSsl =
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "0" ||
    /proxy\.rlwy\.net|railway\.(app|internal)/i.test(connectionString);

  if (!allowInsecureSsl) {
    return { connectionString };
  }

  const cleaned = connectionString
    .replace(/([?&])sslmode=[^&]*/gi, "$1")
    .replace(/[?&]$/, "")
    .replace(/\?&/, "?");

  return {
    connectionString: cleaned,
    ssl: { rejectUnauthorized: false as const },
  };
}

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = globalForPrisma.pgPool ?? new Pool(poolOptions(connectionString));
  if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
