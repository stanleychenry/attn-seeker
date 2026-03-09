# Home search setup (Algolia global index)

The home page and learn page use **client-side Algolia** (InstantSearch): one index for home, one for learn. Search is instant and no server round-trip.

## Why is search empty or not finding articles/episodes/team/services?

**The search bar does not read from your CMS or database directly.** It reads from one Algolia index named **attn_seeker_global**. That index is **only** filled when you run the sync (see below). Nothing in the app code “breaks” this — if the index was never synced, or was synced in a different environment or Algolia app, the index is empty and search will show no (or wrong) results.

**Fix:** The index is synced **automatically after every build** (postbuild runs `npm run sync-search`). So on Vercel (or any deploy that runs `npm run build`), the index is filled with no extra step. Use the same Algolia app for both sync and the app (same `NEXT_PUBLIC_ALGOLIA_APP_ID` and `ALGOLIA_ADMIN_KEY`).

- **Local (first time or after big CMS changes):** Run `npm run sync-search` once. No dev server needed.
- **Production:** Nothing. Build already runs the sync.

## Security: two keys, different roles

| Env var | Where used | **Rule** |
|--------|-------------|----------|
| **`NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`** | Browser only (home + learn search) | Must be a **search-only** key. If it has Add/Edit/Delete, anyone could inject or delete index data. In Algolia Dashboard create a key with **only** "Search" checked. |
| **`ALGOLIA_ADMIN_KEY`** | Server only (sync, `/api/search`) | Never expose in client or in any `NEXT_PUBLIC_*` variable. Used to sync the index and for server-side search. |

**If you ever see fake records in search:** the value in `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` has write access. Replace it with a new search-only key from the Algolia Dashboard.

## 1. Algolia Admin API key

You need an **Admin API key** (not the Search-Only key) so we can write records to the index.

- Go to [Algolia Dashboard](https://dashboard.algolia.com) → your app → **API Keys**.
- Use an existing key that has **write** permissions, or create a new one with:
  - **Add/Edit records**
  - **Edit settings**
  - **List indices** (optional)
- Put it in `.env.local` as **`ALGOLIA_ADMIN_KEY`** (server-only; never expose in client).

If you only have a Search-Only key, create a new key with the ACLs above and set `ALGOLIA_ADMIN_KEY` to that value.

## 2. Run the sync (required once, and after CMS changes)

The index **attn_seeker_global** is filled by syncing from your CMS (Webflow). Run the sync:

**Option A – No auth (dev only)**  
If `SYNC_SECRET` is not set:

```bash
curl -X POST http://localhost:3000/api/admin/sync-search
```

**Option B – With auth (recommended for production)**  
Set in `.env.local`:

```bash
SYNC_SECRET=your-secret-string
```

Then call:

```bash
curl -X POST https://your-domain.com/api/admin/sync-search \
  -H "Authorization: Bearer your-secret-string"
```

On success you get:

```json
{ "ok": true, "index": "attn_seeker_global", "totalRecords": 123 }
```

**When to run**

- Once after initial setup.
- After you add or change a lot of content in Webflow (articles, services, case studies, episodes, teams, events).
- You can trigger it from a Vercel cron or a Webflow webhook if you want it automatic.

## 3. What gets indexed

| Content type   | Source        | URL pattern                    |
|----------------|---------------|---------------------------------|
| YAP Articles   | CMS           | `/yap-articles/{slug}`         |
| Services       | CMS           | `/agency/services/{slug}`       |
| Case Studies   | CMS           | `/agency/work/{slug}`          |
| Show Episodes  | CMS           | `/shows/{showSlug}/{episodeSlug}` |
| Podcast Episodes | CMS         | `/podcasts/{podcastSlug}/{episodeSlug}` |
| **Shows** (series) | CMS      | `/shows/{slug}`                |
| **Podcasts** (series) | CMS   | `/podcasts/{slug}`             |
| **Topics**      | CMS           | `/learn/{slug}`                |
| Teams          | CMS           | `/agency/team/{slug}`          |
| Events         | CMS           | `/events/{slug}`               |

Searchable fields: **title**, **description**, **keywords** (services and events include phrases like "help with socials", "what events" for better matching). Facet: **contentType**. The index also includes **Shows** (series), **Podcasts** (series), and **Topics** (learn).

## 4. Synonyms (recommended)

In Algolia Dashboard → **Search** → **Configuration** → index **attn_seeker_global** → **Synonyms**, add e.g. `socials` → `social`, `podcasts` → `podcast`, `events` → `event` so natural-language queries match.

## 5. Semantic search (optional)

Algolia offers **Semantic Search** / **NeuralSearch** on some plans. To enable:

- Algolia Dashboard → **Search** → **Configuration** for index **attn_seeker_global**.
- Look for **Semantic Search** or **AI / Neural** and turn it on if available.

That improves relevance for natural-language queries (e.g. “help with TikTok”) without code changes.

## 6. Contact intent & fallbacks

When the user types phrases like “contact”, “get in touch”, “talk to someone”, a **Contact** result is prepended client-side and links to `/agency/contact`. No API call.

## Summary

1. Set **ALGOLIA_ADMIN_KEY** in `.env.local` (server-only; for sync and server search). Never expose it.
2. Set **NEXT_PUBLIC_ALGOLIA_APP_ID** and **NEXT_PUBLIC_ALGOLIA_SEARCH_KEY** (search-only key) for client-side search.
3. Run **POST /api/admin/sync-search** (with `SYNC_SECRET` header if set).
4. Home and learn search use InstantSearch in the browser with the search-only key. When there are 0 hits, home shows **"Suggested for you"**.
5. Add **synonyms** in the Algolia dashboard (e.g. socials → social) for better matching.
6. Optionally enable **Semantic Search** on the index if your plan supports it.
