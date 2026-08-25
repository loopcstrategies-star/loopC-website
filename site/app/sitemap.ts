import type { MetadataRoute } from "next";
import { industries } from "@/lib/industries";
import { projects } from "@/lib/projects";
import { type ErpBlogPost, erpFetch } from "@/lib/erp-api";
import { getAbsoluteUrl, sitemapPaths } from "@/lib/seo";
import { services } from "@/lib/services";

type BlogListPayload = { posts: ErpBlogPost[] };

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

  const blogData = await erpFetch<BlogListPayload>("/api/public/blog");
  const blogEntries: MetadataRoute.Sitemap = (blogData?.posts ?? []).map((post) => ({
    url: getAbsoluteUrl(`/blog/${post.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.6,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...industryEntries,
    ...workEntries,
    ...blogEntries,
  ];
}
