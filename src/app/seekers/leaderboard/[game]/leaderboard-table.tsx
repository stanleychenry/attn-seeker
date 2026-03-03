"use client";

import { useEffect, useState } from "react";
import type { XanoLeaderboardEntry } from "@/lib/xano";

const GAME_CONFIG: Record<
  string,
  { scoreLabel: string; scoreColumn: "time" | "guesses" }
> = {
  shikaku: { scoreLabel: "best time", scoreColumn: "time" },
  akari: { scoreLabel: "best time", scoreColumn: "time" },
  mastermind: { scoreLabel: "fewest guesses", scoreColumn: "guesses" },
};

function normalizeEntry(raw: Record<string, unknown>): XanoLeaderboardEntry {
  return {
    display_name:
      (raw.display_name as string) ?? (raw.displayName as string) ?? "Anonymous",
    time_seconds:
      raw.time_seconds != null
        ? Number(raw.time_seconds)
        : raw.timeSeconds != null
          ? Number(raw.timeSeconds)
          : undefined,
    guesses_used:
      raw.guesses_used != null
        ? Number(raw.guesses_used)
        : raw.guessesUsed != null
          ? Number(raw.guessesUsed)
          : undefined,
    ...raw,
  };
}

export default function LeaderboardTable({ game }: { game: string }) {
  const [entries, setEntries] = useState<XanoLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const config = GAME_CONFIG[game] ?? { scoreLabel: "score", scoreColumn: "time" as const };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      game_type: game,
      date: today,
      limit: "100",
    });
    fetch(`/api/seekers/leaderboard?${params.toString()}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return res.json().then((b) => Promise.reject(new Error(b?.error ?? res.statusText)));
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setEntries(list.map((e: Record<string, unknown>) => normalizeEntry(e)));
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setEntries([]);
      })
      .finally(() => setLoading(false));
  }, [game]);

  if (loading) {
    return (
      <div className="px-6 py-12 text-center font-tiempos-text text-black/55">
        loading leaderboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-12 text-center font-obviously text-sm text-red">
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="px-6 py-12 text-center font-tiempos-text text-black/55">
        no players yet today. be the first!
      </div>
    );
  }

  const formatScore = (entry: XanoLeaderboardEntry): string => {
    if (config.scoreColumn === "time" && entry.time_seconds != null) {
      const m = Math.floor(entry.time_seconds / 60);
      const s = entry.time_seconds % 60;
      return `${m}:${String(s).padStart(2, "0")}`;
    }
    if ("guesses_used" in entry && entry.guesses_used != null) {
      const g = entry.guesses_used as number;
      return `${g} guess${g !== 1 ? "es" : ""}`;
    }
    return "—";
  };

  const todayStr = new Date().toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <div className="hidden grid-cols-[60px_1fr_120px_120px] border-b border-black/5 px-6 py-3 md:grid">
        <span className="font-obviously text-xs font-medium text-black/40">rank</span>
        <span className="font-obviously text-xs font-medium text-black/40">name</span>
        <span className="font-obviously text-xs font-medium text-black/40">
          {config.scoreLabel}
        </span>
        <span className="font-obviously text-right text-xs font-medium text-black/40">
          date
        </span>
      </div>
      <div className="grid grid-cols-[40px_1fr_80px] border-b border-black/5 px-4 py-3 md:hidden">
        <span className="font-obviously text-xs font-medium text-black/40">rank</span>
        <span className="font-obviously text-xs font-medium text-black/40">name</span>
        <span className="font-obviously text-right text-xs font-medium text-black/40">
          {config.scoreColumn === "time" ? "time" : "guesses"}
        </span>
      </div>
      {entries.map((entry, index) => {
        const score = formatScore(entry);
        const name = (entry.display_name as string) ?? "Anonymous";
        return (
          <div key={`${index}-${name}-${score}`}>
            <div
              className={`hidden grid-cols-[60px_1fr_120px_120px] items-center px-6 py-3 md:grid ${
                index < entries.length - 1 ? "border-b border-black/5" : ""
              }`}
            >
              <span
                className={`font-obviously-narrow text-sm font-black ${
                  index < 3 ? "text-red" : "text-black/40"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-obviously text-sm font-medium text-black/80">
                {name}
              </span>
              <span className="font-obviously-narrow text-sm font-black text-black/60">
                {score}
              </span>
              <span className="font-obviously text-right text-xs text-black/40">
                {todayStr}
              </span>
            </div>
            <div
              className={`grid grid-cols-[40px_1fr_80px] items-center px-4 py-3 md:hidden ${
                index < entries.length - 1 ? "border-b border-black/5" : ""
              }`}
            >
              <span
                className={`font-obviously-narrow text-sm font-black ${
                  index < 3 ? "text-red" : "text-black/40"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-obviously text-xs font-medium text-black/80">
                {name}
              </span>
              <span className="font-obviously-narrow text-right text-xs font-black text-black/60">
                {score}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
