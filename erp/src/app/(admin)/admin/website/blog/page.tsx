import { BlogClient } from "@/components/admin/cms/blog-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminBlogPage() {
  await requireAdminSession();
  const posts = await prisma.blogPost.findMany({
    include: { category: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
      <BlogClient posts={posts} />
    </div>
  );
}
