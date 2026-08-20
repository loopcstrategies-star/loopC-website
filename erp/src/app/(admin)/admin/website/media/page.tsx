import { MediaLibraryClient } from "@/components/admin/cms/media-library-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminMediaPage() {
  await requireAdminSession();

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Upload and manage images used across the public website.
        </p>
      </div>
      <MediaLibraryClient assets={assets} />
    </div>
  );
}
