# attn-seeker — Project Overview for AI Context

This document describes everything built in this project so that another AI (or developer) can understand the full system without reading the entire codebase.

---

## 1. What This Project Is

**attn-seeker** is a Next.js 14 website for **The Attention Seeker (TAS)** — an agency and media company. The site serves:

- **Public marketing site**: agency info, services, case studies, team, careers, contact, events, books, about.
- **Content hub**: newsletter/learn (YAP articles), shows (video), podcasts (audio), with topic-based navigation.
- **Community/loyalty programme (“Seekers”)**: members sign up via Memberstack, earn status points and “YAP dollars” via games and engagement, view leaderboards, redeem rewards from a store, and manage profile — all backed by a Xano API.

The codebase uses:

- **Next.js 14** (App Router), **React 18**, **TypeScript**, **Tailwind CSS**, **Framer Motion**.
- **Webflow CMS** (API) as the single source of truth for marketing/content data.
- **Algolia** for search (global index sync from CMS + server-side and client-side search).
- **Memberstack** for authentication (passwordless email codes).
- **Xano** for Seekers backend (dashboard, store, profile, games, leaderboards); Xano validates Memberstack JWT.
- **Resend** for sending contact form emails.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Next.js App (attn-seeker)                      │
├─────────────────────────────────────────────────────────────────────────┤
│  Client                                                                  │
│  • React components, hooks (use-auth, use-seekers, use-search)           │
│  • Home search → POST /api/search                                        │
│  • Learn search → Algolia InstantSearch (yap_articles index)            │
│  • Seekers pages → Xano API (with Memberstack JWT in Authorization)     │
├─────────────────────────────────────────────────────────────────────────┤
│  Server                                                                  │
│  • App Router pages: fetch from lib/cms.ts (Webflow) or render static   │
│  • API routes: /api/contact (Resend), /api/search (Algolia + CMS),       │
│    /api/admin/sync-search (Algolia sync), /api/seekers/leaderboard      │
│    (proxy to Xano), /go/random (redirect to random CMS page)             │
├─────────────────────────────────────────────────────────────────────────┤
│  Data sources                                                            │
│  • Webflow CMS (lib/webflow.ts, lib/cms.ts, lib/webflow-mappers.ts)     │
│  • Algolia (attn_seeker_global + yap_articles; lib/algolia-sync,         │
│    lib/algolia-server.ts, lib/run-algolia-sync.ts)                       │
│  • Xano (lib/xano.ts) — dashboard, store, profile, games, leaderboard   │
│  • Memberstack (@memberstack/dom, @memberstack/react) — auth             │
└─────────────────────────────────────────────────────────────────────────┘
```

- **CMS content** is read at request time (or at build time where revalidate is set) via `lib/cms.ts`, which calls `lib/webflow.ts` and maps raw Webflow items with `lib/webflow-mappers.ts`.
- **Search**: Home page search calls `POST /api/search`, which uses Algolia for YAP articles, fetches other content types from CMS and filters by query, and applies “search intent” (contact/service/person/event) to order or inject results. Learn page uses client-side InstantSearch on the `yap_articles` Algolia index. A separate **global** index `attn_seeker_global` is populated by the sync script and can be used for unified search; the sync runs via `POST /api/admin/sync-search` or `npm run sync-search`.
- **Seekers**: Browser gets Memberstack JWT (in cookie/localStorage `_ms-mid`). `lib/memberstack-token.ts` reads it and `lib/xano.ts` sends it as `Authorization: Bearer <token>` to Xano. Xano is expected to validate the token with Memberstack and identify the user by the token subject (see `docs/xano-security.md`).

---

## 3. Repository Layout (Important Paths)

| Path | Purpose |
|------|--------|
| `src/app/` | App Router: pages, layouts, route handlers. |
| `src/app/api/` | API routes: contact, search, admin/sync-search, seekers/leaderboard, debug. |
| `src/components/` | Reusable UI: layout (nav, footer, client-layout, profile-circle, seekers-panel), search (home-search, search-bar, quick-pills), learn (learn-search), ui (heading, body, button, card, section, etc.). |
| `src/lib/` | Core logic: cms.ts (CMS accessors), webflow.ts (Webflow API), webflow-mappers.ts, xano.ts (Xano client), memberstack.ts, memberstack-token.ts, algolia-sync.ts, algolia-server.ts, run-algolia-sync.ts, search-intent.ts, constants.ts, utils.ts. |
| `src/hooks/` | use-auth.tsx (Memberstack auth state and actions), use-seekers.ts (dashboard + activity from Xano), use-search.tsx (search UI state). |
| `src/types/` | cms.ts, search.ts, seekers.ts. |
| `src/data/` | Mock data and search-catalog (used for fallbacks / “suggested for you” style data where needed). |
| `scripts/sync-algolia.ts` | Standalone script to run Algolia sync (loads .env.local, calls runAlgoliaSync). |
| `docs/` | Design system, CMS structure, home search setup, Xano security, page map, API reference, etc. |

---

## 4. Routing and Pages (from docs/page-map.md)

- **Home**: `/` — Full-viewport red hero, search bar, quick pills, stats. No nav/footer on homepage.
- **Agency**: `/agency`, `/agency/services`, `/agency/services/[slug]`, `/agency/work`, `/agency/work/[slug]`, `/agency/contact`, `/agency/team`, `/agency/team/[slug]`, `/agency/careers`, `/agency/careers/[slug]`. Data from Webflow (Services, Case Studies, Teams, Jobs).
- **Learn**: `/learn`, `/learn/[topicSlug]`. Topics + YAP Articles from CMS; learn page has Beehiv newsletter embed and LearnSearch (Algolia InstantSearch on `yap_articles`).
- **Articles**: `/yap-articles/[slug]` — single YAP article (CMS).
- **Shows**: `/shows`, `/shows/[slug]`, `/shows/[slug]/[episodeSlug]`. CMS: Shows, Show Episodes.
- **Podcasts**: `/podcasts`, `/podcasts/[slug]`, `/podcasts/[slug]/[episodeSlug]`. CMS: Podcasts, Podcast Episodes.
- **Events**: `/events`, `/events/[slug]`, `/events/series/[slug]`. CMS: Events, Events Series.
- **Books**: `/books`, `/books/[slug]`. CMS: Books.
- **About**: `/about` — static.
- **Join Seekers**: `/join-the-seekers` — static landing; CTAs to `/seekers/signup`.
- **Seekers (auth)**: `/seekers/login`, `/seekers/signup` — Memberstack passwordless (email code). Nav/footer hidden on these.
- **Seekers (app)**: `/seekers/dashboard`, `/seekers/store`, `/seekers/profile`, `/seekers/game`, `/seekers/game/shikaku`, `/seekers/game/akari`, `/seekers/game/mastermind`, `/seekers/leaderboard`, `/seekers/leaderboard/[game]`. All use Xano + Memberstack JWT.
- **Utility**: `/go/random` — 302 to a random URL from nav links + CMS slugs (articles, work, learn, shows, podcasts, events, series, services, careers). Optional `?json=1` returns `{ path }`.
- **Legal**: `/privacy-policy`, `/terms-and-conditions`.
- **Special**: `/webinar`, `/coaching`, `/workshop` (and sub-routes) — nav and footer are hidden (NO_NAV_FOOTER_PATHS in client-layout).

**SEO**: `src/app/robots.ts` returns a robots rule that disallows all crawlers (`disallow: "/"`). Root layout metadata also sets `robots: { index: false, follow: false }`. Change these when the site should be indexable.

---

## 5. Layout and Shell

- **Root layout** (`src/app/layout.tsx`): Wraps with `ClientLayout`, applies global CSS and metadata (title “attn:seeker”, robots noindex/nofollow).
- **ClientLayout** (`src/components/layout/client-layout.tsx`): Wraps app in `AuthProvider` and `SearchProvider`. Renders `Nav` and `Footer` except on homepage, auth pages (`/seekers/login`, `/seekers/signup`), and NO_NAV_FOOTER_PATHS (`/webinar`, `/coaching`, `/workshop`). Homepage has no nav/footer; other pages have footer.
- **Nav**: Logo, compact SearchBar (desktop), nav links (newsletter→/learn, podcasts, events, agency, contact), ProfileCircle (avatar + Seekers panel when logged in), mobile menu.
- **Footer**: Links including join the seekers, dashboard, rewards store, games, leaderboard, plus social and legal.
- **ProfileCircle**: Shows avatar (or initial) and tier; click opens SeekersPanel with links to dashboard, store, games, leaderboard and logout.

---

## 6. Content and CMS (Webflow)

- **Source**: Webflow API v2. Keys: `WEBFLOW_API_KEY` or `WEBFLOW_API_TOKEN`. Collection IDs are in `lib/webflow.ts` (Teams, Shows, Show Episodes, Podcasts, Podcast Episodes, YAP Articles, Landing Pages, Books, Events Series, Events, Topics, Jobs, Case Studies, Services).
- **Access layer**: `lib/cms.ts` exposes typed functions (e.g. `getTeams()`, `getTeamBySlug(slug)`, `getYapArticles()`, `getServices()`, `getCaseStudies()`, `getTopics()`, `getShows()`, `getShowEpisodes()`, `getPodcasts()`, `getPodcastEpisodes()`, `getEvents()`, `getEventSeriesSlugs()`, `getBooks()`, `getJobs()`, slug list getters, etc.). It uses `lib/webflow.ts` for raw API calls and `lib/webflow-mappers.ts` to map Webflow field names and option IDs to app types in `src/types/cms.ts`.
- **Caching**: Webflow layer caches collection items in memory during a process (e.g. build) to avoid duplicate requests and 406s. Option labels for dropdowns are loaded once and cached.
- **Types**: `src/types/cms.ts` defines Team, YAPArticle, Service, CaseStudy, Topic, Show, ShowEpisode, Podcast, PodcastEpisode, Event, EventSeries, Book, Job, etc., aligned with `docs/cms-structure.md`.
- **Images**: Next.js `remotePatterns` allow `uploads-ssl.webflow.com`, `cdn.prod.website-files.com`, `assets.website-files.com`, `*.webflow.com`.

---

## 7. Search System

### 7.1 Two Algolia indices

- **`attn_seeker_global`**: Unified index built by the sync. Contains articles, services, case studies, show episodes, podcast episodes, teams, events, shows, podcasts, topics. Used by the sync script and can be queried server-side via `lib/algolia-server.ts` `searchGlobalIndex()`. The **home search API** currently uses the `yap_articles` index for articles and CMS for other types (see below).
- **`yap_articles`**: YAP articles only. Used by server-side `searchYapArticles()` in `/api/search` and by client-side **Learn** page via InstantSearch (`LearnSearch` component, indexName `yap_articles`). If this index is maintained separately from the sync, it may need its own population path; the sync only writes to `attn_seeker_global`.

### 7.2 Sync (Algolia global index)

- **Entry points**: `POST /api/admin/sync-search` (optional header `Authorization: Bearer <SYNC_SECRET>`), or `npm run sync-search` (script in `scripts/sync-algolia.ts`).
- **Logic**: `lib/run-algolia-sync.ts` loads all relevant content from CMS via `lib/cms.ts`, builds records with `lib/algolia-sync.ts` `buildGlobalSearchRecords()`, and pushes to `attn_seeker_global` in batches (500). Requires `ALGOLIA_ADMIN_KEY` and `NEXT_PUBLIC_ALGOLIA_APP_ID`. Sync is often run after deploy (e.g. postbuild) so the global index is up to date.
- **Security**: Client must use a **search-only** Algolia key (`NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`). Admin key must never be exposed. See `docs/home-search-setup.md`.

### 7.3 Home page search

- **UI**: `HomeSearch` in `src/components/search/home-search.tsx`. Input debounced (300ms), calls `POST /api/search` with `{ query }`.
- **API**: `src/app/api/search/route.ts`. Accepts POST body `{ query }`. For articles it uses `searchYapArticles(query, 15)` (Algolia `yap_articles`). For services, case studies, topics, show episodes, podcast episodes, shows, podcasts, events, teams, books it fetches from CMS and filters with `matchQuery()` on text fields. **Search intent** is resolved via `resolveIntent(query)` in `lib/search-intent.ts`: keyword rules or optional OpenAI (contact/service/person/event/content). If intent is “contact”, a Contact result is prepended; if “service”, service results are sorted first. Returns `{ results }` array of `SearchResult` (type, title, description, url, thumbnailUrl, reason).
- **Contact intent**: Phrases like “contact”, “get in touch” cause a Contact result linking to `/agency/contact`. No separate API for that; it’s in the same search response.
- **Fallback**: When there are no results, home search can show “Suggested for you” style links (from constants/quick pills).

### 7.4 Learn page search

- **UI**: `LearnSearch` uses `react-instantsearch` with Algolia `liteClient`, index `yap_articles`. Client-side only; no server round-trip. Placeholder e.g. “search articles, topics, or ideas…”.

### 7.5 Nav search bar

- **SearchBar** (compact variant) appears in the main nav. It shares the same search behaviour as home (or can be wired to the same `/api/search` or a shared provider) so users get consistent results from any page.

### 7.6 Search intent

- **File**: `lib/search-intent.ts`. `getIntentFromKeywords()` matches contact/service/person/event phrases. `getIntentFromLLM(query)` optionally calls OpenAI to classify intent (contact, service, person, event, content). `resolveIntent(query)` uses LLM if `OPENAI_API_KEY` is set, else keywords. Used only in `/api/search`.

---

## 8. Authentication (Memberstack)

- **Provider**: `@memberstack/dom` initialised in browser with `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY` (useCookies: true). Singleton in `lib/memberstack.ts`.
- **React context**: `hooks/use-auth.tsx` provides `AuthProvider` with `user`, `isLoading`, `isLoggedIn`, `sendLoginCode`, `confirmLoginCode`, `sendSignupCode`, `confirmSignupCode`, `logout`. User is derived from Memberstack member (id, name from customFields or email prefix, email).
- **Token for Xano**: `lib/memberstack-token.ts` reads the Memberstack JWT from `localStorage` key `_ms-mid` or cookie. Used only in the browser. `lib/xano.ts` calls `getMemberstackToken()` and sends `Authorization: Bearer <token>` on every request to Xano so Xano can verify the token with Memberstack and identify the user (see `docs/xano-security.md`).

---

## 9. Seekers (Xano Backend)

- **Base URL**: `NEXT_PUBLIC_XANO_BASE_URL` or default `https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8`.
- **Client**: `lib/xano.ts`. All requests that need auth send the Memberstack JWT. The actual endpoint paths used in code are (Xano API group as in base URL):
  - **Dashboard**: `get_dashboard` (GET, query `email`; Xano should derive user from JWT when protected).
  - **Store**: `get_store_items`, `redeem_reward` (POST body `email`, `reward_id`).
  - **Profile**: `get_user_profile`, `update_profile`, `seekers/update_email_frequency`, `seekers/delete_account`.
  - **Games**: `submit_game_result` (POST: user_email, game_type, date, completed, time_seconds, difficulty, guesses_used, rectangles_used, bulbs_used as applicable).
  - **Leaderboard**: `get_game_leaderboard` (GET: game_type, date, limit).
  (If `docs/api-reference.md` lists different path names, treat `lib/xano.ts` as the source of truth for what the app calls.)

- **Types**: `src/types/seekers.ts` defines SeekersUser (tier, statusPoints, yapDollars, currentStreak, tierProgress, etc.), StoreProduct, LeaderboardEntry, ActivityItem. `lib/xano.ts` defines Xano-specific types (XanoDashboard, XanoStoreItem, XanoLeaderboardEntry, etc.).
- **Hook**: `use-seekers.ts` uses `useAuth()`, then fetches dashboard from Xano and maps to `SeekersUser` and activity list. Exposes `user`, `activity`, `isLoading`, `error`, `refetch`.

### 9.1 Seekers pages (brief)

- **Dashboard**: Shows tier, status points, YAP dollars, streak, progress to next tier, recent activity, recommended articles (mock), links to games, store, leaderboard.
- **Store**: Lists store items from Xano; redeem with YAP dollars; shows balance from dashboard.
- **Profile**: Load and update user profile (name, email, social, etc.) and email frequency; delete account.
- **Games**: Hub with three games — Shikaku, Akari, Mastermind. Each game is a client component that generates a daily puzzle (date-seeded), tracks time and moves, and on completion calls `submitGameResult()` with `game_type` (`shikaku` | `akari` | `mastermind`), date, time_seconds, and game-specific fields (e.g. guesses_used, rectangles_used, bulbs_used).
- **Leaderboard**: Hub page lists games; each game has `/seekers/leaderboard/[game]`. Leaderboard data is fetched from `GET /api/seekers/leaderboard?game_type=...&date=...&limit=...`, which proxies to Xano `get_game_leaderboard`.

### 9.2 Leaderboard API

- **Route**: `src/app/api/seekers/leaderboard/route.ts`. GET with query `game_type`, `date`, `limit`. Forwards to Xano `get_game_leaderboard`, returns array of entries. No auth required for reading leaderboard.

---

## 10. Contact Form

- **Page**: `src/app/agency/contact/page.tsx` — client form (name, email, phone, company, website, social handle, budget, hear about, goals). On submit: `POST /api/contact` with JSON body.
- **API**: `src/app/api/contact/route.ts`. Validates name and email, builds a text body, sends email via **Resend** to `CONTACT_TO_EMAIL` (default hello@attnseeker.com), from `CONTACT_FROM_EMAIL` / `CONTACT_FROM_NAME`. Requires `RESEND_API_KEY`.

---

## 11. Design and UI

- **Design system**: `docs/design-system.md` and `attn-seeker-design-system.md` describe brand, type (Obviously + Tiempos), colour (red, bone, black), components. Tailwind is used with custom colours/fonts.
- **UI components**: `src/components/ui/` — Heading, Body, Caption, Button, Card, Section, Container, SectionIntro, Input, Label, Tag, Stat, Testimonial, Divider, Grid, etc. Exported from `src/components/ui/index.ts`.
- **Constants**: `lib/constants.ts` — SITE_NAME, SITE_URL, NAV_LINKS, SOCIAL_LINKS, TIER_COLORS, STATS (follower count, view count, etc.).

---

## 12. Configuration and Environment

- **Next**: `next.config.mjs` — only image remotePatterns for Webflow. No base path or rewrites in the snippet seen.
- **Tailwind**: `tailwind.config.ts` — theme extended with project colours/fonts (e.g. red, bone, font-tiempos-text, font-obviously).
- **Env vars (summary)**:
  - **Webflow**: `WEBFLOW_API_KEY` or `WEBFLOW_API_TOKEN`
  - **Algolia**: `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` (search-only), `ALGOLIA_ADMIN_KEY` (server only)
  - **Sync**: `SYNC_SECRET` (optional, for protecting POST /api/admin/sync-search)
  - **Memberstack**: `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY`
  - **Xano**: `NEXT_PUBLIC_XANO_BASE_URL`
  - **Resend**: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `CONTACT_FROM_NAME`
  - **Search intent**: `OPENAI_API_KEY` (optional)
  - **Random redirect**: `NEXT_PUBLIC_SITE_ORIGIN` (optional, for /go/random)

---

## 13. Scripts and Build

- **npm run dev**: Next dev server.
- **npm run build**: Next build. Can be configured to run `npm run sync-search` in postbuild to refresh Algolia after deploy.
- **npm run sync-search**: Runs `scripts/sync-algolia.ts` (tsx), which loads `.env.local` and calls `runAlgoliaSync()`.

---

## 14. Data Flow Summary

1. **Public pages**: Next.js server fetches from `lib/cms.ts` (Webflow) and renders; some pages use revalidate (e.g. learn revalidate 300).
2. **Home search**: User types → debounce → POST /api/search → server runs intent + Algolia (yap_articles) + CMS fetches + matchQuery + return results.
3. **Learn search**: User types → InstantSearch (client) queries Algolia `yap_articles`.
4. **Seekers**: User logs in with Memberstack (email code) → JWT stored → Xano requests include JWT → dashboard/store/profile/games/leaderboard from Xano. Games submit results via `submitGameResult()`; leaderboard read via app API proxy to Xano.
5. **Contact**: Form submit → POST /api/contact → Resend sends email.
6. **Algolia**: Sync (manual or postbuild) pulls CMS via cms.ts, builds records for `attn_seeker_global`, pushes with admin key. Home search API uses `yap_articles` for articles; other types from CMS.

---

## 15. Key Files Quick Reference

| Concern | Primary files |
|--------|----------------|
| CMS access | `src/lib/cms.ts`, `src/lib/webflow.ts`, `src/lib/webflow-mappers.ts` |
| Types (CMS) | `src/types/cms.ts` |
| Search (home) | `src/components/search/home-search.tsx`, `src/app/api/search/route.ts`, `src/lib/search-intent.ts` |
| Search (learn) | `src/components/learn/learn-search.tsx` |
| Algolia sync | `src/lib/algolia-sync.ts`, `src/lib/run-algolia-sync.ts`, `src/app/api/admin/sync-search/route.ts`, `scripts/sync-algolia.ts` |
| Algolia server | `src/lib/algolia-server.ts` |
| Auth | `src/hooks/use-auth.tsx`, `src/lib/memberstack.ts`, `src/lib/memberstack-token.ts` |
| Seekers / Xano | `src/lib/xano.ts`, `src/hooks/use-seekers.ts`, `src/types/seekers.ts` |
| Layout | `src/app/layout.tsx`, `src/components/layout/client-layout.tsx`, `nav.tsx`, `footer.tsx`, `profile-circle.tsx`, `seekers-panel.tsx` |
| Contact | `src/app/agency/contact/page.tsx`, `src/app/api/contact/route.ts` |
| Random redirect | `src/app/go/random/route.ts` |
| Constants / design | `src/lib/constants.ts`, `docs/design-system.md`, `docs/cms-structure.md`, `docs/page-map.md` |
| Security (Xano) | `docs/xano-security.md`, `docs/home-search-setup.md` |
| SEO / robots | `src/app/robots.ts` (disallow all), root layout metadata (noindex/nofollow) |

---

This overview should give another AI or developer a complete mental model of what exists and how it fits together. For deeper detail on CMS schema, design tokens, or Xano middleware setup, use the referenced docs and the source files above.
