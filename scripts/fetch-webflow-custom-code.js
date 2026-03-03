/**
 * Try to fetch Webflow custom code (registered scripts) for the site.
 * Requires WEBFLOW_API_KEY in .env.local with scopes: sites:read, custom_code:read.
 * Run: node scripts/fetch-webflow-custom-code.js
 *
 * If you get 403, your token may not have custom_code:read. The script will
 * still try to list sites (sites:read) and then custom code per site.
 */

const WEBFLOW_API_BASE = "https://api.webflow.com/v2";

async function loadEnv() {
  try {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      for (const line of content.split("\n")) {
        const m = line.match(/^\s*([^#=]+)=(.*)$/);
        if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch (_) {}
}

async function webflowFetch(path) {
  const token = process.env.WEBFLOW_API_KEY;
  if (!token) {
    throw new Error("WEBFLOW_API_KEY not set in .env.local");
  }
  const res = await fetch(`${WEBFLOW_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Webflow API ${res.status}: ${data.message || res.statusText}`);
  }
  return data;
}

async function main() {
  await loadEnv();

  console.log("Fetching Webflow sites...\n");

  let sites;
  try {
    sites = await webflowFetch("/sites");
  } catch (e) {
    console.error("Sites request failed:", e.message);
    return;
  }

  const siteList = sites.sites ?? sites ?? [];
  if (siteList.length === 0) {
    console.log("No sites returned (or unexpected response shape).");
    return;
  }

  for (const site of siteList) {
    const siteId = site.id ?? site;
    const name = typeof site === "object" && site.displayName != null ? site.displayName : siteId;
    console.log(`Site: ${name} (${siteId})`);

    try {
      const customCode = await webflowFetch(`/sites/${siteId}/custom_code`);
      const scripts = customCode.scripts ?? [];
      console.log(`  Site custom code: ${scripts.length} script(s) applied`);
      for (const s of scripts) {
        console.log(`    - id: ${s.id}, location: ${s.location}, version: ${s.version}`);
      }
    } catch (e) {
      console.log(`  Site custom code: failed - ${e.message}`);
    }

    try {
      const registered = await webflowFetch(`/sites/${siteId}/registered_scripts`);
      const list = registered.registeredScripts ?? registered.scripts ?? registered ?? [];
      const arr = Array.isArray(list) ? list : [];
      console.log(`  Registered scripts: ${arr.length}`);
      for (const r of arr) {
        const loc = r.hostedLocation || r.hosted_location || "(inline)";
        console.log(`    - ${r.displayName ?? r.id}: ${loc}`);
        if (loc.startsWith("http") && loc !== "(inline)") {
          console.log(`      → You can fetch this URL to see script content (if public).`);
        }
      }
    } catch (e) {
      console.log(`  Registered scripts: failed - ${e.message}`);
    }

    console.log("");
  }
}

main().catch(console.error);
