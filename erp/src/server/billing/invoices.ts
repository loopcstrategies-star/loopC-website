import PDFDocument from "pdfkit";
import { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import { formatInr } from "@/lib/constants";

async function nextInvoiceNumber(): Promise<string> {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const prefix = `INV-${y}${m}${d}-`;

  const latest = await prisma.invoice.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
    select: { number: true },
  });

  let seq = 1;
  if (latest?.number) {
    const part = latest.number.slice(prefix.length);
    const n = Number.parseInt(part, 10);
    if (!Number.isNaN(n)) seq = n + 1;
  }

  return `${prefix}${String(seq).padStart(4, "0")}`;
}

export async function createInvoiceFromPayment(input: {
  companyId: string;
  subscriptionId?: string | null;
  paymentId: string;
  subtotalInr: number;
  taxInr: number;
  discountInr: number;
  totalInr: number;
  currency?: string;
  billingPeriodStart?: Date | null;
  billingPeriodEnd?: Date | null;
  description: string;
  paidAt?: Date | null;
}) {
  const existing = await prisma.invoice.findUnique({
    where: { paymentId: input.paymentId },
  });
  if (existing) return existing;

  const number = await nextInvoiceNumber();

  return prisma.invoice.create({
    data: {
      number,
      companyId: input.companyId,
      subscriptionId: input.subscriptionId ?? undefined,
      paymentId: input.paymentId,
      status: InvoiceStatus.PAID,
      billingPeriodStart: input.billingPeriodStart ?? undefined,
      billingPeriodEnd: input.billingPeriodEnd ?? undefined,
      subtotalInr: input.subtotalInr,
      taxInr: input.taxInr,
      discountInr: input.discountInr,
      totalInr: input.totalInr,
      currency: input.currency ?? "INR",
      paidAt: input.paidAt ?? new Date(),
      items: {
        create: [
          {
            description: input.description,
            quantity: 1,
            amountInr: input.subtotalInr,
          },
        ],
      },
    },
    include: { items: true, company: true, payment: true },
  });
}

export async function generateInvoicePdfBuffer(invoiceId: string): Promise<Buffer> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      company: true,
      items: true,
      payment: true,
      subscription: { include: { plan: true } },
    },
  });

  if (!invoice) {
    throw Object.assign(new Error("Invoice not found"), { code: "INVOICE_NOT_FOUND" });
  }

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("LoopC ERP", { continued: false });
    doc.moveDown(0.5);
    doc.fontSize(14).text("Tax Invoice");
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Invoice #: ${invoice.number}`);
    doc.text(`Status: ${invoice.status}`);
    doc.text(`Date: ${invoice.createdAt.toISOString().slice(0, 10)}`);
    if (invoice.paidAt) {
      doc.text(`Paid at: ${invoice.paidAt.toISOString().slice(0, 10)}`);
    }
    doc.moveDown();

    doc.text(`Bill to: ${invoice.company.name}`);
    if (invoice.company.country) doc.text(`Country: ${invoice.company.country}`);
    doc.moveDown();

    if (invoice.billingPeriodStart || invoice.billingPeriodEnd) {
      doc.text(
        `Billing period: ${invoice.billingPeriodStart?.toISOString().slice(0, 10) ?? "—"} → ${invoice.billingPeriodEnd?.toISOString().slice(0, 10) ?? "—"}`,
      );
      doc.moveDown();
    }

    doc.text("Items");
    doc.moveDown(0.3);
    for (const item of invoice.items) {
      doc.text(
        `${item.description}  ×${item.quantity}    ${formatInr(item.amountInr)}`,
      );
    }

    doc.moveDown();
    doc.text(`Subtotal: ${formatInr(invoice.subtotalInr)}`);
    doc.text(`Discount: ${formatInr(invoice.discountInr)}`);
    doc.text(`Tax: ${formatInr(invoice.taxInr)}`);
    doc.fontSize(12).text(`Total: ${formatInr(invoice.totalInr)}`);

    if (invoice.payment?.providerPaymentId) {
      doc.moveDown();
      doc.fontSize(9).text(`Payment ref: ${invoice.payment.providerPaymentId}`);
    }

    doc.end();
  });
}
