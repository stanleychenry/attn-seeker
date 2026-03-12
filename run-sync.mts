import { runAlgoliaSync } from "./src/lib/run-algolia-sync.ts";
const result = await runAlgoliaSync();
console.log(JSON.stringify(result, null, 2));
