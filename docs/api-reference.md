# api reference

## xano (seekers backend)

Base URL: `https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8` (root: `https://x3yo-h8fa-1fj9.a2.xano.io`).

All endpoints require Memberstack auth token in Authorization header.

### user endpoints
- `GET /seekers/me` - Get current user's seekers profile (tier, points, streak, activity)
- `POST /seekers/activity` - Log an activity (game completion, article read, etc.)
- `GET /seekers/leaderboard/:game` - Get leaderboard for a specific game
- `GET /seekers/store/products` - Get current rewards store products
- `POST /seekers/store/redeem` - Redeem yap dollars for a product

### game endpoints
- `GET /seekers/game/daily/:game` - Get today's puzzle data
- `POST /seekers/game/submit/:game` - Submit game completion (time, score)
- `GET /seekers/game/streak` - Get current streak info

## algolia (search)

- App ID: `IN9YQA8T86`
- Search API Key: `5bdded9a269637027ce5f8a477d3a3b5` (public, frontend)
- Index: `yap_articles`

## memberstack (auth)

- Env: `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY` (MemberStack dashboard → Settings → Application → Memberstack App ID). Use Test Mode key (`pk_sb_...`) from Dev Tools for development; Live key (`pk_...`) for production.
- Passwordless login/signup: 6-digit code sent to email via `sendMemberLoginPasswordlessEmail` / `sendMemberSignupPasswordlessEmail`; completion via `loginMemberPasswordless` / `signupMemberPasswordless`. Email templates configurable in MemberStack dashboard → Settings → Emails.
- Login, signup, logout handled through `@memberstack/dom` (init in `src/lib/memberstack.ts`); auth state via `onAuthChange` and `getCurrentMember`.

## beehiiv (newsletter)

- Pub ID: `pub_abc781a5-9b9c-401f-b757-d8e4c544a87f`
- Subscribe endpoint used for newsletter signup forms

## notes

All API integrations are currently stubbed with mock data. The wire-up phase will replace stubs with real API calls. Data shapes in src/types/ match the expected API responses.
