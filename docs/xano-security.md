# Xano security checklist

The front end now sends the **Memberstack JWT** on every request to Xano (`Authorization: Bearer <token>`). So Xano can require authentication and identify the user from the token instead of trusting the email in the URL.

**You need to make these changes in the Xano dashboard** (we don’t have access to your Xano project). Do them in order.

---

## 1. Turn on authentication for sensitive endpoints

In Xano:

- Open your **API** (the one used by this app, e.g. `x3yo-h8fa-1fj9.a2.xano.io`).
- For each of these endpoints, add **authentication** so the request must include a valid Memberstack JWT:
  - `get_dashboard`
  - `get_user_profile`
  - `submit_game_result`
  - `redeem_reward`
  - `update_profile`
  - `seekers/update_email_frequency`
  - `seekers/delete_account`
  - Any other endpoint that returns or changes data for the logged-in user.

Xano has a built-in way to check the `Authorization` header and validate Memberstack JWTs. Use that (or a custom middleware that verifies the JWT with Memberstack and then uses the token’s **subject** as the user id).

Until this is on, anyone can still call these endpoints without logging in. Once it’s on, unauthenticated requests should get 401.

---

## 2. Lock `get_all_users` to admin only

- **Do not** leave `get_all_users` in a public API group that the client can call.
- Either:
  - **Remove** `get_all_users` from the public API, or
  - **Move** it to an admin-only API group that is protected (e.g. secret key or IP allowlist) and never called from the browser.

After this, the client cannot request a list of all users and their emails.

---

## 3. Identify the user from the JWT, not from the URL

- Right now the app still sends `email` in the URL or body for some endpoints (e.g. `get_dashboard?email=...`). That’s so Xano can find the user.
- After JWT auth is on, Xano should **ignore** the email in the request for “who is this user?” and instead use the **subject (sub)** (or member id) from the verified JWT. That way nobody can pretend to be another user by changing the email in the URL.
- In Xano, in your auth middleware or endpoint logic: verify the JWT, then read the subject/member id from the token and use that to load the user. Only if you still need email for something (e.g. display) should you look it up from your database by that user id.

---

## Summary

| What | Where | Action |
|------|--------|--------|
| Send JWT to Xano | This codebase | Done. Every Xano request includes `Authorization: Bearer <token>` when the user is logged in. |
| Require auth on endpoints | Xano dashboard | Add Memberstack JWT check to `get_dashboard`, `get_user_profile`, `submit_game_result`, `redeem_reward`, `update_profile`, etc. |
| Lock `get_all_users` | Xano dashboard | Remove from public API or move to admin-only group. |
| User identity from JWT | Xano dashboard | In protected endpoints, use the JWT subject (member id) as the user identifier, not the email from the URL. |

If you need step-by-step for your Xano version (e.g. where to add “Auth” or “Middleware”), check Xano’s docs for “API authentication” or “JWT” and use their Memberstack integration if they have one.
