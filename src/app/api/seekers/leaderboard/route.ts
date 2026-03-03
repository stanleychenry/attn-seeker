import { NextRequest, NextResponse } from "next/server";

const XANO_BASE =
  process.env.NEXT_PUBLIC_XANO_BASE_URL ??
  "https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const game_type = searchParams.get("game_type");
  const date = searchParams.get("date");
  const limit = searchParams.get("limit") ?? "100";

  if (!game_type || !date) {
    return NextResponse.json(
      { error: "game_type and date are required" },
      { status: 400 }
    );
  }

  const url = `${XANO_BASE.replace(/\/$/, "")}/get_game_leaderboard?${new URLSearchParams({
    game_type,
    date,
    limit,
  }).toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Xano error: ${res.status}`, details: text },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    const data = await res.json();

    const list = Array.isArray(data)
      ? data
      : (data?.leaderboard ?? data?.data ?? data?.items ?? []);

    return NextResponse.json(Array.isArray(list) ? list : []);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch leaderboard";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
