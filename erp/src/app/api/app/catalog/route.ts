import { z } from "zod";
import { requireSession } from "@/server/auth";
import { assertPermission } from "@/server/access/rbac";
import { assertFeature } from "@/server/access/features";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const itemSchema = z.object({
  kind: z.enum(["product", "service"]).default("service"),
  sku: z.string().trim().max(64).optional().or(z.literal("")),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  unitPriceInr: z.coerce.number().int().min(0),
  taxPercent: z.coerce.number().min(0).max(100).default(18),
});

async function gate() {
  const session = await requireSession();
  const companyId = session.user.companyId;
  if (!companyId) throw Object.assign(new Error("No company"), { code: "NO_COMPANY" });
  await assertFeature(companyId, "invoicing");
  return { session, companyId };
}

export async function GET() {
  try {
    const { session, companyId } = await gate();
    await assertPermission(session.user.id, companyId, "products.view");
    const items = await prisma.catalogItem.findMany({
      where: { companyId, isActive: true },
      orderBy: { name: "asc" },
    });
    return jsonOk({ items });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const { session, companyId } = await gate();
    await assertPermission(session.user.id, companyId, "products.manage");
    const body = itemSchema.parse(await req.json());
    const item = await prisma.catalogItem.create({
      data: {
        companyId,
        kind: body.kind,
        sku: body.sku || null,
        name: body.name,
        description: body.description,
        unitPriceInr: body.unitPriceInr,
        taxPercent: body.taxPercent,
      },
    });
    return jsonOk({ item }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(req: Request) {
  try {
    const { session, companyId } = await gate();
    await assertPermission(session.user.id, companyId, "products.manage");
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return jsonError("id required", 400);
    const existing = await prisma.catalogItem.findFirst({ where: { id, companyId } });
    if (!existing) return jsonError("Not found", 404);
    await prisma.catalogItem.update({ where: { id }, data: { isActive: false } });
    return jsonOk({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
