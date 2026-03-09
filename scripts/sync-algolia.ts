/**
 * Syncs the Algolia global search index from CMS. Run after build so the index is always full.
 * Loads .env.local so env vars are available when run locally.
 */

import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { runAlgoliaSync } = await import("../src/lib/run-algolia-sync");
  const result = await runAlgoliaSync();

  if (result.ok) {
    console.log(`[sync-algolia] OK: ${result.totalRecords} records in ${result.index}`);
    process.exit(0);
  } else {
    console.error("[sync-algolia] Error:", result.error);
    process.exit(1);
  }
}

main();
