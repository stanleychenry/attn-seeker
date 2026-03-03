// src/lib/webflow-mappers.ts
// Maps raw Webflow API responses to TypeScript types
// IMPORTANT: Field slugs in this file match the ACTUAL Webflow API output
// as verified by running scripts/test-webflow.js on 2026-03-01

import type {
  Team,
  Show,
  ShowEpisode,
  Podcast,
  PodcastEpisode,
  Topic,
  Event,
  EventSeries,
  Book,
  Job,
  CaseStudy,
  Service,
  YAPArticle,
} from "@/types/cms";

// ─── Helpers ────────────────────────────────────────────────

function extractImageUrl(field: unknown): string {
  if (field == null) return "";
  if (typeof field === "string") return field;
  if (typeof field !== "object") return "";
  let o = field as Record<string, unknown>;
  if (Array.isArray(o) && o.length > 0 && typeof o[0] === "object" && o[0] !== null)
    o = o[0] as Record<string, unknown>;
  const url =
    typeof o.url === "string"
      ? o.url
      : typeof o.fileUrl === "string"
        ? o.fileUrl
        : typeof o.src === "string"
          ? o.src
          : "";
  if (url) return url;
  if (o.value != null && typeof o.value === "object" && typeof (o.value as Record<string, unknown>).url === "string")
    return (o.value as { url: string }).url;
  return "";
}

function extractDate(field: unknown): string {
  if (field == null) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null) {
    const o = field as Record<string, unknown>;
    if (typeof o.value === "string") return o.value;
    if (typeof o.date === "string") return o.date;
  }
  return "";
}

/** Try multiple field slugs from Webflow (different sites may use different names). */
function extractDateFromFields(f: Record<string, unknown>, ...slugs: string[]): string {
  for (const slug of slugs) {
    const value = extractDate(f[slug]);
    if (value) return value;
  }
  return "";
}

function extractRef(field: unknown): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "id" in field)
    return String((field as { id: string }).id);
  return "";
}

function extractMultiRef(field: unknown): string[] {
  if (!field) return [];
  if (Array.isArray(field)) return field as string[];
  return [];
}

// Resolve an option hash to its label using a pre-loaded option map
// If the value isn't a hash (already readable), return as-is
// If no map provided or hash not found, return the raw value
function resolveOption(
  value: unknown,
  optionMap?: Record<string, string>,
  fallback?: string
): string {
  if (value == null) return fallback ?? "";
  const str = String(value);
  if (optionMap && optionMap[str]) return optionMap[str];
  return str;
}

// ─── Option label maps ──────────────────────────────────────
// These get populated by cms.ts before mapping, using getAllOptionLabels()
// Key = collection name, Value = Record<fieldSlug, Record<hashId, label>>
export type OptionMaps = Record<
  string,
  Record<string, Record<string, string>>
>;

// ─── Mappers ────────────────────────────────────────────────
// Each mapper takes the raw Webflow item and an optional optionMaps object.
// optionMaps is keyed by collection name, then field slug, then hash -> label.

export function mapTeam(item: {
  id: string;
  fieldData: Record<string, unknown>;
}): Team {
  const f = item.fieldData;
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    role: (f.role as string) || "",
    bio: f.bio as string | undefined,
    headshot: extractImageUrl(f.headshot),
    linkedinUrl: f["linkedin-url"] as string | undefined,
    tiktokUrl: f["tiktok-url"] as string | undefined,
    instagramUrl: f["instagram-url"] as string | undefined,
    youtubeUrl: f["youtube-url"] as string | undefined,
    sortOrder: (f["sort-order"] as number) ?? 0,
    featured: (f.featured as boolean) ?? false,
  };
}

export function mapService(item: {
  id: string;
  fieldData: Record<string, unknown>;
}): Service {
  const f = item.fieldData;
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    shortDescription: (f["short-description"] as string) ?? (f.description as string) ?? "",
    headline: f.headline as string | undefined,
    description: f.description as string | undefined,
    body: (f.body as string) ?? "",
    icon: extractImageUrl(f.icon) || undefined,
    coverImage: extractImageUrl(f["cover-image"]) || undefined,
    keyBenefits: (f["key-benefits"] as string | string[] | undefined) ?? [],
    process: (f.process as string | undefined) ?? "",
    order: (f.order as number) ?? (f["sort-order"] as number) ?? 0,
    featured: (f.featured as boolean) ?? false,
    sortOrder: (f["sort-order"] as number) ?? 0,
  };
}

export function mapCaseStudy(
  item: { id: string; fieldData: Record<string, unknown> },
  optionMaps?: OptionMaps
): CaseStudy {
  const f = item.fieldData;
  const opts = optionMaps?.["Case Studies"] ?? {};
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    clientLogo: extractImageUrl(f["client-logo"]),
    coverImage: extractImageUrl(f["cover-image"]) || undefined,
    headline: (f.headline as string) || "",
    challenge: (f.challenge as string) ?? "",
    challengeImage: extractImageUrl(f["challenge-image"]) || undefined,
    solution: (f.solution as string) ?? "",
    solutionImage: extractImageUrl(f["solution-image"]) || undefined,
    results: (f.results as string) ?? "",
    resultsImage: extractImageUrl(f["results-image"]) || undefined,
    keyStat: (f["key-stat"] as string) || "",
    keyStatLabel: (f["key-stat-label"] as string) || "",
    testimonial: (typeof f.testimonial === "object" && f.testimonial && "quote" in f.testimonial
      ? f.testimonial
      : undefined) as { quote: string; author: string; role: string } | undefined,
    testimonialAuthor: f["testimonial-author"] as string | undefined,
    featured: (f.featured as boolean) ?? false,
    featuredOrder: f["featured-order"] as number | undefined,
    region: resolveOption(f.region, opts["region"], ""),
    industry: resolveOption(f.industry, opts["industry"], ""),
    client: (resolveOption(f.client, opts["client"], "") || (f.client as string)) ?? "",
    stats: Array.isArray(f.stats) ? (f.stats as { value: string; label: string }[]).map((s) => ({ value: String(s?.value ?? ""), label: String(s?.label ?? "") })) : [],
    thumbnailUrl: extractImageUrl(f["cover-image"]) || extractImageUrl(f.thumbnail) || "",
  };
}

export function mapTopic(item: {
  id: string;
  fieldData: Record<string, unknown>;
}): Topic {
  const f = item.fieldData;
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    description: (f.description as string) || "",
    // ACTUAL SLUG: "short-descritpion" (typo in Webflow, missing "p")
    shortDescription:
      (f["short-descritpion"] as string) || (f["short-description"] as string) || undefined,
    parentTopic: extractRef(f["parent-topic"]),
    featuredImage: extractImageUrl(f["og-image"]) || undefined,
    icon: f.icon as string | undefined,
    sortOrder: (f["sort-order"] as number) ?? 0,
    isPillar: (f["is-pillar"] as boolean) ?? false,
    metaTitle: f["meta-title"] as string | undefined,
    metaDescription: f["meta-description"] as string | undefined,
    editorsPicks: extractMultiRef(f["editors-picks"] ?? f["editor-s-picks"]),
  };
}

export function mapYapArticle(
  item: { id: string; fieldData: Record<string, unknown> },
  optionMaps?: OptionMaps
): YAPArticle {
  const f = item.fieldData;
  const opts = optionMaps?.["YAP Articles"] ?? {};
  const publishDate = extractDate(f["publish-date"]);
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    author: extractRef(f["author-2"]),
    publishedDate: publishDate,
    lastUpdated: extractDate(f["last-updated"]) || undefined,
    coverImage: extractImageUrl(f["cover-image"]) || undefined,
    summary: (f.summary as string) || "",
    body: (f.body as string) || "",
    originalUrl: f["original-url"] as string | undefined,
    category: resolveOption(f.category, opts["category"], "Other"),
    featured: (f.featured as boolean) ?? false,
    primaryTopic: extractRef(f["primary-topics"]),
    secondaryTopics: extractMultiRef(f["secondary-topics"]),
    contentType: resolveOption(
      f["content-type"],
      opts["content-type"],
      "Provocation"
    ),
    audience: resolveOption(f.audience, opts["audience"], ""),
    funnelStage: resolveOption(
      f["funnel-stage"],
      opts["funnel-stage"],
      "Awareness"
    ),
    metaTitle: f["meta-title"] as string | undefined,
    metaDescription: f["meta-description"] as string | undefined,
    ogTitle: f["og-title"] as string | undefined,
    ogDescription: f["og-description"] as string | undefined,
    readingTime: (f["reading-time"] as number) ?? 5,
    seoMetaTitle: (f["meta-title"] as string) || "",
    seoMetaDescription: (f["meta-description"] as string) || "",
    editorsChoice: false,
  };
}

export function mapShow(
  item: { id: string; fieldData: Record<string, unknown> },
  optionMaps?: OptionMaps
): Show {
  const f = item.fieldData;
  const opts = optionMaps?.["Shows"] ?? {};
  const poster = extractImageUrl(f.poster ?? f["cover-image"]);
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    poster,
    shortDescription: (f["short-description"] as string) || "",
    description: (f.description as string) || "",
    youtubePlaylistId: f["youtube-playlist-id"] as string | undefined,
    category: resolveOption(f.category, opts["category"], "Other"),
    status: resolveOption(f.status, opts["status"], "Active"),
    featured: (f.featured as boolean) ?? false,
    playlistUrl: f["playlist-url"] as string | undefined,
    subscribeUrl: f["subscribe-url"] as string | undefined,
    thumbnailUrl: poster,
    platform: "",
    platformUrl: "",
    episodeCount: 0,
  };
}


export function mapShowEpisode(item: {
  id: string;
  fieldData: Record<string, unknown>;
}): ShowEpisode {
  const f = item.fieldData;
  const thumbUrl = extractImageUrl(f.thumbnail ?? f["og-image"]);
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    show: extractRef(f.show),
    episodeNumber: (f["episode-number"] as number) ?? 0,
    youtubeVideoId: (f["youtube-video-id"] as string) || "",
    publishDate: extractDate(f["publish-date"]),
    shortDescription:
      (f["short-description"] as string) || (f["og-description"] as string) || "",
    transcript: f.transcript as string | undefined,
    thumbnail: thumbUrl,
    featured: (f.featured as boolean) ?? false,
    description: "",
    videoUrl: "",
    thumbnailUrl: thumbUrl,
    publishedDate: extractDate(f["publish-date"]),
    duration: "",
  };
}

export function mapPodcast(
  item: { id: string; fieldData: Record<string, unknown> },
  optionMaps?: OptionMaps
): Podcast {
  const f = item.fieldData;
  const opts = optionMaps?.["Podcasts"] ?? {};
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    coverImage: extractImageUrl(f["cover-image"]),
    shortDescription: (f["short-description"] as string) || "",
    description: (f.description as string) ?? "",
    spotifyLink: f["spotify-link"] as string | undefined,
    // ACTUAL SLUG: "spotify-embed-code" (not "spotify-show-id")
    spotifyShowId:
      (f["spotify-embed-code"] as string) || (f["spotify-show-id"] as string) || undefined,
    category: resolveOption(f.category, opts["category"], "Other"),
    status: resolveOption(f.status, opts["status"], "Active"),
    featured: (f.featured as boolean) ?? false,
    coverUrl: extractImageUrl(f["cover-image"]),
    spotifyUrl: (f["spotify-link"] as string) || "",
    episodeCount: 0,
  };
}

// Webflow may use different field slugs for the podcast reference
function extractPodcastRefFromItem(fieldData: Record<string, unknown>): string {
  const keys = ["podcast", "podcast-ref", "show", "podcast-show"];
  for (const key of keys) {
    const ref = extractRef(fieldData[key]);
    if (ref) return ref;
  }
  return "";
}

// CMS field name can vary: "episode Number", "episode-number", "episodeNumber", or custom slug.
// Try known keys first, then any key containing both "episode" and "number".
function extractEpisodeNumber(f: Record<string, unknown> | null | undefined): number {
  if (f == null || typeof f !== "object") return 0;
  const knownKeys = ["episode Number", "episode-number", "episodeNumber", "episode_number"];
  for (const key of knownKeys) {
    const raw = f[key];
    if (raw !== undefined && raw !== null) {
      if (typeof raw === "number" && !Number.isNaN(raw)) return raw;
      if (typeof raw === "string") {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n)) return n;
      }
    }
  }
  const lowerKey = Object.keys(f).find(
    (k) => k.toLowerCase().includes("episode") && k.toLowerCase().includes("number")
  );
  if (lowerKey) {
    const raw = f[lowerKey];
    if (typeof raw === "number" && !Number.isNaN(raw)) return raw;
    if (typeof raw === "string") {
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
}

export function mapPodcastEpisode(item: {
  id: string;
  fieldData?: Record<string, unknown> | null;
}): PodcastEpisode {
  const f = item.fieldData ?? {};
  const thumbUrl = extractImageUrl(f.thumbnail ?? f["og-image"]);
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    podcast: extractPodcastRefFromItem(f),
    episodeNumber: extractEpisodeNumber(f),
    publishDate: extractDate(f["publish-date"]),
    description: (f.description as string) || (f["og-description"] as string) || "",
    spotifyEmbed: f["spotify-embed"] as string | undefined,
    thumbnail: thumbUrl,
    thumbnailUrl: thumbUrl,
    transcript: f.transcript as string | undefined,
    featured: (f.featured as boolean) ?? false,
    spotifyEmbedUrl: (f["spotify-embed"] as string) || "",
    publishedDate: extractDate(f["publish-date"]),
    duration: "",
  };
}

const EVENT_DATE_FIELD_SLUGS = [
  "start-date-time",
  "start-date",
  "date",
  "startdatetime",
  "start",
] as const;

const EVENT_END_DATE_FIELD_SLUGS = [
  "end-date-time",
  "end-date",
  "enddatetime",
  "end",
] as const;

export function mapEvent(
  item: { id: string; fieldData: Record<string, unknown> },
  optionMaps?: OptionMaps
): Event {
  const f = item.fieldData;
  const opts = optionMaps?.["Events"] ?? {};
  const startDate = extractDateFromFields(f, ...EVENT_DATE_FIELD_SLUGS);
  const endDate = extractDateFromFields(f, ...EVENT_END_DATE_FIELD_SLUGS);
  const heroImg =
    extractImageUrl(f["hero-image"]) ||
    extractImageUrl(f["cover-image"]) ||
    extractImageUrl(f["og-image"]) ||
    extractImageUrl(f.thumbnail) ||
    "";
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    eventSeries: extractRef(f["event-series"] ?? f["event-series-ref"]) || undefined,
    eventTier: resolveOption(f["event-tier"], opts["event-tier"], "Free"),
    status: resolveOption(f.status, opts["status"], "Upcoming"),
    startDateTime: startDate,
    endDateTime: endDate || undefined,
    timezoneLabel: (f["timezone-label"] ?? f["timezone"]) as string | undefined,
    venue: (f.venue as string) ?? "",
    addressMap: (f["address-map"] ?? f["address"]) as string | undefined,
    heroImage: heroImg || undefined,
    shortSummary: (f["short-summary"] ?? f.summary) as string | undefined,
    eventDescription: (f["event-description"] ?? f.description) as string | undefined,
    scheduleAgenda: f["schedule-agenda"] as string | undefined,
    speakersHosts: extractMultiRef(f["speakers-hosts"] ?? f["speakers"]),
    capacity: f.capacity as number | undefined,
    ticketsRemaining: f["tickets-remaining"] as number | undefined,
    showOnListings: (f["show-on-listings"] as boolean) ?? true,
    isOnline: (f["is-online"] as boolean) ?? false,
    priceDisplay: f["price-display"] as string | undefined,
    humanitixEventId: f["humanitix-event-id"] as string | undefined,
    recordingUrl: (f["recording-url"] ?? f["recording"]) as string | undefined,
    confirmationEmail: f["confirmation-email"] as string | undefined,
    description: ((f["event-description"] ?? f.description) as string) || "",
    date: startDate,
    location: (f.venue as string) || "",
    ticketUrl:
      (f["humanitix-ticket-url"] as string) || (f["ticket-url"] as string) || "",
    thumbnailUrl: heroImg,
    isPast: false,
    speakers: [],
  };
}

export function mapEventSeries(item: {
  id: string;
  fieldData: Record<string, unknown>;
}): EventSeries {
  const f = item.fieldData;
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    shortDescription: (f["short-description"] as string) || "",
    heroImage: extractImageUrl(
      f["hero-image"] ?? f["cover-image"] ?? f["og-image"]
    ) || undefined,
    bodyText: (f["body-text"] as string) || (f.body as string) || undefined,
    description: "",
    thumbnailUrl: "",
    eventCount: 0,
  };
}

export function mapBook(
  item: { id: string; fieldData: Record<string, unknown> },
  optionMaps?: OptionMaps
): Book {
  const f = item.fieldData;
  const opts = optionMaps?.["Books"] ?? {};
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    subtitle: f.subtitle as string | undefined,
    status: resolveOption(f.status, opts["status"], "Released"),
    coverImage: extractImageUrl(f["cover-image"]),
    description: (f.description as string) ?? "",
    // ACTUAL SLUG: "exerpt" (typo in Webflow, missing "c")
    excerpt: (f["exerpt"] as string) || (f.excerpt as string) || undefined,
    releaseDate: extractDate(f["release-date"]) || undefined,
    primaryCtaLabel: f["primary-cta-label"] as string | undefined,
    primaryCtaLink: f["primary-cta-link"] as string | undefined,
    pressKitUrl: f["press-kit-url"] as string | undefined,
    // ACTUAL SLUG: "author-s" (not "authors")
    authors: extractMultiRef(f["author-s"]),
    publisher: f.publisher as string | undefined,
    isbn: f.isbn as string | undefined,
    author: (f.publisher as string) || "",
    coverUrl: extractImageUrl(f["cover-image"]),
    buyUrl: (f["primary-cta-link"] as string) || "",
    recommendedBy: {} as import("@/types/cms").TeamMember,
  };
}

export function mapJob(
  item: { id: string; fieldData: Record<string, unknown> },
  optionMaps?: OptionMaps
): Job {
  const f = item.fieldData;
  const opts = optionMaps?.["Jobs"] ?? {};
  return {
    id: item.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    department: resolveOption(f.department, opts["department"], ""),
    location: resolveOption(f.location, opts["location"], ""),
    employmentType: resolveOption(
      f["employment-type"],
      opts["employment-type"],
      ""
    ),
    description: (f.description as string) ?? "",
    applyLink: f["apply-link"] as string | undefined,
    closingDate: extractDate(f["closing-date"]) || undefined,
    open: (f.open as boolean) ?? true,
    customQuestion1: f["custom-question-1"] as string | undefined,
    customQuestion2: f["custom-question-2"] as string | undefined,
    customQuestion3: f["custom-question-3"] as string | undefined,
    customQuestion4: f["custom-question-4"] as string | undefined,
    customQuestion5: f["custom-question-5"] as string | undefined,
    type: resolveOption(f["employment-type"], opts["employment-type"], ""),
    requirements: (f.requirements as string)
      ? [(f.requirements as string)]
      : [],
    niceToHave: [],
    publishedDate: extractDate(f["closing-date"]) || "",
    isOpen: (f.open as boolean) ?? true,
  };
}
