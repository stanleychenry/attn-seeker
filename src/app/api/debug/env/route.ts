/**
 * Debug endpoint: check if Webflow env is available on this environment (e.g. Vercel).
 * GET /api/debug/env
 * Returns { webflowConfigured: boolean } — no secret values.
 * Use this on your Vercel URL to confirm the API key is present at runtime.
 */
export async function GET() {
  const key =
    process.env.WEBFLOW_API_KEY ?? process.env.WEBFLOW_API_TOKEN ?? "";
  const webflowConfigured = key.length > 0;
  return Response.json(
    {
      webflowConfigured,
      hint: webflowConfigured
        ? "Key is set. If CMS still empty, check Vercel build/runtime logs for Webflow errors and redeploy after adding the variable."
        : "Set WEBFLOW_API_KEY (or WEBFLOW_API_TOKEN) in Vercel Environment Variables, then redeploy.",
    },
    { headers: { "Content-Type": "application/json" } }
  );
}
