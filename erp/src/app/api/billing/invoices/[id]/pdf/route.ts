import { requireSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { generateInvoicePdfBuffer } from "@/server/billing/invoices";
import { handleRouteError, jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    if (!session.user.companyId) {
      return jsonError("Company required", 400, "COMPANY_REQUIRED");
    }
    const { id } = await ctx.params;
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice || invoice.companyId !== session.user.companyId) {
      if (!session.user.isSuperAdmin || !invoice) {
        return jsonError("Invoice not found", 404, "INVOICE_NOT_FOUND");
      }
    }

    const buffer = await generateInvoicePdfBuffer(id);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice!.number}.pdf"`,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
