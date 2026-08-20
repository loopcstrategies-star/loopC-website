import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/server/auth";
import { generateInvoicePdfBuffer } from "@/server/billing/invoices";
import { writeAuditLog } from "@/server/audit";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await context.params;

    const buffer = await generateInvoicePdfBuffer(id);

    await writeAuditLog({
      actorId: session.user.id,
      action: "invoice.pdf_download",
      entityType: "Invoice",
      entityId: id,
      metadata: {},
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "INVOICE_NOT_FOUND") {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Unauthorized or failed" }, { status: 401 });
  }
}
