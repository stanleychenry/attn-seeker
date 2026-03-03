const WEBFLOW_API_BASE = "https://api.webflow.com/v2";
// Support both names so Vercel/env can use either
const API_KEY =
  process.env.WEBFLOW_API_KEY ||
  process.env.WEBFLOW_API_TOKEN ||
  "";

const KNOWN_COLLECTION_IDS: Record<string, string> = {
  Teams: "6903fbac0e9ee52349381d09",
  Shows: "690400b4c81ed34dbe232792",
  "Show Episodes": "690403aaed7c9052daa73012",
  Podcasts: "6904f893417ab873045acdad",
  "Podcast Episodes": "6904f9ebeda603740d2eb248",
  "YAP Articles": "6904fc8a553a443083c35a66",
  "Landing Pages": "69054a1ae43f08cf4655267c",
  Books: "69054b039f4efa1a73e777be",
  "Events Series": "690659ec4283f4085fac28a7",
  Events: "690661ddfa0fb65117465141",
  Topics: "694f47a6bab20226d30f7b20",
  Jobs: "694f7da9e77e5b3348eb247f",
  "Case Studies": "6950a412ce68db24df58f7ca",
  Services: "6952391019949fbd2cb183bb",
};

export type WebflowItem = { id: string; fieldData: Record<string, unknown> };

async function getCollectionId(collectionName: string): Promise<string> {
  const id = KNOWN_COLLECTION_IDS[collectionName];
  if (!id) throw new Error(`Unknown collection: ${collectionName}`);
  return id;
}

async function webflowFetch<T>(path: string): Promise<T> {
  const url = `${WEBFLOW_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    const detail = body ? ` ${body.slice(0, 200)}` : "";
    throw new Error(
      `Webflow API error: ${res.status} ${res.statusText}${detail}`
    );
  }
  return res.json() as Promise<T>;
}

const ITEMS_PAGE_SIZE = 100;

/** If true, we've already logged a Webflow failure (avoid log spam during build). */
let webflowFailureLogged = false;

/** Cache per collection so parallel build requests get consistent data (avoid 406 on one call after success on another). */
const collectionItemsCache = new Map<string, WebflowItem[]>();

export async function getCollectionItems(
  collectionName: string
): Promise<WebflowItem[]> {
  const cached = collectionItemsCache.get(collectionName);
  if (cached !== undefined) return cached;

  if (!API_KEY) {
    if (!webflowFailureLogged) {
      webflowFailureLogged = true;
      console.warn(
        "WEBFLOW_API_KEY (or WEBFLOW_API_TOKEN) is not set. Returning empty collection data."
      );
    }
    collectionItemsCache.set(collectionName, []);
    return [];
  }
  try {
    const collectionId = await getCollectionId(collectionName);
    const all: WebflowItem[] = [];
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      const data = await webflowFetch<{ items: WebflowItem[] }>(
        `/collections/${collectionId}/items?limit=${ITEMS_PAGE_SIZE}&offset=${offset}`
      );
      const items = data.items || [];
      all.push(...items);
      hasMore = items.length === ITEMS_PAGE_SIZE;
      offset += items.length;
    }
    collectionItemsCache.set(collectionName, all);
    return all;
  } catch (err) {
    if (!webflowFailureLogged) {
      webflowFailureLogged = true;
      const msg = err instanceof Error ? err.message : String(err);
      const detail = err instanceof Error ? err.stack : "";
      console.warn(
        `Webflow API request failed [${collectionName}]:`,
        msg,
        detail ? `\n${detail}` : ""
      );
    }
    collectionItemsCache.set(collectionName, []);
    return [];
  }
}

export async function getCollectionItemBySlug(
  collectionName: string,
  slug: string
): Promise<WebflowItem | null> {
  const items = await getCollectionItems(collectionName);
  return items.find((item) => (item.fieldData?.slug as string) === slug) ?? null;
}

export async function getCollectionSlugs(
  collectionName: string
): Promise<string[]> {
  const items = await getCollectionItems(collectionName);
  return items
    .map((item) => item.fieldData?.slug as string)
    .filter((s): s is string => typeof s === "string");
}

// Cache for collection field schemas (option field labels)
const fieldSchemaCache: Record<string, unknown[]> = {};

// Fetch the field schema for a collection (includes option labels)
// Returns array of field definitions with their validations (option choices, etc.)
export async function getCollectionFields(
  collectionId: string
): Promise<{ slug: string; validations?: { options?: { id: string; name: string }[] } }[]> {
  if (fieldSchemaCache[collectionId])
    return fieldSchemaCache[collectionId] as { slug: string; validations?: { options?: { id: string; name: string }[] } }[];

  if (!API_KEY) return [];
  try {
    const data = await webflowFetch<{
      fields: { slug: string; validations?: { options?: { id: string; name: string }[] } }[];
    }>(`/collections/${collectionId}`);
    fieldSchemaCache[collectionId] = data.fields || [];
  } catch {
    fieldSchemaCache[collectionId] = [];
  }
  return (fieldSchemaCache[collectionId] as { slug: string; validations?: { options?: { id: string; name: string }[] } }[]) || [];
}

// Build a lookup map from option hash IDs to human-readable labels for a specific field
// collectionName: display name like "Events"
// fieldSlug: the API slug like "status" or "event-tier"
// Returns: Record<hashId, label> e.g. { "abc123": "Upcoming", "def456": "Past" }
export async function getOptionLabels(
  collectionName: string,
  fieldSlug: string
): Promise<Record<string, string>> {
  const collectionId = await getCollectionId(collectionName);
  const fields = await getCollectionFields(collectionId);

  const field = fields.find((f) => f.slug === fieldSlug);
  if (!field?.validations?.options) return {};

  const map: Record<string, string> = {};
  for (const opt of field.validations.options) {
    map[opt.id] = opt.name;
  }
  return map;
}

// Batch-load all option labels for a collection (avoids repeated API calls)
// Returns: Record<fieldSlug, Record<hashId, label>>
export async function getAllOptionLabels(
  collectionName: string
): Promise<Record<string, Record<string, string>>> {
  const collectionId = await getCollectionId(collectionName);
  const fields = await getCollectionFields(collectionId);

  const result: Record<string, Record<string, string>> = {};
  for (const field of fields) {
    if (field.validations?.options && field.validations.options.length > 0) {
      const map: Record<string, string> = {};
      for (const opt of field.validations.options) {
        map[opt.id] = opt.name;
      }
      result[field.slug] = map;
    }
  }
  return result;
}
