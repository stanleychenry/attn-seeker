// scripts/test-webflow.js
const WEBFLOW_API_BASE = "https://api.webflow.com/v2";
const SITE_ID = "6903f966907f4df2c9e6c38b";
const API_KEY =
  process.env.WEBFLOW_API_KEY ||
  "e7834fbcadce48d9fbcbaf9f9ba91e9acbd120f6befe4c2d80d73af7600bf867";

async function main() {
  console.log("Fetching collections...\n");

  const colRes = await fetch(
    `${WEBFLOW_API_BASE}/sites/${SITE_ID}/collections`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        accept: "application/json",
      },
    }
  );
  const { collections } = await colRes.json();

  console.log("Collections found:");
  console.log("─".repeat(60));
  for (const col of collections) {
    console.log(`  ${col.displayName.padEnd(25)} → ${col.id}`);
  }
  console.log("");

  // Fetch 1 item from each to show field names
  for (const col of collections) {
    console.log(`\n── ${col.displayName} fields ──`);
    const itemRes = await fetch(
      `${WEBFLOW_API_BASE}/collections/${col.id}/items?limit=1`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: "application/json",
        },
      }
    );
    const { items } = await itemRes.json();
    if (items && items.length > 0) {
      const fieldKeys = Object.keys(items[0].fieldData);
      for (const key of fieldKeys) {
        const val = items[0].fieldData[key];
        const type = Array.isArray(val) ? "array" : typeof val;
        const preview =
          typeof val === "string"
            ? val.substring(0, 60)
            : JSON.stringify(val)?.substring(0, 60);
        console.log(`  ${key.padEnd(30)} (${type}) ${preview}`);
      }
    } else {
      console.log("  (no items)");
    }
  }

  // Save collection IDs to a JSON file for reference
  const fs = require("fs");
  const path = require("path");
  const idMap = {};
  for (const col of collections) {
    idMap[col.displayName] = col.id;
  }
  const outPath = path.join(__dirname, "..", "docs", "webflow-collections.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(idMap, null, 2));
  console.log("\n\nCollection IDs saved to docs/webflow-collections.json");
}

main().catch(console.error);
