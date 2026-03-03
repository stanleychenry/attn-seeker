/**
 * Debug endpoint: see why a podcast (e.g. Stansplaining) shows 0 episodes.
 * GET /api/debug/podcast-episodes?slug=stansplaining
 * Returns JSON with podcast ID, raw episode refs, and ref ID counts.
 */
import { NextRequest } from "next/server";
import { getCollectionItems } from "@/lib/webflow";

function extractRef(val: unknown): string | null {
  if (val == null) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null && "id" in val)
    return String((val as { id: string }).id);
  return null;
}

function getEpisodeRef(fieldData: Record<string, unknown>): { refId: string | null; field: string; raw: unknown } {
  const keys = ["podcast", "podcast-ref", "show", "podcast-show"];
  for (const k of keys) {
    const raw = fieldData[k];
    const refId = extractRef(raw);
    if (refId) return { refId, field: k, raw };
  }
  return { refId: null, field: "", raw: undefined };
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "stansplaining";

  try {
    const [podcastItems, episodeItems] = await Promise.all([
      getCollectionItems("Podcasts"),
      getCollectionItems("Podcast Episodes"),
    ]);

    const podcast = podcastItems.find(
      (p) => (p.fieldData?.slug as string)?.toLowerCase() === slug.toLowerCase()
    );

    // All field keys on first episode (so we see actual Webflow field names)
    const firstEpisode = episodeItems[0];
    const episodeFieldKeys = firstEpisode
      ? Object.keys(firstEpisode.fieldData || {}).sort()
      : [];

    // Sample: first 8 episodes with ref + any field that could be episode number
    const episodeRefSamples = episodeItems.slice(0, 8).map((ep) => {
      const fd = ep.fieldData || {};
      const { refId, field, raw } = getEpisodeRef(fd);
      const episodeNumberCandidates: Record<string, unknown> = {};
      for (const k of Object.keys(fd)) {
        const lower = k.toLowerCase();
        if (lower.includes("episode") && lower.includes("number")) episodeNumberCandidates[k] = fd[k];
        if (lower === "episode-number" || lower === "episode number" || k === "episodeNumber") episodeNumberCandidates[k] = fd[k];
      }
      return {
        name: (fd.name as string) || ep.id,
        slug: fd.slug,
        refField: field,
        refRaw: raw,
        refId,
        episodeNumberFields: Object.keys(episodeNumberCandidates).length ? episodeNumberCandidates : "none found",
      };
    });

    // Count episodes per ref ID (using all possible ref fields)
    const refIdCounts: Record<string, number> = {};
    let noRef = 0;
    for (const ep of episodeItems) {
      const { refId } = getEpisodeRef(ep.fieldData || {});
      if (!refId) {
        noRef++;
        continue;
      }
      refIdCounts[refId] = (refIdCounts[refId] || 0) + 1;
    }

    const podcastId = podcast?.id ?? null;
    const matchingCount = podcastId ? refIdCounts[podcastId] ?? 0 : 0;

    return Response.json(
      {
        slug,
        podcast: podcast
          ? {
              id: podcast.id,
              name: podcast.fieldData?.name,
              slug: podcast.fieldData?.slug,
            }
          : null,
        totalEpisodesInCms: episodeItems.length,
        episodeFieldKeysInWebflow: episodeFieldKeys,
        refIdCounts: Object.entries(refIdCounts).map(([id, count]) => ({ id, count })),
        episodesWithNoRef: noRef,
        matchingEpisodeCount: matchingCount,
        episodeRefSamples,
        hint: !podcast
          ? `No podcast found with slug "${slug}". Check slug in Webflow.`
          : matchingCount === 0
            ? "Episodes in CMS do not reference this podcast's ID. Compare podcast.id above with the ids in refIdCounts."
            : `Found ${matchingCount} episode(s) for this podcast.`,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json(
      { error: message, slug },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
