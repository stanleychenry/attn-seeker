# How to test the Xano security setup

Use these steps to confirm the three requirements from "What Needs to Happen in Xano — Today" are in place and to reproduce the kind of result in the screenshots.

---

## What you’re testing

1. **Auth middleware** – Protected endpoints require a valid Memberstack JWT and return 401 without it.
2. **get_all_users locked** – That endpoint is not callable from the public/client; you can only get the “list of users” result from inside Xano (or an admin-only API).
3. **User from JWT** – Endpoints use the token’s subject (e.g. `auth_member_id`) to identify the user, not `?email=...`.

---

## Test 1: Endpoints require authentication

**Goal:** Without a token you get 401; with a valid token you get 200.

### 1a. Call without token (should fail)

1. Open **Postman**, **Insomnia**, or browser devtools (e.g. **Fetch** in the console).
2. Send a **GET** request to:
   ```
   https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8/get_dashboard
   ```
3. Do **not** add an `Authorization` header. You can add `Content-Type: application/json` if you want.
4. **Expected:** Status **401** (or similar “Unauthorized” response).  
   If you get **200** and dashboard data, the endpoint is **not** protected yet.

### 1b. Call with valid token (should succeed)

1. In your **app** (browser), log in with Memberstack.
2. Open **Developer Tools** (F12) → **Application** (Chrome) or **Storage** (Firefox) → **Local Storage** → your site.
3. Find the key **`_ms-mid`** and **copy** its value (the full JWT string, no “Bearer ”).
4. In Postman/Insomnia, send **GET** to:
   ```
   https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8/get_dashboard
   ```
5. Add header:
   - **Name:** `Authorization`  
   - **Value:** `Bearer <paste the _ms-mid value here>`
6. **Expected:** Status **200** and JSON body with that user’s dashboard (tier, points, etc.).  
   If you get 401, the middleware may not be attached or the token may be invalid/expired.

You can repeat the same pattern for **get_user_profile** (and, if it’s still on the public API, **submit_game_result**) to confirm they also require auth and work with a valid token.

---

## Test 2: get_all_users is not callable from the client (and where the “list of users” result comes from)

**Goal:** The public API used by the app does **not** return the full user list. The “list of users” JSON (like in the screenshot) should only come from inside Xano or an admin API.

### 2a. Try to call get_all_users from the browser/Postman (should fail or be unavailable)

1. From **Postman** or the browser, send **GET** to:
   ```
   https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8/get_all_users
   ```
2. Try **without** Authorization, then **with** a valid `Authorization: Bearer <token>` (same token as in Test 1b).
3. **Expected (recommended setup):**
   - **404** (endpoint not in the public API group), or  
   - **401** (endpoint exists but requires admin / different auth), or  
   - Endpoint simply not exposed on this base URL.  
4. **Bad result:** **200** with a JSON array of all users (like in the screenshot). That would mean `get_all_users` is still publicly callable.

### 2b. Get the same “list of users” result inside Xano (like the screenshot)

The screenshot showing many user profiles with “x3yo-h8fa-1fj9.a2.xano.io - Private” is the response from **inside Xano**, not from the public app.

1. Log in to **Xano** → open your **workspace**.
2. Go to **API** → open the **API group** that contains (or contained) **get_all_users**.
3. Open the **get_all_users** endpoint (or the function that returns all users).
4. Use the **Run** / **Test** panel for that endpoint (or the function).
5. Run it **without** adding any auth (or with whatever Xano uses for internal/admin runs).
6. **Expected:** You see a long JSON array of user objects (id, email, tier, membership_number, etc.) — the same kind of result as in the screenshot.  
   This is correct: only inside Xano (or an admin-only API) should this data be available.

So: **same result as the screenshot** = run **get_all_users** (or the equivalent function) **inside Xano’s Run/Test panel**, not from the public API URL.

---

## Test 3: User identified from JWT, not from email

**Goal:** The backend uses the token to decide who the user is, not the `email` query parameter.

### 3a. Call get_dashboard with token but no email

1. Send **GET** to:
   ```
   https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8/get_dashboard
   ```
2. Add **only** the auth header: `Authorization: Bearer <your _ms-mid token>`.
3. Do **not** add `?email=...` to the URL.
4. **Expected:** **200** with **your** dashboard data (the user that owns the token).  
   If the endpoint still **requires** `?email=...` and ignores the token, then it’s not using the JWT for identity yet (Task 3 not done).

### 3b. (Optional) Try to “spoof” another user by email

1. Call the same URL **with** a valid token but **with** a different user’s email, e.g.:
   ```
   https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8/get_dashboard?email=someone.else@example.com
   ```
2. **Expected (correct behavior):** The response is **your** dashboard (the user from the token), **not** the other person’s.  
   If you get the other person’s data, the endpoint is still trusting `email` over the JWT (Task 3 not done).

---

## Quick checklist

| Test | What you did | Expected |
|------|----------------|----------|
| 1a   | GET get_dashboard with **no** Authorization | **401** Unauthorized |
| 1b   | GET get_dashboard **with** Authorization: Bearer &lt;token&gt; | **200** + your dashboard JSON |
| 2a   | GET get_all_users from Postman/browser (public URL) | **404** or **401** or not exposed |
| 2b   | Run get_all_users (or equivalent) **inside Xano** Run panel | **200** + list of users (like the screenshot) |
| 3a   | GET get_dashboard with token, **no** email param | **200** + your dashboard |
| 3b   | GET get_dashboard with token + another user’s email | Still **your** dashboard, not theirs |

---

## Getting your Memberstack token for tests

- **Browser:** After logging in, **Application** → **Local Storage** → **`_ms-mid`** (copy the full value).
- **Cookie:** If your app stores it in a cookie, use **Application** → **Cookies** → **`_ms-mid`** and copy the value.

Use it in the **Authorization** header as: `Bearer <paste value here>` (with a space after “Bearer”).
