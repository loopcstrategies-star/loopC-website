import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/server/auth";
import { prisma } from "@/server/db";
import { writeAuditLog } from "@/server/audit/write";

export async function GET() {
  try {
    await requireSuperAdmin();
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ assets });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const body = await req.json();
    const { filename, url, mimeType, sizeBytes, altText, storageKey } = body as {
      filename: string;
      url: string;
      mimeType?: string;
      sizeBytes?: number;
      altText?: string;
      storageKey?: string;
    };

    if (!filename || !url) {
      return NextResponse.json({ error: "filename and url are required" }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.create({
      data: { filename, url, mimeType, sizeBytes, altText, storageKey },
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: "media.upload",
      entityType: "MediaAsset",
      entityId: asset.id,
      metadata: { filename },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireSuperAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const asset = await prisma.mediaAsset.delete({ where: { id } });

    await writeAuditLog({
      actorId: session.user.id,
      action: "media.delete",
      entityType: "MediaAsset",
      entityId: id,
      metadata: { filename: asset.filename },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized or not found" }, { status: 401 });
  }
}
