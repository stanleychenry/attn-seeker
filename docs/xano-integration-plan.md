# Plan: Xano data in this app (and what we can’t see from the live site)

## What you asked

1. Retrieve data from **Xano** in this Next.js app.
2. See how **www.attnseeker.com** (Webflow) interacts with and pulls data.
3. Use the **Webflow API** to see how to replicate that here.

---

## What I can and can’t do

### Can do (in this repo)

- **Use the Xano API you already documented** in `docs/api-reference.md`: base URL, endpoints, and the fact that Xano expects the Memberstack auth token in the `Authorization` header.
- **Get the Memberstack token on the client** via the Memberstack DOM SDK (e.g. `getMemberCookie()` or equivalent) and send it with every Xano request.
- **Replace mock data** in `use-seekers`, store, leaderboard, and game pages with real Xano calls, using the existing types in `src/types/seekers.ts` and aligning response shapes as we discover them.

### Cannot do (from here)

- **Inspect how the live Webflow site “talks to” Xano at runtime.**  
  I can only fetch the public HTML of attnseeker.com. That doesn’t show:
  - Which JavaScript runs (e.g. Webflow custom code, embeds, or third‑party scripts).
  - What requests are made (Xano URLs, headers, body).
  - How the Memberstack token is passed to Xano on the live site.  
  So I can’t “see” the exact integration on attnseeker.com; we replicate behaviour using your docs and this codebase.

- **Use the Webflow API to “replicate” the live site’s Xano integration.**  
  The Webflow API (with your existing API key) is for:
  - **CMS/Collections**: we already use it for content (pages, podcasts, events, etc.) in this app.
  - **Sites, pages, custom code blocks**: we can list custom code blocks and registered scripts for a site (e.g. script names/IDs and where they’re applied).  
  It does **not** expose:
  - The actual logic inside that custom code (e.g. “call this Xano endpoint with this payload”).
  - How Webflow’s front-end is wired to Xano in the published site.  
  So the Webflow API is useful for content and for auditing where custom code runs, but not for “copying” the exact Xano integration from the live site. We’ll replicate using your api-reference and, if needed, any notes you have from the Webflow/Xano setup.

---

## Plan for pulling Xano data into this app

### 1. Env and config

- **Done:** `NEXT_PUBLIC_XANO_BASE_URL` in `.env.local` (default: `https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8`). Client in `src/lib/xano.ts`.
- If Xano ever needs an API key or extra headers, add those to env (e.g. server-only) and document in `docs/api-reference.md`.

### 2. Auth token for Xano

- Xano expects the **Memberstack auth token** in the `Authorization` header (per api-reference).
- In this app, **only the browser** has the Memberstack session. So:
  - **Option A (recommended):**  
    - Expose a small **Next.js API route** (e.g. `/api/seekers/me`, `/api/seekers/activity`, etc.) that the front end calls.
    - Front end sends the Memberstack token (e.g. from `getMemberstack().then(ms => ms.getMemberCookie())` or equivalent) in a header or cookie.
    - The API route forwards the request to Xano with `Authorization: Bearer <token>` (or whatever format Xano expects).
  - **Option B:**  
    - Call Xano **directly from the client** (fetch from browser) with the Memberstack token in the `Authorization` header.
- Decide whether your Xano instance allows CORS from your Next origin; if not, Option A is required. Then implement one approach and use it for all Xano calls.

### 3. Xano client in this repo

- Add a **client** (e.g. `src/lib/xano.ts` or `src/lib/xano-client.ts`) that:
  - Takes the Memberstack token (or a “get token” function).
  - Builds request URL from base URL + path (e.g. `/seekers/me`, `/seekers/store/products`).
  - Sets `Authorization` and any other required headers.
  - Uses the existing **types** in `src/types/seekers.ts` and maps Xano responses to those types (with small adapters if field names differ).

### 4. Replace mocks with Xano

- **`use-seekers`**  
  - When the user is logged in, call Xano `GET /seekers/me` (via the client above) instead of returning `MOCK_SEEKERS_USER`.
  - Map the response to `SeekersUser` (and activity if returned there or from a separate endpoint).
  - Keep loading and error state; optionally keep mock as fallback in dev if you want.

- **Seekers dashboard, profile, store, leaderboard, games**  
  - Use the same Xano client for:
    - `GET /seekers/me` (profile, points, streak, etc.)
    - `GET /seekers/store/products` (store page)
    - `GET /seekers/leaderboard/:game` (leaderboards)
    - `GET /seekers/game/daily/:game`, `POST /seekers/game/submit/:game`, `GET /seekers/game/streak` (games).
  - Replace any remaining mock data (e.g. `MOCK_STORE_PRODUCTS`, leaderboard mocks) with these calls.

### 5. Optional: use Webflow API to inspect custom code

- If you want to **see where** the live site uses custom code (e.g. which pages have scripts that might call Xano):
  - Use Webflow API with a token that has **custom_code:read** (and sites/pages read).
  - Call e.g. `GET /v2/sites/:site_id/custom_code/blocks` and/or registered scripts.
  - That gives script IDs and where they’re applied (site vs page), not the actual Xano logic; useful for your own audit, not for auto-replicating the integration.

### 6. Align with the live site (your input)

- **If you have access to Webflow custom code or Xano docs:**  
  - Paste or describe how the live site gets the Memberstack token and sends it to Xano (header name, format).
  - Note any differences in endpoints or payloads (e.g. different path or request body) so we can match them in this app.

- **If Xano responses don’t match `src/types/seekers.ts`:**  
  - We can either update the types to match Xano, or add a thin mapping layer in the Xano client so the rest of the app keeps using the existing types.

---

## Summary

| Goal | Approach |
|------|----------|
| Get data from Xano | Use documented base URL + endpoints; add a small Xano client that sends the Memberstack token in `Authorization`. |
| “See how attnseeker.com does it” | Not possible from here; we rely on your api-reference and any notes you have from the Webflow/Xano setup. |
| Use Webflow API | Keep using it for CMS content (already done). Optionally use custom code/scripts APIs to see where custom code runs, not to copy Xano integration. |
| Replicate here | Implement the plan above (env → auth token → Xano client → replace mocks); adjust types or mapping once we see real Xano responses. |

If you tell me your preference (client-only vs API-route proxy and whether you have CORS or token format details), I can outline the exact code changes next (files to add/edit and example `fetch`/route code).
