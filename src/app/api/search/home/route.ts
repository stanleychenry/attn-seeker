/**
 * Home page search: Algolia global index (all CMS collections) + OpenAI intent.
 * Returns hits with intent-based ordering (person → team first, service → services first, etc.).
 */

import { NextRequest } from "next/server";
import { searchGlobalIndex, type GlobalSearchHit } from "@/lib/algolia-server";
import { resolveIntent } from "@/lib/search-intent";

const CONTACT_PHRASES = [
  "contact",
  "get in touch",
  "talk to",
  "speak to",
  "reach out",
  "email you",
  "call you",
  "hire you",
  "work with you",
  "contact us",
  "contact you",
];

function isContactIntent(query: string): boolean {
  const lower = query.toLowerCase().trim();
  return CONTACT_PHRASES.some((p) => lower.includes(p));
}

const CONTACT_HIT: GlobalSearchHit = {
  objectID: "contact",
  contentType: "page",
  title: "Contact",
  description: "Get in touch with the team",
  url: "/agency/contact",
};

function reorderByIntent(hits: GlobalSearchHit[], intent: string | null): GlobalSearchHit[] {
  if (!intent || intent === "content") return hits;
  const contact = hits.filter((h) => h.url === "/agency/contact");
  const team = hits
    .filter((h) => h.contentType === "team")
    .sort((a, b) => ((a.sortOrder ?? 999) - (b.sortOrder ?? 999)));
  const service = hits.filter((h) => h.contentType === "service");
  const event = hits.filter((h) => h.contentType === "event");
  const rest = hits.filter(
    (h) =>
      h.url !== "/agency/contact" &&
      h.contentType !== "team" &&
      h.contentType !== "service" &&
      h.contentType !== "event"
  );
  if (intent === "contact") return [...contact, ...team, ...service, ...event, ...rest];
  if (intent === "person") return [...contact, ...team, ...service, ...event, ...rest];
  if (intent === "service") return [...contact, ...service, ...team, ...event, ...rest];
  if (intent === "event") return [...contact, ...event, ...service, ...team, ...rest];
  return hits;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query || query.length < 2) {
      return Response.json({ hits: [] });
    }

    const [intent, { hits: algoliaHits }] = await Promise.all([
      resolveIntent(query),
      searchGlobalIndex(query, 25),
    ]);

    const showContact = isContactIntent(query);
    let hits: GlobalSearchHit[] = showContact ? [CONTACT_HIT, ...algoliaHits] : [...algoliaHits];

    hits = reorderByIntent(hits, intent);

    return Response.json(
      { hits },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("[search/home] error:", err);
    return Response.json({ hits: [] }, { status: 200 });
  }
}
