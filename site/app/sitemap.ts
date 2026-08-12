import type { MetadataRoute } from "next";
import { insightPosts } from "@/lib/insights";
import { industries } from "@/lib/industries";
import { projects } from "@/lib/projects";
import { getAbsoluteUrl, sitemapPaths } from "@/lib/seo";
import { services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
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
    url: getAbsoluteUrl(project.href),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const insightEntries: MetadataRoute.Sitemap = insightPosts.map((post) => ({
    url: getAbsoluteUrl(`/insights/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...industryEntries, ...workEntries, ...insightEntries];
}
