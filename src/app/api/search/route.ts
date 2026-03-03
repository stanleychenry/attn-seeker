import { NextRequest } from "next/server";
import {
  getServices,
  getCaseStudies,
  getTopics,
  getYapArticles,
  getShows,
  getPodcasts,
  getEvents,
  getTeams,
  getBooks,
} from "@/lib/cms";
import type { SearchResult } from "@/types/search";

const FIELDS_TO_MATCH = ["name", "title", "description", "summary", "headline", "shortDescription", "body"];

function matchQuery(item: Record<string, unknown>, q: string): boolean {
  const lower = q.toLowerCase();
  for (const key of FIELDS_TO_MATCH) {
    const val = item[key];
    if (typeof val === "string" && val.toLowerCase().includes(lower)) return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query || query.length < 2) {
      return Response.json({ results: [] }, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }

    const [
      services,
      caseStudies,
      topics,
      articles,
      shows,
      podcasts,
      events,
      teams,
      books,
    ] = await Promise.all([
      getServices().catch(() => []),
      getCaseStudies().catch(() => []),
      getTopics().catch(() => []),
      getYapArticles().catch(() => []),
      getShows().catch(() => []),
      getPodcasts().catch(() => []),
      getEvents().catch(() => []),
      getTeams().catch(() => []),
      getBooks().catch(() => []),
    ]);

    const results: SearchResult[] = [];

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
    for (const a of articles) {
      if (matchQuery(a as unknown as Record<string, unknown>, query)) {
        results.push({
          type: "article",
          title: a.name,
          description: a.summary || "",
          url: `/yap-articles/${a.slug}`,
          thumbnailUrl: a.coverImage || a.thumbnailUrl,
        });
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
