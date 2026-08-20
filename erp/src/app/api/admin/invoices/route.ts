import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";

export async function GET(req: Request) {
  try {
    await requireSuperAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");
    const search = searchParams.get("search");

    const invoices = await prisma.invoice.findMany({
      where: {
        ...(status ? { status: status as "OPEN" | "PAID" | "VOID" | "UNCOLLECTIBLE" } : {}),
        ...(companyId ? { companyId } : {}),
        ...(search
          ? {
              OR: [
                { number: { contains: search, mode: "insensitive" } },
                { company: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        company: { select: { id: true, name: true, slug: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ invoices });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
