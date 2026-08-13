import { NextResponse } from "next/server";
import { runBillingJobs } from "@/server/jobs/billing-jobs";
import { rateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    // Optional protection: allow when unset (local/dev)
    return true;
  }
  const header = req.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const cronHeader = req.headers.get("x-cron-secret");
  return bearer === secret || cronHeader === secret;
}

async function handle(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit("cron:billing", 10, 60_000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const result = await runBillingJobs();
  return NextResponse.json({ ok: true, result });
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
