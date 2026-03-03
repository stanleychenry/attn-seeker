import Link from "next/link";
import { notFound } from "next/navigation";
import LeaderboardFilter from "./leaderboard-filter";
import LeaderboardTable from "./leaderboard-table";

const GAME_CONFIG: Record<
  string,
  { name: string; emoji: string; scoreLabel: string; scoreColumn: string }
> = {
  shikaku: {
    name: "shikaku",
    emoji: "🟥",
    scoreLabel: "best time",
    scoreColumn: "time",
  },
  akari: {
    name: "akari",
    emoji: "💡",
    scoreLabel: "best time",
    scoreColumn: "time",
  },
  mastermind: {
    name: "mastermind",
    emoji: "🧠",
    scoreLabel: "fewest guesses",
    scoreColumn: "guesses",
  },
};

export function generateStaticParams() {
  return [
    { game: "shikaku" },
    { game: "akari" },
    { game: "mastermind" },
  ];
}

export async function generateMetadata({
  params,
}: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const config = GAME_CONFIG[game];
  return {
    title: config
      ? `${config.name} leaderboard | attn:seeker`
      : "leaderboard | attn:seeker",
    description: config
      ? `top players for ${config.name}.`
      : "game leaderboard.",
  };
}

export default async function GameLeaderboardPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  const config = GAME_CONFIG[game];
  if (!config) notFound();

  return (
    <>
      {/* 1. Header */}
      <section className="bg-bone px-6 py-16">
        <div className="mx-auto max-w-[900px]">
          <Link
            href="/seekers/leaderboard"
            className="font-obviously text-xs text-red hover:underline"
          >
            ← back to leaderboard
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl">{config.emoji}</span>
            <h1 className="font-obviously-wide text-3xl font-bold">
              {config.name} leaderboard
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Time filter */}
      <section className="bg-bone px-6 pb-4">
        <div className="mx-auto max-w-[900px]">
          <LeaderboardFilter />
        </div>
      </section>

      {/* 3. Leaderboard table */}
      <section className="bg-bone px-6 pb-20">
        <div className="mx-auto max-w-[900px]">
          <LeaderboardTable game={game} />
        </div>
      </section>
    </>
  );
}
