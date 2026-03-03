import type { MetadataRoute } from "next";

/**
 * Blocks all crawlers from indexing the site.
 * Remove or change this when you want the site to be indexable (e.g. after launch).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
