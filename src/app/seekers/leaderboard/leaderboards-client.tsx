"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  display_name?: string;
  displayName?: string;
  time_seconds?: number;
  timeSeconds?: number;
  guesses_used?: number;
  guessesUsed?: number;
  [key: string]: unknown;
}

interface GameLeaderboard {
  slug: string;
  name: string;
  emoji: string;
  scoreLabel: string;
  scoreColumn: "time" | "guesses";
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

const GAMES: Omit<GameLeaderboard, "entries" | "loading" | "error">[] = [
  { slug: "shikaku", name: "shikaku", emoji: "🟥", scoreLabel: "time", scoreColumn: "time" },
  { slug: "akari", name: "akari", emoji: "💡", scoreLabel: "time", scoreColumn: "time" },
  { slug: "mastermind", name: "mastermind", emoji: "🧠", scoreLabel: "guesses", scoreColumn: "guesses" },
];

function formatScore(entry: LeaderboardEntry, scoreColumn: "time" | "guesses"): string {
  if (scoreColumn === "time") {
    const secs = entry.time_seconds ?? entry.timeSeconds;
    if (secs != null) {
      const m = Math.floor(Number(secs) / 60);
      const s = Number(secs) % 60;
      return `${m}:${String(s).padStart(2, "0")}`;
    }
  } else {
    const g = entry.guesses_used ?? entry.guessesUsed;
    if (g != null) {
      const n = Number(g);
      return `${n} guess${n !== 1 ? "es" : ""}`;
    }
  }
  return "—";
}

function getName(entry: LeaderboardEntry): string {
  return (entry.display_name as string) ?? (entry.displayName as string) ?? "anonymous";
}

export default function LeaderboardsClient() {
  const [boards, setBoards] = useState<GameLeaderboard[]>(
    GAMES.map((g) => ({ ...g, entries: [], loading: true, error: null }))
  );

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    GAMES.forEach((game, i) => {
      const params = new URLSearchParams({ game_type: game.slug, date: today, limit: "20" });
      fetch(`/api/seekers/leaderboard?${params.toString()}`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) return res.json().then((b) => Promise.reject(new Error(b?.error ?? res.statusText)));
          return res.json();
        })
        .then((data: unknown) => {
          const list = Array.isArray(data) ? data : [];
          setBoards((prev) =>
            prev.map((b, idx) =>
              idx === i ? { ...b, entries: list as LeaderboardEntry[], loading: false } : b
            )
          );
        })
        .catch((e: unknown) => {
          const msg = e instanceof Error ? e.message : "Failed to load";
          setBoards((prev) =>
            prev.map((b, idx) =>
              idx === i ? { ...b, error: msg, loading: false } : b
            )
          );
        });
    });
  }, []);

  return (
    <div className="space-y-10">
      {boards.map((game) => (
        <div key={game.slug}>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">{game.emoji}</span>
            <h2 className="font-obviously-wide text-lg font-bold">{game.name}</h2>
          </div>

          <div className="overflow-hidden rounded-lg bg-white">
            {game.loading ? (
              <div className="px-6 py-12 text-center font-tiempos-text text-black/55">
                loading…
              </div>
            ) : game.error ? (
              <div className="px-6 py-12 text-center font-obviously text-sm text-red">
                {game.error}
              </div>
            ) : game.entries.length === 0 ? (
              <div className="px-6 py-12 text-center font-tiempos-text text-black/55">
                no players yet today. be the first!
              </div>
            ) : (
              <>
                {/* Desktop header */}
                <div className="hidden grid-cols-[60px_1fr_140px] border-b border-black/5 px-6 py-3 md:grid">
                  <span className="font-obviously text-xs font-medium text-black/40">rank</span>
                  <span className="font-obviously text-xs font-medium text-black/40">name</span>
                  <span className="font-obviously text-right text-xs font-medium text-black/40">
                    {game.scoreLabel}
                  </span>
                </div>

                {/* Mobile header */}
                <div className="grid grid-cols-[40px_1fr_100px] border-b border-black/5 px-4 py-3 md:hidden">
                  <span className="font-obviously text-xs font-medium text-black/40">rank</span>
                  <span className="font-obviously text-xs font-medium text-black/40">name</span>
                  <span className="font-obviously text-right text-xs font-medium text-black/40">
                    {game.scoreLabel}
                  </span>
                </div>

                {/* Rows */}
                {game.entries.map((entry, index) => {
                  const isLast = index === game.entries.length - 1;
                  const score = formatScore(entry, game.scoreColumn);
                  const name = getName(entry);
                  return (
                    <div key={`${index}-${name}`}>
                      {/* Desktop row */}
                      <div
                        className={`hidden grid-cols-[60px_1fr_140px] items-center px-6 py-3 md:grid ${!isLast ? "border-b border-black/5" : ""}`}
                      >
                        <span className={`font-obviously-narrow text-sm font-black ${index < 3 ? "text-red" : "text-black/40"}`}>
                          {index + 1}
                        </span>
                        <span className="font-obviously text-sm font-medium text-black/80">{name}</span>
                        <span className="font-obviously text-right text-sm text-black/60">{score}</span>
                      </div>

                      {/* Mobile row */}
                      <div
                        className={`grid grid-cols-[40px_1fr_100px] items-center px-4 py-3 md:hidden ${!isLast ? "border-b border-black/5" : ""}`}
                      >
                        <span className={`font-obviously-narrow text-sm font-black ${index < 3 ? "text-red" : "text-black/40"}`}>
                          {index + 1}
                        </span>
                        <span className="font-obviously text-sm font-medium text-black/80">{name}</span>
                        <span className="font-obviously text-right text-sm text-black/60">{score}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
