# Xano + Memberstack JWT auth – setup and status

This doc records the issue that started this work, what was done to fix it, and where things stand. Use it to redo or continue the setup later.

---

## 1. What started this

We needed to:

1. **Algolia** – Keep search working the same (client-side, instant) but stop exposing API keys that shouldn’t be public.
2. **Xano** – Harden security: endpoints should require auth, `get_all_users` should not be public, and user identity should come from the JWT (Memberstack), not from email in the URL.
3. **Xano middleware** – Get a single, correct Lambda script for the “Memberstack JWT auth” middleware that runs in Xano without errors, so the backend can verify the Memberstack token and use `auth_member_id` in endpoints.

The chat focused mainly on **(3)** – the Lambda script and how to wire it in Xano so it works reliably.

---

## 2. What we’ve done so far

### Algolia (done)

- Restored **client-side** search (InstantSearch + `liteClient`) for home and learn using a **search-only** key in `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`.
- Regenerated the **admin** key; it lives only in `ALGOLIA_ADMIN_KEY` (server-only).
- Docs: `docs/home-search-setup.md`, `DEPLOY_VERCEL.md` – two keys (search-only in browser, admin server-only).
- Removed server-only search routes `/api/search/global` and `/api/search/learn`; home/learn use client-side Algolia again.

### Xano (this repo)

- **`src/lib/memberstack-token.ts`** – Reads the Memberstack JWT from `_ms-mid` (localStorage or cookie). Only works in the browser; returns `null` on the server.
- **`src/lib/xano.ts`** – All Xano requests send `Authorization: Bearer <token>` via `authHeaders()` using that JWT.
- **`docs/xano-security.md`** – Checklist for the Xano dashboard (auth on endpoints, lock `get_all_users`, use JWT subject for identity).
- **`docs/xano-memberstack-middleware-xanoscript.md`** – Full instructions: env vars, Lambda script, XanoScript snippet, and **visual stack** steps (including “Build the Lambda input”).
- **`docs/xano-memberstack-middleware.xanoscript`** – XanoScript snippet for the middleware (no `params`; Lambda expects a single `input` object).

### Lambda script (final version)

We fixed several earlier mistakes and landed on one script that:

- Uses only the **`input`** parameter (no bare `vars` or `env`), so there are no “input/vars/env is not defined” errors.
- Uses **async/await** for `fetch` and `res.text()` so we never use `.status` or `.text` on a Promise.
- Reads Memberstack’s real response shape: **`data.data.id`** first (per [Memberstack verify-token API](https://developers.memberstack.com/admin-rest-api/verification)), then fallbacks.
- Accepts multiple **input shapes**: `input.headers` + `input.secret`, or `input.http_headers` + `input.MEMBERSTACK_*`, or `input.vars` + `input.env`.
- Has **`// @ts-nocheck`** at the top to avoid editor/linter “Cannot find name” errors.
- Returns `{ member_id, error }` so Xano preconditions can halt with “unauthorized” and merge `auth_member_id`.

The canonical script is in **`docs/xano-memberstack-middleware-xanoscript.md`** (section 2, “Lambda code (JavaScript) — copy this exactly”). You can also copy it from that file when setting up the Lambda in Xano.

### Critical: Lambda must receive headers + secret

The Lambda only receives what you pass into it. If you only pass the output of “Get Environment Variables” (`env`), it does **not** automatically see the request headers. So:

- In the **visual stack** you must add a step that **builds one object** containing both:
  - **Request headers** (e.g. from middleware input `vars.http_headers` or whatever Xano uses for incoming headers),
  - **Secret** (e.g. `env.MEMBERSTACK_SECRET_KEY` or `env.MEMBERSTACK_API_KEY`).
- Set the **Lambda’s input** to that object (e.g. `context`).  
If you don’t, the Lambda will return “Missing or invalid Authorization header” and the API will respond with “Unauthorized” (often with an empty payload).

---

## 3. Where we are now

- **Algolia** – Done; client-side search uses search-only key; admin key is server-only.
- **Xano (app side)** – Done; app sends `Authorization: Bearer <token>` on Xano requests via `xano.ts` and `memberstack-token.ts`.
- **Xano (dashboard)** – You have the checklist in `docs/xano-security.md`; endpoints should require auth and use `auth_member_id` from the middleware instead of email in the URL; `get_all_users` should be locked.
- **Xano middleware + Lambda** – Script and docs are final. If you still get:
  - **`{"code":"ERROR_CODE_UNAUTHORIZED","message":"Unauthorized","payload":""}`**
  then either:
  1. The **Lambda isn’t getting** the request headers (or the secret) because the “Build the Lambda input” step is missing or not wired to the Lambda’s input, or
  2. The **request is made from the server** (e.g. SSR/API route), where `getMemberstackToken()` is `null`, so no `Authorization` header is sent, or
  3. The **Memberstack token** is invalid/expired or the wrong key is used in Xano.

**Next steps when you pick this up:**

1. In Xano middleware (visual stack), confirm there is a step that builds `{ headers: <request headers>, secret: env.MEMBERSTACK_SECRET_KEY }` (or equivalent) and that the **Lambda’s input** is set to that object.
2. Run a request from the **browser** while **logged in** to Memberstack so the app sends `Authorization: Bearer <token>`.
3. In Xano’s debugger, inspect the **Lambda step output** (`auth_result`) to see whether the Lambda returns an `error` message (e.g. “Missing or invalid Authorization header”, “Invalid or expired token”) or `member_id`.
4. Optionally, change the second precondition in the middleware so that when `member_id` is null, the API returns **`auth_result.error`** (when present) instead of a generic “Unauthorized”, so the response payload shows the real reason.

---

## 4. File reference

| File | Purpose |
|------|--------|
| `docs/xano-security.md` | Xano dashboard checklist (auth, get_all_users, use JWT) |
| `docs/xano-memberstack-middleware-xanoscript.md` | Full middleware guide: env, **Lambda script**, XanoScript, visual stack steps |
| `docs/xano-memberstack-middleware.xanoscript` | XanoScript snippet for the middleware |
| `docs/xano-memberstack-auth-setup.md` | This file – issue, what we did, current status |
| `src/lib/memberstack-token.ts` | Gets Memberstack JWT from browser (`_ms-mid`) |
| `src/lib/xano.ts` | Xano client; sends `Authorization: Bearer <token>` |

---

## 5. Quick copy: Lambda script

When you need to paste the Lambda into Xano again, use the script in **`docs/xano-memberstack-middleware-xanoscript.md`** section 2 (“Lambda code (JavaScript) — copy this exactly”). It’s the single source of truth. Ensure the Lambda’s **input** in Xano is the object that contains both request headers and the Memberstack secret.
