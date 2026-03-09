/**
 * Syncs all CMS content into the Algolia global search index (attn_seeker_global).
 * Run once after deploy or when CMS content changes. Requires ALGOLIA_ADMIN_KEY.
 *
 * Call: POST /api/admin/sync-search
 * Optional: Header "Authorization: Bearer <SYNC_SECRET>" if SYNC_SECRET is set (recommended in production).
 */

import { NextRequest } from "next/server";
import { runAlgoliaSync } from "@/lib/run-algolia-sync";

export async function POST(request: NextRequest) {
  const syncSecret = process.env.SYNC_SECRET;
  if (syncSecret) {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token !== syncSecret) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await runAlgoliaSync();

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 500 });
  }

  return Response.json({
    ok: true,
    index: result.index,
    totalRecords: result.totalRecords,
  });
}
