/**
 * Syncs all CMS content into the Algolia global search index (attn_seeker_global).
 * Run once after deploy or when CMS content changes. Requires ALGOLIA_ADMIN_KEY.
 *
 * Call: POST /api/admin/sync-search
 * Optional: Header "Authorization: Bearer <SYNC_SECRET>" if SYNC_SECRET is set (recommended in production).
 */

import { NextRequest } from "next/server";
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

export async function POST(request: NextRequest) {
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  const syncSecret = process.env.SYNC_SECRET;
  if (!adminKey) {
    return Response.json(
      { error: "ALGOLIA_ADMIN_KEY is not set" },
      { status: 500 }
    );
  }
  if (syncSecret) {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token !== syncSecret) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
  if (!appId) {
    return Response.json(
      { error: "NEXT_PUBLIC_ALGOLIA_APP_ID is not set" },
      { status: 500 }
    );
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
        objects: batch,
      });
    }

    await client.setSettings({
      indexName: GLOBAL_INDEX_NAME,
      indexSettings: GLOBAL_INDEX_SETTINGS,
    });

    return Response.json({
      ok: true,
      index: GLOBAL_INDEX_NAME,
      totalRecords: records.length,
    });
  } catch (err) {
    console.error("[sync-search] error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
