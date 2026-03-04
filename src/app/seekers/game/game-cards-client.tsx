"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSeekers } from "@/hooks/use-seekers";

const GAMES = [
  {
    id: "shikaku" as const,
    name: "shikaku",
    emoji: "🟥",
    description:
      "divide the grid into rectangles. each rectangle must contain exactly one number equal to its area.",
    href: "/seekers/game/shikaku",
  },
  {
    id: "akari" as const,
    name: "akari",
    emoji: "💡",
    description:
      "place light bulbs to illuminate every white cell. no two bulbs can shine on each other.",
    href: "/seekers/game/akari",
  },
  {
    id: "mastermind" as const,
    name: "mastermind",
    emoji: "🧠",
    description:
      "crack the hidden colour code in six guesses or fewer. each guess gives you clues.",
    href: "/seekers/game/mastermind",
  },
];

function toDateString(timestamp: string | number | undefined): string {
  if (timestamp == null) return "";
  if (typeof timestamp === "number") {
    const d = new Date(timestamp < 1e10 ? timestamp * 1000 : timestamp);
    return d.toISOString().split("T")[0];
  }
  const s = String(timestamp);
  return s.slice(0, 10);
}

function isPlayedTodayForGame(
  gameId: string,
  activity: { source?: string; description?: string; type: string; timestamp?: string | number }[]
): boolean {
  const today = new Date().toISOString().split("T")[0];
  return activity.some((a) => {
    if (a.type !== "game_complete") return false;
    const dateStr = toDateString(a.timestamp);
    if (dateStr !== today) return false;
    const raw = (a.source ?? a.description ?? "").toLowerCase().replace(/_/g, "");
    const match = raw.includes(gameId) || raw === gameId;
    return match;
  });
}

export default function GameCardsClient() {
  const { user, isLoading: authLoading } = useAuth();
  const { activity, isLoading: seekersLoading } = useSeekers();
  const isLoggedIn = user != null;
  const loading = authLoading || (isLoggedIn && seekersLoading);

  const playedToday = isLoggedIn
    ? {
        shikaku: isPlayedTodayForGame("shikaku", activity),
        akari: isPlayedTodayForGame("akari", activity),
        mastermind: isPlayedTodayForGame("mastermind", activity),
      }
    : null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {GAMES.map((game) => {
        const played = playedToday ? playedToday[game.id] : false;
        const showStatus = isLoggedIn && !loading;
        return (
          <div
            key={game.id}
            className="flex flex-col rounded-lg bg-white p-6"
          >
            <p className="mb-4 text-3xl">{game.emoji}</p>
            <h2 className="font-obviously-wide text-lg font-bold">
              {game.name}
            </h2>
            <p className="mt-2 flex-1 font-tiempos-text text-sm text-black/55">
              {game.description}
            </p>
            {showStatus && (
              <p
                className={`mt-4 font-obviously text-xs ${
                  played ? "text-green-600" : "text-red"
                }`}
              >
                {played ? "played ✓" : "not played"}
              </p>
            )}
            <div className="mt-4">
              {showStatus && played ? (
                <Link
                  href={game.href}
                  className="inline-block rounded-full border border-black/20 px-5 py-2.5 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
                >
                  play again
                </Link>
              ) : (
                <Link
                  href={game.href}
                  className="inline-block rounded-full bg-red px-5 py-2.5 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
                >
                  play
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
