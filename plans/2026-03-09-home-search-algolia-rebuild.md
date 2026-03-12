# Plan: Rebuild Home Search on Algolia Global Index

**Created:** 2026-03-09
**Status:** Ready to implement
**Estimated scope:** Medium — 1 day of focused work

---

## Problem Summary

The home search is fundamentally broken in three ways:

1. **Wrong data source.** Only YAP articles use Algolia. All other content (services, case studies, shows, podcasts, events, team, topics) is fetched from Webflow CMS on every keystroke and filtered with `string.includes()`. This is slow, dumb, and not search.
2. **The global index is unused.** `attn_seeker_global` has 1,817 records covering all content types and is synced daily. The search API never queries it.
3. **Wrong architecture.** The home search makes a server round-trip on every keystroke, including an optional OpenAI call for intent classification. Algolia is designed to be queried directly from the browser in milliseconds — no server needed.

---

## Current State

- `attn_seeker_global`: 1,817 records, all content types present
- Index settings: searchableAttributes and attributesForFaceting set, but no customRanking, no Rules, no synonyms
- NeuralSearch: **not available on current plan — upgrade required**
- `/api/search` route: fetches 10 Webflow CMS collections + runs string.includes() + optional OpenAI intent call
- `HomeSearch` component: two-request pattern (fast → smart), 250ms debounce, server round-trip

---

## Goal

A search bar that:
- Returns results **instantly** as the user types (client-side Algolia, ~20ms)
- Covers **all content types** across the full site
- **Understands intent** — "help with TikTok" surfaces the TikTok management service, not just articles with that word
- Uses **semantic search** (NeuralSearch) for natural language queries
- Takes users **directly to the right page** on click
- Shows services/case studies first for agency-intent queries, articles/podcasts for content queries

---

## Prerequisites

### Algolia Plan Upgrade (manual — Stanley to do)
- Log into Algolia dashboard
- Upgrade to a plan that includes **NeuralSearch** (Premium or higher)
- NeuralSearch enables embedding-based semantic search — "help with TikTok" matches TikTok Management Service even if exact words don't appear in the record

---

## Implementation Steps

### Step 1 — Enrich the `attn_seeker_global` index records

The `keywords` field is the primary vehicle for making natural language queries work, especially before NeuralSearch is live.

**Services** need phrases like:
- "help with TikTok" → TikTok Management service
- "I need help with my Instagram" → Instagram Management service
- "organic social media" → Social Media Strategy service
- "content creation" → Content Creation service
- "social media strategy" → Strategy service
- "manage my socials" → Social Media Management service

Update `src/lib/algolia-sync.ts` `serviceKeywords()` to include a rich set of natural-language phrases per service type. Also enrich case studies, events, team.

**File:** `src/lib/algolia-sync.ts`

### Step 2 — Fix index settings via the Meta API (push on sync)

Update `GLOBAL_INDEX_SETTINGS` in `algolia-sync.ts` and ensure the sync pushes them:

```ts
searchableAttributes: [
  "unordered(title)",       // title matches, any position
  "unordered(keywords)",    // intent phrases
  "unordered(description)", // body text
],
customRanking: [
  "desc(contentTypePriority)", // services + case studies rank highest
],
attributesForFaceting: ["contentType"],
queryLanguages: ["en"],
removeStopWords: true,
ignorePlurals: true,
```

Add `contentTypePriority` to each record in the sync builder:
- service: 100
- case-study: 90
- team: 80
- event: 70
- show: 60
- podcast: 60
- show-episode: 50
- podcast-episode: 50
- article: 40
- topic: 30

### Step 3 — Add Algolia Rules for intent boosting

Rules are pushed via the Algolia API. Define them in code in a new file `src/lib/algolia-rules.ts` and push them as part of the sync or as a one-time setup script.

Rules to implement:

| Trigger | Boost |
|---------|-------|
| query contains "help with", "I need help", "can you help", "need help with", "manage my", "help me" | `contentType:service` moved to top |
| query contains "hire", "work with you", "agency", "pricing", "packages", "what do you offer" | `contentType:service` + `contentType:case-study` to top |
| query contains "contact", "get in touch", "speak to", "reach out" | Pin Contact page result at position 1 |
| query contains "event", "upcoming", "what's on", "workshop", "webinar" | `contentType:event` to top |
| query contains "who is", "team", "staff", "people" | `contentType:team` to top |
| query contains "podcast", "listen" | `contentType:podcast` + `contentType:podcast-episode` to top |
| query contains "show", "watch", "video" | `contentType:show` + `contentType:show-episode` to top |
| query contains "article", "read", "learn" | `contentType:article` + `contentType:topic` to top |

### Step 4 — Add synonyms

Push synonyms via Algolia API:

```
socials ↔ social media
tiktok ↔ TikTok ↔ tik tok
insta ↔ instagram
linkedin ↔ linked in
podcast ↔ podcasts
show ↔ shows
event ↔ events
article ↔ articles ↔ blog ↔ posts
hire ↔ work with ↔ agency
```

### Step 5 — Enable NeuralSearch on the index

Once plan is upgraded, update index settings to enable hybrid NeuralSearch:

```ts
mode: "neuralSearch",
semanticSearch: {
  eventSources: ["default"],
}
```

This makes "help with TikTok" semantically match service records even when keyword overlap is minimal.

### Step 6 — Rewrite `HomeSearch` to query Algolia directly

Replace the two-request server pattern with a direct client-side `liteClient` query on `attn_seeker_global`, identical to how LearnSearch works.

**File:** `src/components/search/home-search.tsx`

Key changes:
- Import `algoliasearch/lite` and instantiate with `NEXT_PUBLIC_ALGOLIA_APP_ID` + `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`
- Query `attn_seeker_global` directly from the browser
- Keep the 250ms debounce on the input
- Map Algolia hits to `SearchResult` type for the existing `HitCard` UI
- Remove the `fast`/`smart` dual-request pattern
- Remove all state management around server fetch + abort controllers (simplify significantly)
- Add lightweight client-side intent detection for result ordering (or rely on Algolia Rules)

Add a static Contact page result that gets injected client-side when query matches contact phrases (no Algolia rule needed for this since it's a static page, not a CMS record).

### Step 7 — Deprecate `/api/search` for home search

Once HomeSearch queries Algolia directly, the `/api/search` route is only needed if something else uses it. Check usages:
- Nav SearchBar — if it also uses `/api/search`, update it too
- No other known consumers

Mark the route for removal or leave as a fallback.

### Step 8 — Run sync to apply all changes

```bash
npm run sync-search
```

This rebuilds and pushes all records with enriched keywords + contentTypePriority + updated index settings + rules + synonyms.

---

## Files to Change

| File | Change |
|------|--------|
| `src/lib/algolia-sync.ts` | Enrich keywords per content type, add contentTypePriority, update GLOBAL_INDEX_SETTINGS |
| `src/lib/algolia-rules.ts` | New file — defines and pushes Rules + synonyms via Algolia API |
| `src/lib/run-algolia-sync.ts` | Call pushRules() and pushSynonyms() as part of sync |
| `src/components/search/home-search.tsx` | Rewrite to use liteClient on attn_seeker_global directly |
| `src/app/api/search/route.ts` | Deprecate / remove home search usage |
| `src/lib/search-intent.ts` | Keep for lightweight client-side ordering, remove OpenAI call |

---

## What This Delivers

| Before | After |
|--------|-------|
| 1-2s per search (server + Webflow + OpenAI) | ~20ms (client-side Algolia) |
| Exact substring match only | Typo-tolerant, prefix, synonym, semantic |
| Articles only in Algolia | All 10 content types in Algolia |
| Intent via OpenAI (slow, costly) | Intent via Algolia Rules (instant, free) |
| Global index unused | Global index is the single source of truth |
| "TikTok" may match nothing | "help with TikTok" → TikTok Management Service |

---

## Order of execution

1. Stanley upgrades Algolia plan (NeuralSearch) — unblocks Step 5
2. Implement Steps 1–4 (can be done now, parallel to plan upgrade)
3. Implement Step 5 once plan upgraded
4. Implement Steps 6–7
5. Run sync, test, deploy
