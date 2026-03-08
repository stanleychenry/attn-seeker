import { NextRequest } from "next/server";
import {
  getServices,
  getCaseStudies,
  getTopics,
  getShows,
  getPodcasts,
  getShowEpisodes,
  getPodcastEpisodes,
  getEvents,
  getTeams,
  getBooks,
} from "@/lib/cms";
import { searchYapArticles } from "@/lib/algolia-server";
import { resolveIntent } from "@/lib/search-intent";
import type { SearchResult } from "@/types/search";
import type { Show } from "@/types/cms";
import type { Podcast } from "@/types/cms";

const FIELDS_TO_MATCH = [
  "name",
  "title",
  "description",
  "summary",
  "headline",
  "shortDescription",
  "body",
  "transcript",
];

function matchQuery(item: Record<string, unknown>, q: string): boolean {
  const lower = q.toLowerCase();
  for (const key of FIELDS_TO_MATCH) {
    const val = item[key];
    if (typeof val === "string" && val.toLowerCase().includes(lower)) return true;
  }
  return false;
}

const CONTACT_RESULT: SearchResult = {
  type: "page",
  title: "Contact",
  description: "Get in touch with the team",
  url: "/agency/contact",
  reason: "Get in touch with the team",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query || query.length < 2) {
      return Response.json(
        { results: [] },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }

    const [intent, algoliaArticles, services, caseStudies, topics, showEpisodes, podcastEpisodes, shows, podcasts, events, teams, books] =
      await Promise.all([
        resolveIntent(query),
        searchYapArticles(query, 15),
        getServices().catch(() => []),
        getCaseStudies().catch(() => []),
        getTopics().catch(() => []),
        getShowEpisodes().catch(() => []),
        getPodcastEpisodes().catch(() => []),
        getShows().catch(() => []),
        getPodcasts().catch(() => []),
        getEvents().catch(() => []),
        getTeams().catch(() => []),
        getBooks().catch(() => []),
      ]);

    const showIdToSlug = new Map<string, string>();
    for (const s of shows) {
      showIdToSlug.set(s.id, s.slug);
    }
    const podcastIdToSlug = new Map<string, string>();
    for (const p of podcasts) {
      podcastIdToSlug.set(p.id, p.slug);
    }

    const results: SearchResult[] = [];

    if (intent === "contact") {
      results.push(CONTACT_RESULT);
    }

    for (const hit of algoliaArticles) {
      const slug = hit.slug ?? hit.objectID;
      const title = (hit.title ?? hit.name) as string;
      results.push({
        type: "article",
        title: title || "Article",
        description: (hit.summary as string) || "",
        url: `/yap-articles/${slug}`,
        thumbnailUrl: hit.thumbnail_url as string | undefined,
      });
    }

    for (const s of services) {
      if (matchQuery(s as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "service",
          title: s.name,
          description: s.shortDescription || "",
          url: `/agency/services/${s.slug}`,
          thumbnailUrl: s.coverImage,
        });
      }
    }
    for (const c of caseStudies) {
      if (matchQuery(c as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "case-study",
          title: c.name,
          description: c.headline || "",
          url: `/agency/work/${c.slug}`,
          thumbnailUrl: c.coverImage || c.clientLogo,
        });
      }
    }
    for (const t of topics) {
      if (matchQuery(t as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "topic",
          title: t.name,
          description: (t.description || t.shortDescription || "") as string,
          url: `/learn/${t.slug}`,
          thumbnailUrl: t.featuredImage,
        });
      }
    }
    for (const e of showEpisodes) {
      if (matchQuery(e as unknown as Record<string, unknown>, query)) {
        const showSlug =
          typeof e.show === "object" && e.show && "slug" in e.show
            ? (e.show as Show).slug
            : showIdToSlug.get(typeof e.show === "string" ? e.show : (e.show as Show)?.id ?? "");
        if (showSlug) {
          results.push({
            type: "show-episode",
            title: e.name,
            description: e.shortDescription || e.description || "",
            url: `/shows/${showSlug}/${e.slug}`,
            thumbnailUrl: e.thumbnailUrl || e.thumbnail,
          });
        }
      }
    }
    for (const e of podcastEpisodes) {
      if (matchQuery(e as unknown as Record<string, unknown>, query)) {
        const podcastSlug =
          typeof e.podcast === "object" && e.podcast && "slug" in e.podcast
            ? (e.podcast as Podcast).slug
            : podcastIdToSlug.get(typeof e.podcast === "string" ? e.podcast : (e.podcast as Podcast)?.id ?? "");
        if (podcastSlug) {
          results.push({
            type: "podcast-episode",
            title: e.name,
            description: e.description || "",
            url: `/podcasts/${podcastSlug}/${e.slug}`,
            thumbnailUrl: e.thumbnailUrl || e.thumbnail,
          });
        }
      }
    }
    for (const s of shows) {
      if (matchQuery(s as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "show",
          title: s.name,
          description: s.shortDescription || s.description || "",
          url: `/shows/${s.slug}`,
          thumbnailUrl: s.poster || s.thumbnailUrl,
        });
      }
    }
    for (const p of podcasts) {
      if (matchQuery(p as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "podcast",
          title: p.name,
          description: p.shortDescription || p.description || "",
          url: `/podcasts/${p.slug}`,
          thumbnailUrl: p.coverImage || p.coverUrl,
        });
      }
    }
    for (const e of events) {
      if (matchQuery(e as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "event",
          title: e.name,
          description: e.shortSummary || e.shortDescription || e.description || "",
          url: `/events/${e.slug}`,
          thumbnailUrl: e.heroImage || e.thumbnailUrl,
        });
      }
    }
    for (const t of teams) {
      if (matchQuery(t as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "team",
          title: t.name,
          description: (t.role || t.bio || "") as string,
          url: `/agency/team/${t.slug}`,
          thumbnailUrl: t.headshot,
        });
      }
    }
    for (const b of books) {
      if (matchQuery(b as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "page",
          title: b.name,
          description: (b.description || b.excerpt || "") as string,
          url: `/books/${b.slug}`,
          thumbnailUrl: b.coverImage || b.coverUrl,
        });
      }
    }

    if (intent === "service") {
      results.sort((a, b) => {
        const aService = a.type === "service" ? 1 : 0;
        const bService = b.type === "service" ? 1 : 0;
        return bService - aService;
      });
    }

    return Response.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("Search API error:", err);
    return Response.json({ results: [] }, { status: 200 });
  }
}
