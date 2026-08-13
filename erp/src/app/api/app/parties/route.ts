import { z } from "zod";
import { requireSession } from "@/server/auth";
import { assertPermission } from "@/server/access/rbac";
import { assertFeature } from "@/server/access/features";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const partySchema = z.object({
  type: z.enum(["customer", "vendor"]).default("customer"),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  gstin: z.string().trim().max(32).optional(),
  notes: z.string().trim().max(2000).optional(),
});

async function requireTenant(moduleKey: "accounting" | "invoicing" | "crm") {
  const session = await requireSession();
  const companyId = session.user.companyId;
  if (!companyId) throw Object.assign(new Error("No company"), { code: "NO_COMPANY" });
  await assertFeature(companyId, moduleKey);
  return { session, companyId };
}

export async function GET(req: Request) {
  try {
    const { session, companyId } = await requireTenant("accounting");
    await assertPermission(session.user.id, companyId, "customers.view");

    const type = new URL(req.url).searchParams.get("type") ?? undefined;
    const parties = await prisma.party.findMany({
      where: {
        companyId,
        ...(type ? { type } : {}),
        isActive: true,
      },
      orderBy: { name: "asc" },
    });
    return jsonOk({ parties });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const { session, companyId } = await requireTenant("accounting");
    await assertPermission(session.user.id, companyId, "customers.manage");

    const body = partySchema.parse(await req.json());
    const party = await prisma.party.create({
      data: {
        companyId,
        type: body.type,
        name: body.name,
        email: body.email || null,
        phone: body.phone,
        gstin: body.gstin,
        notes: body.notes,
      },
    });
    return jsonOk({ party }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(req: Request) {
  try {
    const { session, companyId } = await requireTenant("accounting");
    await assertPermission(session.user.id, companyId, "customers.manage");
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return jsonError("id required", 400);

    const existing = await prisma.party.findFirst({ where: { id, companyId } });
    if (!existing) return jsonError("Not found", 404);

    await prisma.party.update({
      where: { id },
      data: { isActive: false },
    });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
