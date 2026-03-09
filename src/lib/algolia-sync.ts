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
  /** Natural language phrases so queries like "help with TikTok" match services */
  keywords?: string;
  url: string;
  thumbnailUrl?: string;
  /** Extra for display (e.g. reading time) */
  meta?: string;
  /** Team only: display order (lower = first) */
  sortOrder?: number;
  /** Used by customRanking to surface high-value content types first */
  contentTypePriority: number;
}

const CONTENT_TYPE_PRIORITY: Record<string, number> = {
  service: 100,
  "case-study": 90,
  team: 80,
  event: 70,
  show: 60,
  podcast: 60,
  "show-episode": 50,
  "podcast-episode": 50,
  article: 40,
  topic: 30,
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 500);
}

/**
 * Build rich natural-language keyword phrases for services so queries like
 * "help with TikTok" or "manage my Instagram" match the right service.
 */
function serviceKeywords(name: string, description: string): string {
  const nameLower = name.toLowerCase();
  const descLower = description.toLowerCase();
  const phrases: string[] = [name, description];

  // Universal agency phrases — always included
  phrases.push(
    "help with social media",
    "social media agency",
    "hire an agency",
    "need an agency",
    "organic social media",
    "social media help",
    "I need help with my social media",
    "manage my social media",
    "run my social",
    "what do you offer",
    "what services do you have",
    "how can you help me",
    "what does the attention seeker do"
  );

  // LinkedIn
  if (nameLower.includes("linkedin") || descLower.includes("linkedin")) {
    phrases.push(
      "help with linkedin",
      "linkedin content",
      "grow my linkedin",
      "write my linkedin posts",
      "linkedin ghostwriter",
      "linkedin strategy",
      "linkedin management",
      "professional content",
      "write for me on linkedin",
      "linkedin visibility",
      "linkedin posts"
    );
  }

  // For general social media services, add ALL platform phrases —
  // "Social Media Management" handles TikTok, Instagram, etc. even if not named explicitly
  const isGeneralSocialService =
    nameLower.includes("social media") ||
    (nameLower.includes("management") && !nameLower.includes("community")) ||
    nameLower.includes("strategy");

  // TikTok
  if (nameLower.includes("tiktok") || descLower.includes("tiktok") || isGeneralSocialService) {
    phrases.push(
      "help with tiktok",
      "tiktok strategy",
      "grow my tiktok",
      "tiktok management",
      "tiktok content",
      "tiktok agency",
      "I need help with tiktok",
      "tiktok marketing"
    );
  }

  // Instagram
  if (nameLower.includes("instagram") || descLower.includes("instagram") || isGeneralSocialService) {
    phrases.push(
      "help with instagram",
      "instagram strategy",
      "grow my instagram",
      "instagram management",
      "instagram content",
      "instagram marketing"
    );
  }

  // Facebook
  if (isGeneralSocialService) {
    phrases.push(
      "help with facebook",
      "facebook management",
      "facebook content",
      "grow my facebook"
    );
  }

  // Community
  if (nameLower.includes("community")) {
    phrases.push(
      "manage my comments",
      "reply to comments",
      "engage with followers",
      "comment management",
      "grow my community",
      "manage my followers",
      "community engagement",
      "respond to dms",
      "follower engagement"
    );
  }

  // Content creation
  if (nameLower.includes("content creation") || nameLower.includes("content creator")) {
    phrases.push(
      "create content for me",
      "content creator",
      "need videos",
      "video production",
      "create videos",
      "content for social media",
      "make content",
      "need a content creator",
      "photography",
      "copywriting"
    );
  }

  // Strategy
  if (nameLower.includes("strategy")) {
    phrases.push(
      "social media strategy",
      "social strategy",
      "grow organically",
      "content strategy",
      "social media roadmap",
      "social media plan",
      "how to grow on social media",
      "organic growth strategy"
    );
  }

  // Advertising / newsletter sponsorship
  if (nameLower.includes("advertise") || nameLower.includes("sponsor")) {
    phrases.push(
      "advertise with you",
      "sponsor your newsletter",
      "newsletter advertising",
      "newsletter sponsorship",
      "promote my brand",
      "put my brand in front",
      "newsletter ads",
      "inbox advertising"
    );
  }

  // Social media management (general)
  if (nameLower.includes("management") && !nameLower.includes("community")) {
    phrases.push(
      "manage my socials",
      "social media manager",
      "run my social media",
      "help me manage",
      "social media management",
      "manage my accounts",
      "take over my social media",
      "social media for my business"
    );
  }

  return Array.from(new Set(phrases)).join(" ");
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
      contentTypePriority: CONTENT_TYPE_PRIORITY.article,
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
      contentTypePriority: CONTENT_TYPE_PRIORITY.service,
    });
  }

  for (const c of params.caseStudies) {
    records.push({
      objectID: `case-study_${c.id}`,
      contentType: "case-study",
      title: c.name,
      description: c.headline || "",
      keywords: [
        c.name,
        c.headline || "",
        "case study",
        "work we've done",
        "client results",
        "portfolio",
        "proof",
        "success story",
        "what have you done",
        "clients",
        "results",
      ].join(" "),
      url: `/agency/work/${c.slug}`,
      thumbnailUrl: c.coverImage || c.clientLogo,
      contentTypePriority: CONTENT_TYPE_PRIORITY["case-study"],
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
      keywords: `${e.name} watch video episode show`,
      url: `/shows/${showSlug}/${e.slug}`,
      thumbnailUrl: e.thumbnailUrl || e.thumbnail,
      contentTypePriority: CONTENT_TYPE_PRIORITY["show-episode"],
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
      keywords: `${e.name} listen podcast episode audio`,
      url: `/podcasts/${podcastSlug}/${e.slug}`,
      thumbnailUrl: e.thumbnailUrl || e.thumbnail,
      contentTypePriority: CONTENT_TYPE_PRIORITY["podcast-episode"],
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
      "meet the team",
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
      contentTypePriority: CONTENT_TYPE_PRIORITY.team,
    });
  }

  for (const e of params.events) {
    records.push({
      objectID: `event_${e.id}`,
      contentType: "event",
      title: e.name,
      description: e.shortSummary || e.shortDescription || (e.description ?? "").slice(0, 500) || "",
      keywords: "events event what's on upcoming what events do you have workshop webinar attend",
      url: `/events/${e.slug}`,
      thumbnailUrl: e.heroImage || e.thumbnailUrl,
      contentTypePriority: CONTENT_TYPE_PRIORITY.event,
    });
  }

  for (const s of params.shows) {
    records.push({
      objectID: `show_${s.id}`,
      contentType: "show",
      title: s.name,
      description: s.shortDescription || s.description || "",
      keywords: "shows show video series what shows do you have watch",
      url: `/shows/${s.slug}`,
      thumbnailUrl: s.poster || s.thumbnailUrl,
      contentTypePriority: CONTENT_TYPE_PRIORITY.show,
    });
  }

  for (const p of params.podcasts) {
    records.push({
      objectID: `podcast_${p.id}`,
      contentType: "podcast",
      title: p.name,
      description: p.shortDescription || p.description || "",
      keywords: "podcasts podcast listen series what podcasts do you have audio",
      url: `/podcasts/${p.slug}`,
      thumbnailUrl: p.coverImage || p.coverUrl,
      contentTypePriority: CONTENT_TYPE_PRIORITY.podcast,
    });
  }

  for (const t of params.topics) {
    records.push({
      objectID: `topic_${t.id}`,
      contentType: "topic",
      title: t.name,
      description: (t.shortDescription || t.description || "").slice(0, 500),
      keywords: `${t.name} topic learn read articles`,
      url: `/learn/${t.slug}`,
      thumbnailUrl: t.featuredImage,
      contentTypePriority: CONTENT_TYPE_PRIORITY.topic,
    });
  }

  return records;
}

export const GLOBAL_INDEX_SETTINGS = {
  searchableAttributes: [
    "title",
    "keywords",
    "description",
  ],
  customRanking: ["desc(contentTypePriority)"],
  attributesForFaceting: ["contentType"],
  queryLanguages: ["en" as const],
  removeStopWords: true,
  ignorePlurals: true,
};
