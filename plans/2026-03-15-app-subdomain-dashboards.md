# Plan: app.attnseeker.com — Staff & Client Dashboard Subdomain

**Created:** 2026-03-15
**Status:** [x] Complete — implemented 2026-03-15

---

## What This Is

Add `app.attnseeker.com` as a subdomain that serves a separate dashboard product for attn:seeker staff and clients. Users log in the same way they do for Seekers (Memberstack passwordless email code, via the ProfileCircle dropdown). Based on their Memberstack plan, they are either shown the Seekers loyalty dashboard (existing behaviour) or redirected to `app.attnseeker.com/dashboard` (new client/staff dashboard).

Everything runs in the same codebase and the same Vercel deployment — just different routes surfaced under a different hostname.

---

## Current State

- Auth: Memberstack via `hooks/use-auth.tsx`. Currently exposes `id`, `name`, `email` only — plan data is not read or stored.
- SeekersPanel (`src/components/layout/seekers-panel.tsx`): hardcoded links to `/seekers/dashboard`, `/seekers/store`, `/seekers/game`, `/seekers/leaderboard`.
- No `middleware.ts` exists.
- `client-layout.tsx`: shows/hides Nav and Footer based on a hardcoded path list.
- No `app.*` routes exist in the codebase.

---

## Goal

After this is built:

1. `app.attnseeker.com` routes to a new set of dashboard pages inside this Next.js app.
2. Users on a **Client** or **Staff** Memberstack plan who open the ProfileCircle dropdown see a link to `app.attnseeker.com/dashboard` instead of the Seekers loyalty links.
3. Users without a client/staff plan trying to access `app.attnseeker.com` are redirected to `attnseeker.com`.
4. The main site, Seekers loyalty pages, and the new dashboard pages cannot break each other — they live in separate route groups.
5. Nav and Footer from the main site do not appear on dashboard pages.

---

## Prerequisites (Stanley does these manually first)

These must be done before any code is deployed to production.

### 1. Create Memberstack plans
In the Memberstack dashboard, create two plans if they don't exist:
- **Client** plan
- **Staff** plan

Copy the Plan IDs (format: `pln_xxxxxxxx`). You'll need to add them as env vars.

### 2. Add env vars in Vercel
Add to all Vercel environments (Production, Preview, Development):

```
NEXT_PUBLIC_APP_URL=https://app.attnseeker.com
NEXT_PUBLIC_MEMBERSTACK_CLIENT_PLAN_ID=pln_xxxxxxxx
NEXT_PUBLIC_MEMBERSTACK_STAFF_PLAN_ID=pln_xxxxxxxx
```

Also add to `.env.local` for local development:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MEMBERSTACK_CLIENT_PLAN_ID=pln_xxxxxxxx
NEXT_PUBLIC_MEMBERSTACK_STAFF_PLAN_ID=pln_xxxxxxxx
```

(For local dev, the subdomain routing won't apply — you'll access dashboard pages directly at `/app/dashboard`.)

### 3. Add the domain to Vercel
In the Vercel project settings → Domains, add `app.attnseeker.com`.

### 4. Add a CNAME in DNS
In your DNS provider (wherever `attnseeker.com` is managed):
```
Type:  CNAME
Name:  app
Value: cname.vercel-dns.com
```

### 5. Confirm Memberstack cookie scope
Memberstack needs to set its auth cookie on `.attnseeker.com` (with the leading dot) so it's readable on `app.attnseeker.com`. Check in Memberstack docs or dashboard whether cross-subdomain cookie sharing is supported on your plan. If it isn't, the workaround is to pass the token as a URL param on redirect — flag this before deploying.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Reads hostname; if `app.*`, rewrites to `/app/*` routes |
| `src/app/(app)/layout.tsx` | Dashboard shell — no main site nav/footer; own auth guard |
| `src/app/(app)/dashboard/page.tsx` | Placeholder dashboard page (client + staff land here) |

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/use-auth.tsx` | Expose `planIds: string[]` on `AuthUser` — read from `member.planConnections` |
| `src/components/layout/seekers-panel.tsx` | If user has client/staff plan, show link to `app.attnseeker.com/dashboard` instead of Seekers links |
| `src/components/layout/client-layout.tsx` | Suppress Nav/Footer on `/app/*` paths (for local dev parity) |

---

## Step-by-Step Tasks

### Step 1 — Expose plan data in AuthUser

**File:** `src/hooks/use-auth.tsx`

- Add `planIds: string[]` to the `AuthUser` interface
- In `memberToUser()`, read `member.planConnections` (array of `{ planId: string, active: boolean }`) and extract active plan IDs into `planIds`
- No other changes to the auth flow

### Step 2 — Create middleware.ts

**File:** `src/middleware.ts`

- Check `request.headers.get('host')`
- If host starts with `app.` (i.e. `app.attnseeker.com` in production or `app.localhost` in dev), rewrite the URL: strip the leading `/` and prepend `/app`
  - e.g. `app.attnseeker.com/dashboard` → internal path `/app/dashboard`
  - e.g. `app.attnseeker.com/` → internal path `/app/dashboard` (redirect root to dashboard)
- All other hosts: pass through unchanged
- Matcher: exclude `_next/static`, `_next/image`, `favicon.ico`, and public assets

```ts
// Rough shape — implementation fills this in
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const isAppSubdomain = host.startsWith('app.')

  if (isAppSubdomain) {
    const pathname = request.nextUrl.pathname
    const newPath = pathname === '/' ? '/app/dashboard' : `/app${pathname}`
    return NextResponse.rewrite(new URL(newPath, request.url))
  }

  return NextResponse.next()
}
```

### Step 3 — Create dashboard route group and layout

**File:** `src/app/(app)/layout.tsx`

- Route group `(app)` — the parentheses mean the folder name doesn't appear in the URL
- This layout does NOT include `<Nav>` or `<Footer>`
- Wraps children in `AuthProvider` (needs auth context)
- Includes a client-side auth guard: if not logged in → redirect to `attnseeker.com/seekers/login`; if logged in but no client/staff plan → redirect to `attnseeker.com`
- The guard reads `NEXT_PUBLIC_MEMBERSTACK_CLIENT_PLAN_ID` and `NEXT_PUBLIC_MEMBERSTACK_STAFF_PLAN_ID` to check

**File:** `src/app/(app)/dashboard/page.tsx`

- Placeholder page — "you're in, dashboard coming soon" or a bare shell
- This is where the real dashboard gets built out later

### Step 4 — Update SeekersPanel

**File:** `src/components/layout/seekers-panel.tsx`

- Import `useAuth` to get `user.planIds`
- Read `NEXT_PUBLIC_MEMBERSTACK_CLIENT_PLAN_ID` and `NEXT_PUBLIC_MEMBERSTACK_STAFF_PLAN_ID` from env
- Rename the existing "dashboard" link label to **"seekers dashboard"** (for all users)
- If user has the **client** plan ID in their `planIds`, add an extra link above the Seekers links: **"client dashboard"** → `${NEXT_PUBLIC_APP_URL}/dashboard`
- If user has the **staff** plan ID, add an extra link above the Seekers links: **"staff dashboard"** → `${NEXT_PUBLIC_APP_URL}/dashboard`
- All existing Seekers links (store, games, leaderboard) remain visible for everyone — client/staff users can still access Seekers if they have a Seekers account
- The extra dashboard link is additive, not a replacement

### Step 5 — Update client-layout.tsx

**File:** `src/components/layout/client-layout.tsx`

- Add `/app` to the `NO_NAV_FOOTER_PATHS` list so that on local dev (where middleware doesn't run), nav/footer are still suppressed on `/app/*` pages

---

## What Could Go Wrong / Decisions Needed

### Memberstack cookie scope
The biggest risk. If Memberstack only sets its cookie on `attnseeker.com` (no leading dot), the auth token won't be readable on `app.attnseeker.com`. **Check this before deploying.** If it's an issue, the fallback is to redirect the user from the main site to `app.attnseeker.com/dashboard?token=<jwt>` and pick it up on the other side — more work, but solvable.

### What happens to Seekers users who end up at app.attnseeker.com
They get redirected to `attnseeker.com`. Since client/staff and Seekers are now additive (not mutually exclusive), someone could legitimately have both plans. The auth guard on `app.attnseeker.com` only checks for client or staff plan — having a Seekers-only plan is not enough to get in.

### Dashboard content
This plan only creates the shell (auth guard + placeholder page). The actual dashboard UI is a separate build. Don't start that until this infrastructure is confirmed working.

### Local development
On localhost, the subdomain routing doesn't apply. Dashboard pages are accessible at `localhost:3000/app/dashboard` directly. The auth guard still runs but `NEXT_PUBLIC_APP_URL` should be set to `http://localhost:3000` so redirects work correctly.

---

## Before/After

**Before:**
- ProfileCircle → SeekersPanel → links to `/seekers/dashboard`, store, games, leaderboard for everyone

**After:**
- ProfileCircle → SeekersPanel for a standard Seekers member: same as before, but "dashboard" link now labelled "seekers dashboard"
- ProfileCircle → SeekersPanel for a client: "client dashboard" link (new, top) + all existing Seekers links below
- ProfileCircle → SeekersPanel for a staff member: "staff dashboard" link (new, top) + all existing Seekers links below
- `app.attnseeker.com/dashboard` → dashboard shell, gated by plan

---

## Out of Scope for This Plan

- Actual dashboard UI/content (separate plan when ready)
- Role-based access within the dashboard (staff vs client seeing different things)
- Separate Xano API endpoints for client data
- Staging subdomain (`app-staging.attnseeker.com`) — can add later
