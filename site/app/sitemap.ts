import type { MetadataRoute } from "next";
import { insightPosts } from "@/lib/insights";
import { erpFetch } from "@/lib/erp-api";
import { industries } from "@/lib/industries";
import { projects } from "@/lib/projects";
import { getAbsoluteUrl, sitemapPaths } from "@/lib/seo";
import { services } from "@/lib/services";

type BlogPayload = {
  posts?: Array<{ slug: string; updatedAt?: string | null }>;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = sitemapPaths.map((path) => ({
    url: getAbsoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: getAbsoluteUrl(service.href),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const industryEntries: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: getAbsoluteUrl(`/industries/${industry.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const workEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: getAbsoluteUrl(`/work/${project.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cmsBlog = await erpFetch<BlogPayload>("/api/public/blog");
  const cmsPosts = cmsBlog?.posts ?? [];
  const cmsBlogEntries: MetadataRoute.Sitemap = cmsPosts.map((post) => ({
    url: getAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const staticBlogEntries: MetadataRoute.Sitemap = insightPosts.map((post) => ({
    url: getAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogEntries =
    cmsBlogEntries.length > 0
      ? cmsBlogEntries
      : staticBlogEntries;

  return [
    ...staticEntries,
    ...serviceEntries,
    ...industryEntries,
    ...workEntries,
    ...blogEntries,
  ];
}
