# Home page semantic search – implementation plan

## Goal

- Home page search bar behaves like the **/learn** search (Algolia-powered, dropdown, instant results).
- Searchable content: **YAP Articles**, **Podcast Episodes**, **Show Episodes**, **Teams**, **Events**, **Case Studies**, **Services** (all from CMS).
- **Semantic / intent-aware**: understand questions and intent; prioritize **services** when relevant; route “get in contact” queries to the **contact** page.

---

## Current state

| Area | How it works today |
|------|--------------------|
| **/learn** | Algolia **client-side**: `InstantSearch` + index `yap_articles`. Single index, articles only. Uses `NEXT_PUBLIC_ALGOLIA_APP_ID` and `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`. |
| **Home** | **API** `/api/search`: fetches all CMS data (Webflow via `lib/cms`), does simple string `includes()` on title/description/etc. Returns `SearchResult[]`. No Algolia. No podcast/show **episodes** (only shows/podcasts as entities). No intent (contact, service priority). |
| **Algolia** | Only `yap_articles` index is referenced in code. Other indices (if any) are likely maintained outside this repo (e.g. Webflow → Algolia sync). |

---

## Architecture choice

- **Search backend**: Use **Algolia** for the actual content search (same as /learn), so we get good relevance and speed. Home will call Algolia **server-side** (from `/api/search`) so we can mix in intent and ranking.
- **Intent / semantic layer**: Run **before** or **after** Algolia:
  - **Contact intent**: If the query clearly asks to contact you (e.g. “get in touch”, “contact”, “talk to someone”, “speak to the team”), we **inject** a result linking to `/agency/contact` and optionally put it first.
  - **Service priority**: When the query is about “what you offer”, “services”, “help with X”, we can (a) **boost** service hits in the result list, or (b) use an **LLM** to classify intent and then reorder/boost. (a) can be done with keywords + reordering; (b) needs an LLM API key.
- **“Semantic” search**: Two levels:
  1. **Keyword + rules (no new keys)**: Contact phrases → contact result; “services”, “help”, “hire” → boost services. Good first step.
  2. **LLM intent (optional)**: One small LLM call per query: “Intent: contact | service | content. If contact, say so. If service, suggest.” Then we reorder or inject results. Needs e.g. `OPENAI_API_KEY` in `.env.local`.

---

## What you need to provide (env / API access)

### 1. Algolia (required for search)

You already use Algolia for /learn. For home we need:

| Env var | Purpose | Where to get it |
|--------|---------|------------------|
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | App ID (same as learn) | Algolia dashboard → Settings → Application ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Search-only key (client + server) | Algolia dashboard → API Keys → Search-Only API Key |

If you want the **home** search to use a **different** app or key (e.g. separate project), we can use:

- `NEXT_PUBLIC_ALGOLIA_HOME_APP_ID`
- `NEXT_PUBLIC_ALGOLIA_HOME_SEARCH_KEY`

Otherwise we reuse the same as learn.

**Optional (only if we sync indices from this repo):**

| Env var | Purpose |
|--------|---------|
| `ALGOLIA_ADMIN_KEY` | Create/update indices and push records (e.g. from Webflow/CMS). **Never** expose in client; server-only. |

If `yap_articles` (and any other indices) are already filled by another process (e.g. Webflow → Algolia), you **don’t** need to add `ALGOLIA_ADMIN_KEY` for the first phase. We’ll only query existing indices.

### 2. LLM for intent (optional)

Only needed if we add “smart” intent (contact vs service vs general) via an LLM:

| Env var | Purpose |
|--------|---------|
| `OPENAI_API_KEY` | Small intent classification call per search (e.g. “contact” / “service” / “content”). Server-only. |

Alternatives: Vercel AI SDK with another provider, or another LLM API you already use. We can design the intent step so it’s easy to plug in a different provider.

### 3. CMS (already in use)

No new keys for CMS. We already use Webflow via `lib/cms`. If we **don’t** use Algolia for some content types at first (e.g. no index yet), we can still fall back to CMS fetch + match in the API (as today) for those types.

---

## Phased implementation

### Phase 1 – Algolia + content types (no new keys if you already have Algolia)

**Assumption:** You keep using existing `NEXT_PUBLIC_ALGOLIA_APP_ID` and `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`. If `yap_articles` is the only index that exists, we have two options:

- **Option A – Multi-index search:** Create and maintain Algolia indices for: **YAP Articles** (existing), **Podcast Episodes**, **Show Episodes**, **Teams**, **Events**, **Case Studies**, **Services**. Sync from Webflow/CMS (script or cron) using `ALGOLIA_ADMIN_KEY`. Home calls Algolia **multi-index** from `/api/search` and merges hits into one list. You’d need to add `ALGOLIA_ADMIN_KEY` and a sync process for the new indices.
- **Option B – Hybrid (recommended for first release):** Use Algolia only where an index already exists (e.g. `yap_articles`). For the rest (Podcast Episodes, Show Episodes, Teams, Events, Case Studies, Services), keep using the current CMS fetch + text match in `/api/search`, but **normalize** the response so the home search bar gets one unified list with types and URLs. UI already supports this.

Deliverables:

- Home search bar still calls `POST /api/search` (no change to `SearchBar` / `useSearch` contract).
- `/api/search`:
  - Queries Algolia for YAP Articles (and any other existing indices we agree to use).
  - Fetches from CMS: podcast episodes, show episodes, teams, events, case studies, services (using existing `lib/cms`).
  - Merges and deduplicates; returns `SearchResult[]` with correct `type` and `url` for each content type (including `podcast-episode`, `show-episode`).
- Extend `SearchResult` (and API) so **episodes** have the right URLs (e.g. `/podcasts/[podcastSlug]/[episodeSlug]`, `/shows/[showSlug]/[episodeSlug]`).
- **Intent (keyword-only):** If query matches “contact” / “get in touch” / “talk to” / “speak to” etc., prepend a result: `type: "page"`, `title: "Contact"`, `url: "/agency/contact"`, optional `reason: "Get in touch with the team"`.
- Optional: simple **service boost**: if query contains “service”, “help”, “hire”, “work with”, reorder so service results appear higher.

No new env vars required if we stick to existing Algolia keys and CMS; only add `ALGOLIA_ADMIN_KEY` if we implement Option A and a sync.

### Phase 2 – Full Algolia indices (optional)

- Create Algolia indices for: Podcast Episodes, Show Episodes, Teams, Events, Case Studies, Services.
- Sync script (or serverless job) that pulls from Webflow/CMS and pushes to Algolia (requires `ALGOLIA_ADMIN_KEY` and Webflow token if not already in use).
- Change `/api/search` to use Algolia **multi-index** (or a single unified index with a `contentType` attribute) for all these, and remove CMS-based search for them. Better relevance and latency.

### Phase 3 – LLM intent (optional)

- Add one LLM call in `/api/search`: “Given the user query, return intent: contact | service | content.”
- If **contact**: ensure contact result is first (or only), same as Phase 1 but driven by model.
- If **service**: boost or prioritize service results.
- If **content**: default ranking (Algolia + any current boosting).
- Requires `OPENAI_API_KEY` (or equivalent) in `.env.local` (server-only).

---

## Env vars summary (for .env.local)

**Minimum to run Phase 1 (no new keys if you already have Algolia):**

```bash
# Already used by /learn – reuse for home
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_key
```

**If we add Algolia index sync (Phase 2):**

```bash
ALGOLIA_ADMIN_KEY=your_admin_api_key   # Server-only; never expose to client
```

**If we add LLM intent (Phase 3):**

```bash
OPENAI_API_KEY=sk-...   # Server-only
```

---

## File changes (high level)

- **`src/app/api/search/route.ts`**: Add Algolia client (server-side), query `yap_articles` (and later other indices); add CMS fetch for episodes + teams + events + case studies + services; normalize to `SearchResult[]`; add contact intent (keyword rule, then optionally LLM); optional service boost; return same JSON shape.
- **`src/types/search.ts`**: Add result types `podcast-episode`, `show-episode` if not present; ensure `reason` is used for contact result.
- **`src/components/search/search-bar.tsx`**: No change to contract; already shows `result.reason`. We may add a small “Contact” or “Service” label for certain types if desired.
- **`src/lib/cms.ts`**: Already has getters for the needed entities; confirm we have (or add) getters for **all podcast episodes** and **all show episodes** (or by show/podcast) so the API can iterate and match.
- **Algolia**: If we use multi-index, we’ll need a small `src/lib/algolia-server.ts` (or similar) that uses the same app ID + search key (or admin key for sync) server-side.

---

## Next step

1. You add to `.env.local`:
   - `NEXT_PUBLIC_ALGOLIA_APP_ID` and `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` (if not already there).
2. Confirm whether you already have Algolia indices for anything besides `yap_articles` (e.g. services, events). If yes, we’ll use them in Phase 1; if no, we start with Option B (Algolia for articles, CMS for the rest + contact intent).
3. Then we implement Phase 1: home search using Algolia for articles, CMS for the other types, contact intent (keyword), and optional service boost.

If you tell me “Phase 1 only, no Algolia admin key, no LLM,” I’ll implement accordingly and only use the Algolia and env vars you already have.
