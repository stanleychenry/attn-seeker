# Xano security checklist

The front end now sends the **Memberstack JWT** on every request to Xano (`Authorization: Bearer <token>`). So Xano can require authentication and identify the user from the token instead of trusting the email in the URL.

**You need to make these changes in the Xano dashboard** (we don’t have access to your Xano project). Do them in order.

---

## Step-by-step walkthrough

### Where to work in Xano

1. Log in at [xano.io](https://xano.io) and open your **workspace** (the one that has the API used by this app: `x3yo-h8fa-1fj9.a2.xano.io`).
2. In the left sidebar you’ll see **API**, **Database**, **Library**, etc. Your endpoints live under **API** → an **API group** (e.g. the group that contains `get_dashboard`, `get_user_profile`, etc.).
3. Each endpoint has a **…** (three dots) or a settings icon. Click that to open **settings** for that endpoint.

### Important: Xano auth vs Memberstack

- Xano’s built-in **“Require Authentication”** is for **Xano’s own** JWT (from a Xano user table and Xano login). Your app logs users in with **Memberstack**, so the token we send is a **Memberstack** JWT.
- So you **cannot** just turn on “Require Authentication” and select a Xano table — Xano would reject the Memberstack token. You need to **validate the Memberstack JWT** yourself in Xano (middleware or first step of each endpoint).

---

## 1. Validate Memberstack JWT and protect sensitive endpoints

**Option A: Pre-middleware (recommended)** — one place for all protected endpoints.

1. **Get your Memberstack secret key**  
   In [Memberstack Dashboard](https://app.memberstack.com) → your app → **Settings** → **API** (or **Developer**), copy your **secret key** (`sk_...` for live, `sk_sb_...` for test). You’ll use this only in Xano, never in the front end.

2. **Store the secret in Xano**  
   In Xano, add an **environment variable** or **custom variable** (workspace or API group) for the Memberstack secret key, e.g. `MEMBERSTACK_SECRET_KEY`, so you can reference it in middleware without hardcoding.

3. **Create pre-middleware that verifies the Memberstack JWT**  
   - In Xano left sidebar: **Library** → **Middleware** → **Add Middleware**.  
   - Name it e.g. “Memberstack JWT auth”.  
   - Build the logic (function stack):
     - **Read the request** so you have the `Authorization` header (in middleware, request headers are usually available on the incoming request; see Xano’s “Get request header” or similar).
     - **If** there is no `Authorization` header or it doesn’t start with `Bearer `, **return 401** (e.g. with a short JSON body like `{"error":"Unauthorized"}`) and **halt**.
     - **Extract** the token (the part after `Bearer `).
     - **HTTP request:**  
       - Method: **POST**  
       - URL: `https://admin.memberstack.com/members/verify-token`  
       - Headers: `x-api-key: <your Memberstack secret key>`, `Content-Type: application/json`  
       - Body: `{"token": "<the extracted token>"}`  
     - **If** the response status is not 200 or the body indicates failure, **return 401** and **halt**.
     - **Parse** the response body. Memberstack returns data that includes the member id (e.g. `member_id` or in the decoded token payload).  
     - **Output** that member id so the rest of the API can use it (e.g. set a variable like `auth_member_id` and use **Merge** so it’s available in the endpoint’s function stack).
   - Save the middleware.

4. **Apply the middleware to the right endpoints**  
   - Go to **API** → the **API group** that contains `get_dashboard`, `get_user_profile`, `submit_game_result`, `redeem_reward`, `update_profile`, `seekers/update_email_frequency`, `seekers/delete_account`, and any other user-specific endpoints.  
   - Open **settings** for that API group (or for each endpoint) → **Middleware**.  
   - **Add PRE middleware** and select your “Memberstack JWT auth” middleware.  
   - Save. Now every request to those endpoints will run the middleware first; if the Memberstack token is missing or invalid, Xano returns 401 before your endpoint logic runs.

**Option B: First step inside each endpoint**  
If you prefer not to use middleware, add the same logic as the **first steps** of each protected endpoint’s function stack: read `Authorization` → extract token → POST to Memberstack verify-token → if invalid return 401 and halt → otherwise get member id and use it in the next steps.

**Endpoints to protect (at least):**  
`get_dashboard`, `get_user_profile`, `submit_game_result`, `redeem_reward`, `update_profile`, `seekers/update_email_frequency`, `seekers/delete_account`, and any other that return or change data for the logged-in user.

---

## 2. Lock `get_all_users` to admin only

1. In Xano, go to **API** and find the endpoint **`get_all_users`** (or whatever returns the full list of users).
2. Choose one:
   - **Remove it from the public API:** Delete or disable the endpoint in the API group that your website uses, so it’s no longer callable from the browser. You can keep the logic in a **Function** and call it only from other backend flows or an admin-only API if you need it later.
   - **Move it to an admin-only API group:** Create a new API group (e.g. “Admin”) that is **not** used by your front end. Put `get_all_users` there and protect that group (e.g. require a secret key in the header, or restrict by IP). Never call this group from the website.
3. Confirm: from the browser or Postman, the public base URL for your app should **not** expose an endpoint that returns all users. After this, the client cannot request a list of all users and their emails.

---

## 3. Identify the user from the JWT, not from the URL

1. **Current behavior:** The app still sends `email` in the URL or body (e.g. `get_dashboard?email=...`) so Xano can find the user. Anyone could change that email and try to see another user’s data.
2. **What to change:** After the Memberstack JWT is validated (step 1), you get a **member id** (from the verify-token response or the token payload). Use **that** as the only source of “who is this user” in your endpoint logic.
3. **In Xano:** In each protected endpoint’s function stack:
   - The middleware (or first step) has already verified the token and set e.g. `auth_member_id`.
   - **Do not** use the `email` from the request URL/body to look up the user. Instead, look up the user by the Memberstack member id (e.g. you might have a column like `memberstack_id` or `member_id` on your user table; if not, add it and map Memberstack member id to your user record).
   - Use that user record for dashboard, profile, game result, etc. Only if you need to show “email” in the response should you read it from that user record.
4. **Optional later:** You can change the front end to stop sending `email` in the URL once Xano no longer needs it; until then, Xano should simply ignore it for authorization and use only the JWT-derived user id.

---

## Summary

| What | Where | Action |
|------|--------|--------|
| Send JWT to Xano | This codebase | Done. Every Xano request includes `Authorization: Bearer <token>` when the user is logged in. |
| Require auth on endpoints | Xano dashboard | Add Memberstack JWT check to `get_dashboard`, `get_user_profile`, `submit_game_result`, `redeem_reward`, `update_profile`, etc. |
| Lock `get_all_users` | Xano dashboard | Remove from public API or move to admin-only group. |
| User identity from JWT | Xano dashboard | In protected endpoints, use the JWT subject (member id) as the user identifier, not the email from the URL. |

### Quick reference

- **Memberstack verify-token:** `POST https://admin.memberstack.com/members/verify-token` with header `x-api-key: <secret>` and body `{"token": "<Bearer token>"}`. [Memberstack verification docs](https://developers.memberstack.com/admin-rest-api/verification).
- **Xano middleware:** Library → Middleware → Add Middleware; then API group or endpoint → settings → Middleware → Add PRE Middleware.
- **Xano API structure:** Workspace → API → API group → endpoints. Use the **…** or settings on a group or endpoint to configure middleware and security.
