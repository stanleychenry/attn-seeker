import {
  getCollectionItems,
  getCollectionItemBySlug,
  getCollectionSlugs,
  getAllOptionLabels,
} from "./webflow";
import type { OptionMaps } from "./webflow-mappers";
import {
  mapTeam,
  mapService,
  mapCaseStudy,
  mapTopic,
  mapYapArticle,
  mapShow,
  mapShowEpisode,
  mapPodcast,
  mapPodcastEpisode,
  mapEvent,
  mapEventSeries,
  mapBook,
  mapJob,
} from "./webflow-mappers";
import type {
  Team,
  Service,
  CaseStudy,
  Topic,
  YAPArticle,
  Show,
  ShowEpisode,
  Podcast,
  PodcastEpisode,
  Event,
  EventSeries,
  Book,
  Job,
} from "@/types/cms";

// Cache for option maps (loaded once per build)
let optionMapsCache: OptionMaps | null = null;

async function loadOptionMaps(): Promise<OptionMaps> {
  if (optionMapsCache) return optionMapsCache;

  const [yapOpts, caseStudyOpts, showOpts, podcastOpts, eventOpts, bookOpts, jobOpts] =
    await Promise.all([
      getAllOptionLabels("YAP Articles"),
      getAllOptionLabels("Case Studies"),
      getAllOptionLabels("Shows"),
      getAllOptionLabels("Podcasts"),
      getAllOptionLabels("Events"),
      getAllOptionLabels("Books"),
      getAllOptionLabels("Jobs"),
    ]);

  optionMapsCache = {
    "YAP Articles": yapOpts,
    "Case Studies": caseStudyOpts,
    Shows: showOpts,
    Podcasts: podcastOpts,
    Events: eventOpts,
    Books: bookOpts,
    Jobs: jobOpts,
  };

  return optionMapsCache;
}

// ─── Teams (no option fields) ───────────────────────────────
export async function getTeams(): Promise<Team[]> {
  const items = await getCollectionItems("Teams");
  return items.map((item) => mapTeam(item as { id: string; fieldData: Record<string, unknown> }));
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  const item = await getCollectionItemBySlug("Teams", slug);
  return item ? mapTeam(item as { id: string; fieldData: Record<string, unknown> }) : null;
}

export async function getTeamById(id: string): Promise<Team | null> {
  const teams = await getTeams();
  return teams.find((t) => t.id === id) ?? null;
}

export async function getTeamSlugs(): Promise<string[]> {
  return getCollectionSlugs("Teams");
}

// ─── Services (no option fields) ─────────────────────────────
export async function getServices(): Promise<Service[]> {
  const items = await getCollectionItems("Services");
  return items.map((item) => mapService(item as { id: string; fieldData: Record<string, unknown> }));
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const item = await getCollectionItemBySlug("Services", slug);
  return item ? mapService(item as { id: string; fieldData: Record<string, unknown> }) : null;
}

export async function getServiceSlugs(): Promise<string[]> {
  return getCollectionSlugs("Services");
}

// ─── Case Studies (option fields) ─────────────────────────────
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const [items, optionMaps] = await Promise.all([
    getCollectionItems("Case Studies"),
    loadOptionMaps(),
  ]);
  return items.map((item) =>
    mapCaseStudy(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
  );
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const [item, optionMaps] = await Promise.all([
    getCollectionItemBySlug("Case Studies", slug),
    loadOptionMaps(),
  ]);
  return item
    ? mapCaseStudy(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
    : null;
}

export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const all = await getCaseStudies();
  return all.filter((c) => c.featured).sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

export async function getCaseStudySlugs(): Promise<string[]> {
  return getCollectionSlugs("Case Studies");
}

// ─── Topics (no option fields) ───────────────────────────────
export async function getTopics(): Promise<Topic[]> {
  const items = await getCollectionItems("Topics");
  return items.map((item) => mapTopic(item as { id: string; fieldData: Record<string, unknown> }));
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const item = await getCollectionItemBySlug("Topics", slug);
  return item ? mapTopic(item as { id: string; fieldData: Record<string, unknown> }) : null;
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const topics = await getTopics();
  return topics.find((t) => t.id === id) ?? null;
}

export async function getTopicSlugs(): Promise<string[]> {
  return getCollectionSlugs("Topics");
}

export async function getPillarTopics(): Promise<Topic[]> {
  const topics = await getTopics();
  return topics.filter((t) => t.isPillar);
}

export async function getSubTopics(parentTopicId: string): Promise<Topic[]> {
  const topics = await getTopics();
  return topics.filter(
    (t) => (typeof t.parentTopic === "string" && t.parentTopic === parentTopicId) || (t.parentTopic && typeof t.parentTopic === "object" && t.parentTopic.id === parentTopicId)
  );
}

// ─── YAP Articles (option fields) ────────────────────────────
export async function getYapArticles(): Promise<YAPArticle[]> {
  const [items, optionMaps] = await Promise.all([
    getCollectionItems("YAP Articles"),
    loadOptionMaps(),
  ]);
  return items.map((item) =>
    mapYapArticle(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
  );
}

export async function getYapArticleBySlug(slug: string): Promise<YAPArticle | null> {
  const [item, optionMaps] = await Promise.all([
    getCollectionItemBySlug("YAP Articles", slug),
    loadOptionMaps(),
  ]);
  return item
    ? mapYapArticle(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
    : null;
}

export async function getYapArticleSlugs(): Promise<string[]> {
  return getCollectionSlugs("YAP Articles");
}

export async function getArticlesByTopic(topicSlug: string): Promise<YAPArticle[]> {
  const topic = await getTopicBySlug(topicSlug);
  if (!topic) return [];
  return getArticlesByTopicId(topic.id);
}

export async function getArticlesByTopicId(topicId: string): Promise<YAPArticle[]> {
  const all = await getYapArticles();
  return all.filter((a) => {
    const pt = a.primaryTopic;
    const primaryMatch =
      pt === topicId ||
      (typeof pt === "object" && pt?.id === topicId);
    const secondaryMatch = Array.isArray(a.secondaryTopics) &&
      a.secondaryTopics.some(
        (t) => (typeof t === "string" ? t : (t as { id?: string }).id) === topicId
      );
    return primaryMatch || secondaryMatch;
  });
}

export async function getFeaturedArticles(): Promise<YAPArticle[]> {
  const all = await getYapArticles();
  return all.filter((a) => a.featured);
}

// ─── Shows (option fields) ───────────────────────────────────
export async function getShows(): Promise<Show[]> {
  const [items, optionMaps] = await Promise.all([
    getCollectionItems("Shows"),
    loadOptionMaps(),
  ]);
  return items.map((item) =>
    mapShow(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
  );
}

export async function getShowBySlug(slug: string): Promise<Show | null> {
  const [item, optionMaps] = await Promise.all([
    getCollectionItemBySlug("Shows", slug),
    loadOptionMaps(),
  ]);
  return item
    ? mapShow(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
    : null;
}

// ─── Show Episodes (no option fields) ────────────────────────
export async function getShowEpisodes(): Promise<ShowEpisode[]> {
  const items = await getCollectionItems("Show Episodes");
  return items.map((item) =>
    mapShowEpisode(item as { id: string; fieldData: Record<string, unknown> })
  );
}

export async function getShowEpisodeBySlug(
  showSlug: string,
  episodeSlug: string
): Promise<ShowEpisode | null> {
  const show = await getShowBySlug(showSlug);
  if (!show) return null;
  const items = await getCollectionItems("Show Episodes");
  const episode = items.find(
    (i) =>
      (i.fieldData?.slug as string) === episodeSlug &&
      (i.fieldData?.show as string) === show.id
  );
  return episode
    ? mapShowEpisode(episode as { id: string; fieldData: Record<string, unknown> })
    : null;
}

export async function getEpisodesByShow(showId: string): Promise<ShowEpisode[]> {
  const episodes = await getShowEpisodes();
  return episodes
    .filter((e) => (typeof e.show === "string" ? e.show : e.show?.id) === showId)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
}

export async function getShowSlugs(): Promise<string[]> {
  return getCollectionSlugs("Shows");
}

// ─── Podcasts (option fields) ─────────────────────────────────
export async function getPodcasts(): Promise<Podcast[]> {
  const [items, optionMaps] = await Promise.all([
    getCollectionItems("Podcasts"),
    loadOptionMaps(),
  ]);
  return items.map((item) =>
    mapPodcast(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
  );
}

export async function getPodcastBySlug(slug: string): Promise<Podcast | null> {
  const [item, optionMaps] = await Promise.all([
    getCollectionItemBySlug("Podcasts", slug),
    loadOptionMaps(),
  ]);
  return item
    ? mapPodcast(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
    : null;
}

// ─── Podcast Episodes (no option fields) ──────────────────────
export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const items = await getCollectionItems("Podcast Episodes");
  return items.map((item) =>
    mapPodcastEpisode(item as { id: string; fieldData: Record<string, unknown> })
  );
}

export async function getPodcastEpisodeBySlug(
  podcastSlug: string,
  episodeSlug: string
): Promise<PodcastEpisode | null> {
  const podcast = await getPodcastBySlug(podcastSlug);
  if (!podcast) return null;
  const items = await getCollectionItems("Podcast Episodes");
  const episode = items.find((i) => {
    const slugMatch = (i.fieldData?.slug as string) === episodeSlug;
    const fd = i.fieldData || {};
    const rawRef = fd.podcast ?? fd["podcast-ref"] ?? fd.show ?? fd["podcast-show"];
    const refId =
      rawRef === podcast.id
        ? podcast.id
        : typeof rawRef === "object" && rawRef !== null && "id" in rawRef
          ? (rawRef as { id: string }).id
          : typeof rawRef === "string"
            ? rawRef
            : "";
    const podcastMatch = refId === podcast.id;
    return slugMatch && podcastMatch;
  });
  return episode
    ? mapPodcastEpisode(episode as { id: string; fieldData: Record<string, unknown> })
    : null;
}

export async function getEpisodesByPodcast(podcastId: string): Promise<PodcastEpisode[]> {
  const episodes = await getPodcastEpisodes();
  return episodes
    .filter((e) => (typeof e.podcast === "string" ? e.podcast : e.podcast?.id) === podcastId)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
}

export async function getPodcastSlugs(): Promise<string[]> {
  return getCollectionSlugs("Podcasts");
}

// ─── Events (option fields) ───────────────────────────────────
// Load events first; option maps are optional (if loading fails we still return events with raw option values)
// Ensure WEBFLOW_API_KEY is set and that the Events collection ID in webflow.ts matches your Webflow site.
export async function getEvents(): Promise<Event[]> {
  let items: { id: string; fieldData: Record<string, unknown> }[];
  try {
    items = await getCollectionItems("Events");
  } catch (err) {
    console.error("getEvents: failed to fetch Events collection from Webflow", err);
    throw err;
  }
  let optionMaps: OptionMaps;
  try {
    optionMaps = await loadOptionMaps();
  } catch {
    optionMaps = { Events: {} };
  }
  return items.map((item) =>
    mapEvent(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
  );
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const item = await getCollectionItemBySlug("Events", slug);
  if (!item) return null;
  let optionMaps: OptionMaps;
  try {
    optionMaps = await loadOptionMaps();
  } catch {
    optionMaps = { Events: {} };
  }
  return mapEvent(item as { id: string; fieldData: Record<string, unknown> }, optionMaps);
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const all = await getEvents();
  const now = new Date().toISOString();
  return all
    .filter((e) => (e.startDateTime ?? e.date) >= now)
    .sort((a, b) => (a.startDateTime ?? a.date).localeCompare(b.startDateTime ?? b.date));
}

export async function getPastEvents(): Promise<Event[]> {
  const all = await getEvents();
  const now = new Date().toISOString();
  return all
    .filter((e) => (e.startDateTime ?? e.date) < now)
    .sort((a, b) => (b.startDateTime ?? b.date).localeCompare(a.startDateTime ?? a.date));
}

// ─── Event Series (no option fields) ──────────────────────────
export async function getEventSeries(): Promise<EventSeries[]> {
  const items = await getCollectionItems("Events Series");
  return items.map((item) =>
    mapEventSeries(item as { id: string; fieldData: Record<string, unknown> })
  );
}

export async function getEventSeriesBySlug(slug: string): Promise<EventSeries | null> {
  const item = await getCollectionItemBySlug("Events Series", slug);
  return item
    ? mapEventSeries(item as { id: string; fieldData: Record<string, unknown> })
    : null;
}

export async function getEventsBySeries(seriesId: string): Promise<Event[]> {
  const events = await getEvents();
  return events.filter(
    (e) => (e.eventSeries as string | undefined) === seriesId
  );
}

export async function getEventSlugs(): Promise<string[]> {
  return getCollectionSlugs("Events");
}

export async function getEventSeriesSlugs(): Promise<string[]> {
  return getCollectionSlugs("Events Series");
}

// ─── Books (option fields) ───────────────────────────────────
export async function getBooks(): Promise<Book[]> {
  const [items, optionMaps] = await Promise.all([
    getCollectionItems("Books"),
    loadOptionMaps(),
  ]);
  return items.map((item) =>
    mapBook(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
  );
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const [item, optionMaps] = await Promise.all([
    getCollectionItemBySlug("Books", slug),
    loadOptionMaps(),
  ]);
  return item
    ? mapBook(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
    : null;
}

export async function getBookSlugs(): Promise<string[]> {
  return getCollectionSlugs("Books");
}

// ─── Jobs (option fields) ─────────────────────────────────────
export async function getJobs(): Promise<Job[]> {
  const [items, optionMaps] = await Promise.all([
    getCollectionItems("Jobs"),
    loadOptionMaps(),
  ]);
  return items.map((item) =>
    mapJob(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
  );
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const [item, optionMaps] = await Promise.all([
    getCollectionItemBySlug("Jobs", slug),
    loadOptionMaps(),
  ]);
  return item
    ? mapJob(item as { id: string; fieldData: Record<string, unknown> }, optionMaps)
    : null;
}

export async function getOpenJobs(): Promise<Job[]> {
  const all = await getJobs();
  return all.filter((j) => j.open ?? j.isOpen);
}

export async function getJobSlugs(): Promise<string[]> {
  return getCollectionSlugs("Jobs");
}
