/**
 * Builds unified Algolia records for the global search index (attn_seeker_global).
 * Used by the sync API to push all CMS content into one index for lightning-fast client-side search.
 */

import type {
  YAPArticle,
  Service,
  CaseStudy,
  ShowEpisode,
  PodcastEpisode,
  Team,
  Event,
  Show,
  Podcast,
  Topic,
} from "@/types/cms";

export const GLOBAL_INDEX_NAME = "attn_seeker_global";

export interface GlobalSearchRecord {
  objectID: string;
  contentType: string;
  title: string;
  description: string;
  /** Extra phrases so natural language queries match (e.g. "help socials", "events what's on") */
  keywords?: string;
  url: string;
  thumbnailUrl?: string;
  /** Extra for display (e.g. topic name, reading time) */
  meta?: string;
  /** Team only: display order (lower = first). Used by front-end to sort team hits. */
  sortOrder?: number;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 500);
}

/** Build keywords so natural-language queries match (e.g. "help with socials" -> services) */
function serviceKeywords(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();
  const terms = ["help", "socials", "social media", "tiktok", "instagram", "linkedin", "organic", "strategy", "content", "manage"];
  const extra = terms.filter((t) => text.includes(t) || name.toLowerCase().includes(t));
  return [...new Set([name, description, ...extra])].join(" ");
}

export function buildGlobalSearchRecords(params: {
  articles: YAPArticle[];
  services: Service[];
  caseStudies: CaseStudy[];
  showEpisodes: ShowEpisode[];
  podcastEpisodes: PodcastEpisode[];
  teams: Team[];
  events: Event[];
  shows: Show[];
  podcasts: Podcast[];
  topics: Topic[];
}): GlobalSearchRecord[] {
  const records: GlobalSearchRecord[] = [];
  const showIdToSlug = new Map<string, string>();
  const podcastIdToSlug = new Map<string, string>();
  for (const s of params.shows) showIdToSlug.set(s.id, s.slug);
  for (const p of params.podcasts) podcastIdToSlug.set(p.id, p.slug);

  for (const a of params.articles) {
    records.push({
      objectID: `article_${a.id}`,
      contentType: "article",
      title: a.name,
      description: a.summary ? stripHtml(a.summary) : "",
      url: `/yap-articles/${a.slug}`,
      thumbnailUrl: a.coverImage || a.thumbnailUrl,
      meta: a.readingTime ? `${a.readingTime} min read` : undefined,
    });
  }

  for (const s of params.services) {
    records.push({
      objectID: `service_${s.id}`,
      contentType: "service",
      title: s.name,
      description: s.shortDescription || (s.description ?? ""),
      keywords: serviceKeywords(s.name, s.shortDescription || s.description || ""),
      url: `/agency/services/${s.slug}`,
      thumbnailUrl: s.coverImage,
    });
  }

  for (const c of params.caseStudies) {
    records.push({
      objectID: `case-study_${c.id}`,
      contentType: "case-study",
      title: c.name,
      description: c.headline || "",
      url: `/agency/work/${c.slug}`,
      thumbnailUrl: c.coverImage || c.clientLogo,
    });
  }

  for (const e of params.showEpisodes) {
    const showId = typeof e.show === "string" ? e.show : e.show?.id;
    const showSlug = showId ? showIdToSlug.get(showId) : undefined;
    if (!showSlug) continue;
    records.push({
      objectID: `show-episode_${e.id}`,
      contentType: "show-episode",
      title: e.name,
      description: e.shortDescription || e.description || "",
      url: `/shows/${showSlug}/${e.slug}`,
      thumbnailUrl: e.thumbnailUrl || e.thumbnail,
    });
  }

  for (const e of params.podcastEpisodes) {
    const podcastId = typeof e.podcast === "string" ? e.podcast : e.podcast?.id;
    const podcastSlug = podcastId ? podcastIdToSlug.get(podcastId) : undefined;
    if (!podcastSlug) continue;
    records.push({
      objectID: `podcast-episode_${e.id}`,
      contentType: "podcast-episode",
      title: e.name,
      description: e.description || "",
      url: `/podcasts/${podcastSlug}/${e.slug}`,
      thumbnailUrl: e.thumbnailUrl || e.thumbnail,
    });
  }

  for (const t of params.teams) {
    const name = t.name || "";
    const role = (t.role || "").slice(0, 200);
    const keywords = [
      "who works at the attention seeker",
      "staff",
      "team",
      "people",
      "who is " + name.toLowerCase(),
      name.toLowerCase(),
      role,
    ].filter(Boolean).join(" ");
    records.push({
      objectID: `team_${t.id}`,
      contentType: "team",
      title: name,
      description: (t.role || t.bio || "").slice(0, 500),
      keywords,
      url: `/agency/team/${t.slug}`,
      thumbnailUrl: t.headshot,
      sortOrder: t.sortOrder ?? 999,
    });
  }

  for (const e of params.events) {
    records.push({
      objectID: `event_${e.id}`,
      contentType: "event",
      title: e.name,
      description: e.shortSummary || e.shortDescription || (e.description ?? "").slice(0, 500) || "",
      keywords: "events event what's on upcoming what events do you have",
      url: `/events/${e.slug}`,
      thumbnailUrl: e.heroImage || e.thumbnailUrl,
    });
  }

  for (const s of params.shows) {
    records.push({
      objectID: `show_${s.id}`,
      contentType: "show",
      title: s.name,
      description: s.shortDescription || s.description || "",
      keywords: "shows show video series what shows do you have",
      url: `/shows/${s.slug}`,
      thumbnailUrl: s.poster || s.thumbnailUrl,
    });
  }

  for (const p of params.podcasts) {
    records.push({
      objectID: `podcast_${p.id}`,
      contentType: "podcast",
      title: p.name,
      description: p.shortDescription || p.description || "",
      keywords: "podcasts podcast listen series what podcasts do you have",
      url: `/podcasts/${p.slug}`,
      thumbnailUrl: p.coverImage || p.coverUrl,
    });
  }

  for (const t of params.topics) {
    records.push({
      objectID: `topic_${t.id}`,
      contentType: "topic",
      title: t.name,
      description: (t.shortDescription || t.description || "").slice(0, 500),
      url: `/learn/${t.slug}`,
      thumbnailUrl: t.featuredImage,
    });
  }

  return records;
}

export const GLOBAL_INDEX_SETTINGS = {
  searchableAttributes: ["title", "description", "keywords"],
  attributesForFaceting: ["contentType"],
  // Plurals/synonyms: in Algolia dashboard add synonym "socials" -> "social", "podcasts" -> "podcast", "events" -> "event" for better matching.
  // Enable Semantic Search / NeuralSearch in dashboard if your plan supports it.
};
