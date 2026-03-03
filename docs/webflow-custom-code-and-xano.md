# Webflow body code and Xano – what the API can and can’t do

## Your question

You said the code that talks to **Xano** lives in the **body code of each page** in Webflow. You want to know if we can access that via the Webflow API.

## Short answer

**It depends how that code was added in Webflow.**

- **If it was added as “Custom Code” in the Designer** (e.g. Page Settings → Custom Code, or Site Settings → Custom Code → paste in the box):  
  **No.** That pasted code is **not** exposed by the Webflow Data API. The API only works with the newer “Registered Scripts” system (used by apps), not with the raw text you paste in the Designer.

- **If it was added via the “Registered Scripts” / Custom Code API** (e.g. by an app that registered inline or hosted scripts):  
  **Partially.** We can see **which** scripts are applied to the site and to each page (script id, location, version). We can list **registered** scripts (id, displayName, hostedLocation, version). We **do not** get the actual **source code** of inline scripts back from the API. For **hosted** scripts we get a `hostedLocation` URL; we could fetch that URL to see the script content.

So in practice:

- **Designer-pasted “body code”** → API cannot read it.
- **Registered scripts (app-added)** → API can list them and where they’re applied; for hosted scripts we can try to fetch the content from the script URL.

## What we can do with your Webflow API key

Using the same token you use for CMS (`WEBFLOW_API_KEY`), we can **try**:

1. **List sites**  
   `GET https://api.webflow.com/v2/sites`  
   (Needs `sites:read`.)

2. **Get site-level custom code**  
   `GET https://api.webflow.com/v2/sites/{site_id}/custom_code`  
   Returns which **registered** scripts are on the site (id, location, version). No raw code body.

3. **Get page-level custom code**  
   `GET https://api.webflow.com/v2/pages/{page_id}/custom_code`  
   Same idea per page.

4. **List registered scripts**  
   `GET https://api.webflow.com/v2/sites/{site_id}/registered_scripts`  
   Returns script id, displayName, hostedLocation (if hosted), version. For scripts with `hostedLocation`, we can then **fetch that URL** (if it’s public) to see the code that might call Xano.

If your token doesn’t have `custom_code:read` (and possibly `sites:read`), those custom-code and sites calls will return 403 Forbidden. Many tokens are issued only for CMS (collections/items).

## Xano base URL

You gave: **`https://x3yo-h8fa-1fj9.a2.xano.io`**

The repo already documents an API base that includes a path, e.g.  
`https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8`.  
The path after the host (`/api:3rlLJ6G8` or similar) is the Xano API group; we’ll keep using whatever base path your Xano endpoints expect (see Xano dashboard or existing docs).

## Practical recommendation

1. **Don’t rely on the API to “read” Designer-pasted body code**  
   If the Xano logic is in the code you pasted in Webflow’s Custom Code (body) for each page, the only way to reuse it here is to **copy it manually** from Webflow (Designer → each page → Custom Code) into this repo (e.g. into a small client or fetch helpers that call Xano).

2. **Optional: try the API to list scripts**  
   Run the script below (or call the endpoints above) with your `WEBFLOW_API_KEY`.  
   - If you get 403, add a token with `sites:read` and `custom_code:read` (or use a token that already has those scopes).  
   - If you get 200, you’ll see which **registered** scripts exist and, for hosted ones, their URLs. We can then fetch those URLs and look for Xano calls.

3. **Implement Xano in this app from your spec**  
   Use your existing api-reference (and any code you copy from Webflow) to build the Xano client and wire seekers (and other) pages to the real API, as in `docs/xano-integration-plan.md`.
