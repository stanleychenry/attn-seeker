# Home search setup (Algolia global index)

The home page search uses **client-side Algolia** (same pattern as /learn): one index, instant results, no server round-trip.

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

1. Set **ALGOLIA_ADMIN_KEY** in `.env.local` (Admin key with write access).
2. Run **POST /api/admin/sync-search** (with `SYNC_SECRET` header if set).
3. Home search uses **InstantSearch** and index **attn_seeker_global** (client-side, fast). Index includes: articles, services, case studies, show episodes, podcast episodes, **shows**, **podcasts**, **topics**, teams, events. Services and events have **keywords** so phrases like "help with socials" and "what events" match.
4. When there are 0 hits, the UI shows **"Suggested for you"** (Contact, Services, Events, Podcasts, Shows, Articles) so the search never shows only "no results".
5. Add **synonyms** in the Algolia dashboard (e.g. socials → social) for better natural-language matching.
6. Optionally enable **Semantic Search** on the index if your plan supports it.
