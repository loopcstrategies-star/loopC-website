import { z } from "zod";
import { SalesInvoiceStatus } from "@prisma/client";
import { requireSession } from "@/server/auth";
import { assertPermission } from "@/server/access/rbac";
import { assertFeature, consumeLimit } from "@/server/access/features";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const lineSchema = z.object({
  catalogItemId: z.string().optional(),
  description: z.string().trim().min(1).max(500),
  quantity: z.coerce.number().positive(),
  unitPriceInr: z.coerce.number().int().min(0),
  taxPercent: z.coerce.number().min(0).max(100).default(0),
});

const createSchema = z.object({
  partyId: z.string().min(1),
  notes: z.string().trim().max(2000).optional(),
  dueDate: z.string().datetime().optional(),
  lines: z.array(lineSchema).min(1),
});

async function gate() {
  const session = await requireSession();
  const companyId = session.user.companyId;
  if (!companyId) throw Object.assign(new Error("No company"), { code: "NO_COMPANY" });
  await assertFeature(companyId, "invoicing");
  return { session, companyId };
}

function lineTotal(qty: number, unitPaise: number, taxPercent: number) {
  const base = Math.round(qty * unitPaise);
  const tax = Math.round((base * taxPercent) / 100);
  return { base, tax, total: base + tax };
}

export async function GET() {
  try {
    const { session, companyId } = await gate();
    await assertPermission(session.user.id, companyId, "invoices.view");
    const invoices = await prisma.salesInvoice.findMany({
      where: { companyId },
      include: { party: true, lines: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return jsonOk({ invoices });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  try {
    const { session, companyId } = await gate();
    await assertPermission(session.user.id, companyId, "invoices.manage");
    await consumeLimit(companyId, "invoices_per_month", 1);

    const body = createSchema.parse(await req.json());
    const party = await prisma.party.findFirst({
      where: { id: body.partyId, companyId, isActive: true },
    });
    if (!party) return jsonError("Customer not found", 404, "PARTY_NOT_FOUND");

    let subtotal = 0;
    let tax = 0;
    const computedLines = body.lines.map((line) => {
      const t = lineTotal(line.quantity, line.unitPriceInr, line.taxPercent);
      subtotal += t.base;
      tax += t.tax;
      return { ...line, lineTotalInr: t.total };
    });
    const total = subtotal + tax;

    const count = await prisma.salesInvoice.count({ where: { companyId } });
    const number = `INV-${String(count + 1).padStart(5, "0")}`;

    const invoice = await prisma.salesInvoice.create({
      data: {
        companyId,
        partyId: party.id,
        number,
        status: SalesInvoiceStatus.SENT,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        notes: body.notes,
        subtotalInr: subtotal,
        taxInr: tax,
        totalInr: total,
        lines: {
          create: computedLines.map((line) => ({
            catalogItemId: line.catalogItemId,
            description: line.description,
            quantity: line.quantity,
            unitPriceInr: line.unitPriceInr,
            taxPercent: line.taxPercent,
            lineTotalInr: line.lineTotalInr,
          })),
        },
      },
      include: { party: true, lines: true },
    });

    return jsonOk({ invoice }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
