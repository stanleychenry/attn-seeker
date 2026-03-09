/**
 * Server-side Algolia search. Uses ALGOLIA_ADMIN_KEY only; no keys are exposed to the client.
 * Used by /api/search for YAP articles. Home and learn search use client-side InstantSearch with a search-only key.
 */

import { algoliasearch } from "algoliasearch";
import { GLOBAL_INDEX_NAME } from "@/lib/algolia-sync";

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY ?? "";

const YAP_ARTICLES_INDEX = "yap_articles";

function getClient() {
  if (!APP_ID || !ADMIN_KEY) return null;
  return algoliasearch(APP_ID, ADMIN_KEY);
}

export interface YapArticleHit {
  objectID: string;
  slug?: string;
  title?: string;
  name?: string;
  topic_name?: string;
  thumbnail_url?: string;
  reading_time?: number;
  summary?: string;
  _highlightResult?: Record<string, { value?: string }>;
  [key: string]: unknown;
}

export async function searchYapArticles(query: string, limit = 20): Promise<YapArticleHit[]> {
  const client = getClient();
  if (!client || !query.trim()) return [];

  try {
    const response = await client.searchSingleIndex({
      indexName: YAP_ARTICLES_INDEX,
      searchParams: {
        query: query.trim(),
        hitsPerPage: limit,
        attributesToHighlight: ["title", "name", "summary"],
      },
    });

    const hits = (response as { hits?: YapArticleHit[] }).hits ?? [];
    return hits;
  } catch (err) {
    console.error("[algolia-server] searchYapArticles error:", err);
    return [];
  }
}

/** Hit shape from attn_seeker_global (for home search). */
export interface GlobalSearchHit {
  objectID: string;
  contentType: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  meta?: string;
  sortOrder?: number;
  _highlightResult?: Record<string, { value?: string }>;
  [key: string]: unknown;
}

export async function searchGlobalIndex(
  query: string,
  limit = 20
): Promise<{ hits: GlobalSearchHit[]; nbHits: number }> {
  const client = getClient();
  if (!client || !query.trim()) return { hits: [], nbHits: 0 };

  try {
    const response = await client.searchSingleIndex({
      indexName: GLOBAL_INDEX_NAME,
      searchParams: {
        query: query.trim(),
        hitsPerPage: limit,
        attributesToHighlight: ["title", "description", "keywords"],
      },
    });

    const hits = (response as { hits?: GlobalSearchHit[]; nbHits?: number }).hits ?? [];
    const nbHits = (response as { nbHits?: number }).nbHits ?? 0;
    return { hits, nbHits };
  } catch (err) {
    console.error("[algolia-server] searchGlobalIndex error:", err);
    return { hits: [], nbHits: 0 };
  }
}
