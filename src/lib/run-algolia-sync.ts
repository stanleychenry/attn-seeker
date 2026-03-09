/**
 * Runs the full Algolia global index sync: fetch all CMS content, build records, push to Algolia.
 * Used by POST /api/admin/sync-search and by the build-time sync script.
 */

import { algoliasearch } from "algoliasearch";
import {
  getYapArticles,
  getServices,
  getCaseStudies,
  getShowEpisodes,
  getPodcastEpisodes,
  getTeams,
  getEvents,
  getShows,
  getPodcasts,
  getTopics,
} from "@/lib/cms";
import {
  GLOBAL_INDEX_NAME,
  GLOBAL_INDEX_SETTINGS,
  buildGlobalSearchRecords,
} from "@/lib/algolia-sync";

const BATCH_SIZE = 500;

export interface SyncResult {
  ok: true;
  index: string;
  totalRecords: number;
}

export interface SyncError {
  ok: false;
  error: string;
}

export async function runAlgoliaSync(): Promise<SyncResult | SyncError> {
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";

  if (!adminKey) {
    return { ok: false, error: "ALGOLIA_ADMIN_KEY is not set" };
  }
  if (!appId) {
    return { ok: false, error: "NEXT_PUBLIC_ALGOLIA_APP_ID is not set" };
  }

  try {
    const [
      articles,
      services,
      caseStudies,
      showEpisodes,
      podcastEpisodes,
      teams,
      events,
      shows,
      podcasts,
      topics,
    ] = await Promise.all([
      getYapArticles().catch(() => []),
      getServices().catch(() => []),
      getCaseStudies().catch(() => []),
      getShowEpisodes().catch(() => []),
      getPodcastEpisodes().catch(() => []),
      getTeams().catch(() => []),
      getEvents().catch(() => []),
      getShows().catch(() => []),
      getPodcasts().catch(() => []),
      getTopics().catch(() => []),
    ]);

    const records = buildGlobalSearchRecords({
      articles,
      services,
      caseStudies,
      showEpisodes,
      podcastEpisodes,
      teams,
      events,
      shows,
      podcasts,
      topics,
    });

    const client = algoliasearch(appId, adminKey);

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      await client.saveObjects({
        indexName: GLOBAL_INDEX_NAME,
        objects: batch as unknown as Record<string, unknown>[],
      });
    }

    await client.setSettings({
      indexName: GLOBAL_INDEX_NAME,
      indexSettings: GLOBAL_INDEX_SETTINGS,
    });

    return {
      ok: true,
      index: GLOBAL_INDEX_NAME,
      totalRecords: records.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    console.error("[run-algolia-sync] error:", err);
    return { ok: false, error: message };
  }
}
