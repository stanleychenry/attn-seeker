/**
 * Diagnostic: List Podcasts and Podcast Episodes from Webflow,
 * and count how many episodes reference each podcast (especially Stansplaining).
 * Run: node scripts/check-podcast-episodes.js
 * Loads WEBFLOW_API_KEY from .env.local (or env).
 */
const path = require("path");
const fs = require("fs");

// Load .env.local from project root (same as Next.js)
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) {
      const key = m[1].trim();
      const val = m[2].trim().replace(/^["']|["']$/g, "").replace(/\r$/, "");
      process.env[key] = val;
    }
  });
}

// Prefer WEBFLOW_API_KEY; fall back to NEXT_PUBLIC_ variant if present
const WEBFLOW_API_BASE = "https://api.webflow.com/v2";
const API_KEY =
  process.env.WEBFLOW_API_KEY ||
  process.env.NEXT_PUBLIC_WEBFLOW_API_KEY ||
  "";
const PODCASTS_COLLECTION_ID = "6904f893417ab873045acdad";
const PODCAST_EPISODES_COLLECTION_ID = "6904f9ebeda603740d2eb248";

async function fetchAll(path) {
  const res = await fetch(`${WEBFLOW_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}`, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

function extractPodcastRef(field) {
  if (field == null) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "id" in field) return field.id;
  return null;
}

// Try all possible field names Webflow might use for the podcast reference
function getEpisodePodcastRef(fieldData) {
  const keys = ["podcast", "podcast-ref", "show", "podcast-show"];
  for (const k of keys) {
    const ref = extractPodcastRef(fieldData?.[k]);
    if (ref) return ref;
  }
  return null;
}

async function main() {
  if (!API_KEY) {
    console.error("Missing WEBFLOW_API_KEY.");
    console.error("Add WEBFLOW_API_KEY=your_key to .env.local in the project root, then run this script again.");
    process.exit(1);
  }

  console.log("Fetching Podcasts and Podcast Episodes...\n");

  const [podcastsRes, episodesRes] = await Promise.all([
    fetchAll(`/collections/${PODCASTS_COLLECTION_ID}/items?limit=100`),
    fetchAll(`/collections/${PODCAST_EPISODES_COLLECTION_ID}/items?limit=100`),
  ]);

  const podcasts = podcastsRes.items || [];
  const episodes = episodesRes.items || [];

  console.log("── All Podcasts (full IDs – compare with Webflow) ──");
  console.log("ID                                    slug              name");
  console.log("-".repeat(75));
  const podcastById = {};
  for (const p of podcasts) {
    const id = p.id;
    const slug = (p.fieldData?.slug ?? "").toString();
    const name = (p.fieldData?.name ?? "").toString();
    podcastById[id] = { id, slug, name };
    console.log(`${id}  ${slug.padEnd(18)} ${name}`);
  }

  console.log("\n── Episode ref field check (which field has the link?) ──");
  const fd = episodes[0]?.fieldData || {};
  const refKeys = ["podcast", "podcast-ref", "show", "podcast-show"];
  for (const k of refKeys) {
    const v = fd[k];
    const ref = extractPodcastRef(v);
    console.log(`  fieldData.${k}: ${v == null ? "null/undefined" : typeof v} → extracted id: ${ref || "(none)"}`);
  }

  console.log("\n── Episodes per podcast (by ref ID, using all field names) ──");
  const countByPodcastId = {};
  let unknownCount = 0;
  for (const ep of episodes) {
    const ref = getEpisodePodcastRef(ep.fieldData);
    if (!ref) {
      unknownCount++;
      continue;
    }
    countByPodcastId[ref] = (countByPodcastId[ref] || 0) + 1;
  }

  for (const [refId, count] of Object.entries(countByPodcastId)) {
    const p = podcastById[refId] || { name: "(unknown ID – not in Podcasts list!)", slug: "?" };
    console.log(`  ${p.name.padEnd(40)}  ${count} episode(s)`);
    console.log(`    → ref ID: ${refId}`);
  }
  if (unknownCount > 0) {
    console.log(`  (no ref found in any field)     ${unknownCount} episode(s)`);
  }

  const stansplaining = podcasts.find(
    (p) =>
      (p.fieldData?.slug || "").toString().toLowerCase() === "stansplaining" ||
      (p.fieldData?.name || "").toString().toLowerCase().includes("stansplaining")
  );
  console.log("\n── Stansplaining (ID check) ──");
  if (stansplaining) {
    const sid = stansplaining.id;
    const count = countByPodcastId[sid] || 0;
    console.log(`  Name:  ${stansplaining.fieldData?.name}`);
    console.log(`  Slug:  ${stansplaining.fieldData?.slug}`);
    console.log(`  ID:    ${sid}`);
    console.log(`  Episodes that reference this exact ID: ${count}`);
    if (count === 0) {
      const refIds = Object.keys(countByPodcastId);
      console.log("\n  Ref IDs that DO appear on episodes (from Podcast Episodes collection):");
      refIds.forEach((id) => console.log(`    ${id}`));
      console.log("\n  → If Stansplaining's ID above is not in that list, episodes are linked to a different");
      console.log("    podcast item in Webflow. In Webflow: check the Podcast field on a Stansplaining episode");
      console.log("    and confirm it points to the same item whose ID is printed above.");
    }
  } else {
    console.log("  No podcast with slug or name containing 'stansplaining' found in Podcasts collection.");
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
