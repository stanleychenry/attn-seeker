/**
 * Server-side Algolia search. Uses the same search-only key as the client.
 * Used by /api/search for YAP Articles (and future indices).
 */

import { algoliasearch } from "algoliasearch";

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? "";

const YAP_ARTICLES_INDEX = "yap_articles";

export interface YapArticleHit {
  objectID: string;
  slug?: string;
  title?: string;
  name?: string;
  topic_name?: string;
  thumbnail_url?: string;
  reading_time?: number;
  summary?: string;
  [key: string]: unknown;
}

export async function searchYapArticles(query: string, limit = 20): Promise<YapArticleHit[]> {
  if (!APP_ID || !SEARCH_KEY || !query.trim()) return [];

  try {
    const client = algoliasearch(APP_ID, SEARCH_KEY);
    const response = await client.searchSingleIndex({
      indexName: YAP_ARTICLES_INDEX,
      searchParams: {
        query: query.trim(),
        hitsPerPage: limit,
      },
    });

    const hits = (response as { hits?: YapArticleHit[] }).hits ?? [];
    return hits;
  } catch (err) {
    console.error("[algolia-server] searchYapArticles error:", err);
    return [];
  }
}
