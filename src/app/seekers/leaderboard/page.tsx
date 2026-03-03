import Link from "next/link";

const TIER_COLOURS: Record<string, string> = {
  bronze: "bg-amber-600",
  silver: "bg-gray-400",
  gold: "bg-yellow-500",
  platinum: "bg-gray-300",
  black: "bg-black",
};

const MOCK_OVERALL_LEADERBOARD = [
  {
    id: "1",
    name: "jessica t.",
    tier: "black",
    points: 12450,
    isCurrentUser: false,
  },
  {
    id: "2",
    name: "marcus w.",
    tier: "platinum",
    points: 11200,
    isCurrentUser: false,
  },
  {
    id: "3",
    name: "hannah r.",
    tier: "platinum",
    points: 10870,
    isCurrentUser: false,
  },
  {
    id: "4",
    name: "liam k.",
    tier: "gold",
    points: 9340,
    isCurrentUser: false,
  },
  {
    id: "5",
    name: "sophie m.",
    tier: "gold",
    points: 8920,
    isCurrentUser: false,
  },
  {
    id: "6",
    name: "daniel c.",
    tier: "gold",
    points: 8100,
    isCurrentUser: false,
  },
  {
    id: "7",
    name: "olivia p.",
    tier: "gold",
    points: 7650,
    isCurrentUser: false,
  },
  {
    id: "8",
    name: "noah b.",
    tier: "silver",
    points: 6200,
    isCurrentUser: false,
  },
  {
    id: "9",
    name: "emma l.",
    tier: "silver",
    points: 5800,
    isCurrentUser: false,
  },
  {
    id: "10",
    name: "james h.",
    tier: "silver",
    points: 5450,
    isCurrentUser: false,
  },
  {
    id: "11",
    name: "charlotte d.",
    tier: "silver",
    points: 4900,
    isCurrentUser: false,
  },
  {
    id: "12",
    name: "stanley h.",
    tier: "silver",
    points: 4750,
    isCurrentUser: true,
  },
  {
    id: "13",
    name: "mia f.",
    tier: "silver",
    points: 4200,
    isCurrentUser: false,
  },
  {
    id: "14",
    name: "ethan g.",
    tier: "bronze",
    points: 3800,
    isCurrentUser: false,
  },
  {
    id: "15",
    name: "isabella w.",
    tier: "bronze",
    points: 3400,
    isCurrentUser: false,
  },
  {
    id: "16",
    name: "jack r.",
    tier: "bronze",
    points: 2900,
    isCurrentUser: false,
  },
  {
    id: "17",
    name: "ava n.",
    tier: "bronze",
    points: 2500,
    isCurrentUser: false,
  },
  {
    id: "18",
    name: "lucas t.",
    tier: "bronze",
    points: 2100,
    isCurrentUser: false,
  },
  {
    id: "19",
    name: "grace s.",
    tier: "bronze",
    points: 1800,
    isCurrentUser: false,
  },
  {
    id: "20",
    name: "ben m.",
    tier: "bronze",
    points: 1400,
    isCurrentUser: false,
  },
];

const MOCK_GAME_LEADERBOARDS = [
  {
    slug: "shikaku",
    name: "shikaku",
    emoji: "🟥",
    topPlayers: [
      { name: "jessica t.", score: "0:42" },
      { name: "marcus w.", score: "0:58" },
      { name: "liam k.", score: "1:12" },
    ],
  },
  {
    slug: "akari",
    name: "akari",
    emoji: "💡",
    topPlayers: [
      { name: "hannah r.", score: "1:05" },
      { name: "sophie m.", score: "1:23" },
      { name: "jessica t.", score: "1:31" },
    ],
  },
  {
    slug: "mastermind",
    name: "mastermind",
    emoji: "🧠",
    topPlayers: [
      { name: "daniel c.", score: "3 guesses" },
      { name: "olivia p.", score: "4 guesses" },
      { name: "marcus w.", score: "4 guesses" },
    ],
  },
];

export const metadata = {
  title: "leaderboard | attn:seeker",
  description: "top seekers and game leaderboards.",
};

export default function LeaderboardPage() {
  return (
    <>
      {/* 1. Header */}
      <section className="bg-bone px-6 py-16">
        <div className="mx-auto max-w-[900px]">
          <p className="font-obviously text-xs font-medium uppercase tracking-widest text-red">
            leaderboard
          </p>
          <h1 className="mt-2 font-obviously-wide text-4xl font-bold">
            top seekers
          </h1>
        </div>
      </section>

      {/* 2. Overall leaderboard */}
      <section className="bg-bone px-6 pb-12">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-4 font-obviously-wide text-lg font-bold">
            overall
          </h2>

          <div className="overflow-hidden rounded-lg bg-white">
            {/* Desktop header */}
            <div className="hidden grid-cols-[60px_1fr_120px_120px] border-b border-black/5 px-6 py-3 md:grid">
              <span className="font-obviously text-xs font-medium text-black/40">
                rank
              </span>
              <span className="font-obviously text-xs font-medium text-black/40">
                name
              </span>
              <span className="font-obviously text-xs font-medium text-black/40">
                tier
              </span>
              <span className="font-obviously text-right text-xs font-medium text-black/40">
                status points
              </span>
            </div>

            {/* Mobile header */}
            <div className="grid grid-cols-[40px_1fr_100px] border-b border-black/5 px-4 py-3 md:hidden">
              <span className="font-obviously text-xs font-medium text-black/40">
                rank
              </span>
              <span className="font-obviously text-xs font-medium text-black/40">
                name
              </span>
              <span className="font-obviously text-right text-xs font-medium text-black/40">
                points
              </span>
            </div>

            {/* Data rows */}
            {MOCK_OVERALL_LEADERBOARD.map((user, index) => {
              const rowBorder =
                index < MOCK_OVERALL_LEADERBOARD.length - 1
                  ? "border-b border-black/5"
                  : "";
              const rowBg = user.isCurrentUser ? "bg-[#EDE8D6]" : "";

              return (
                <div key={user.id}>
                  {/* Desktop row */}
                  <div
                    className={`hidden grid-cols-[60px_1fr_120px_120px] items-center px-6 py-3 md:grid ${rowBorder} ${rowBg}`}
                  >
                    <span
                      className={`font-obviously-narrow text-sm font-black ${
                        index < 3 ? "text-red" : "text-black/40"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`font-obviously text-sm font-medium ${
                        user.isCurrentUser ? "text-black" : "text-black/80"
                      }`}
                    >
                      {user.name}{" "}
                      {user.isCurrentUser && (
                        <span className="text-black/40">(you)</span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-2 w-2 rounded-full ${TIER_COLOURS[user.tier]}`}
                      />
                      <span className="font-obviously text-xs font-medium text-black/70">
                        {user.tier}
                      </span>
                    </div>
                    <span className="font-obviously text-right text-sm text-black/60">
                      {user.points.toLocaleString()}
                    </span>
                  </div>

                  {/* Mobile row */}
                  <div
                    className={`grid grid-cols-[40px_1fr_100px] items-center px-4 py-3 md:hidden ${rowBorder} ${rowBg}`}
                  >
                    <span
                      className={`font-obviously-narrow text-sm font-black ${
                        index < 3 ? "text-red" : "text-black/40"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-obviously text-sm font-medium ${
                          user.isCurrentUser ? "text-black" : "text-black/80"
                        }`}
                      >
                        {user.name}
                        {user.isCurrentUser && (
                          <span className="text-black/40"> (you)</span>
                        )}
                      </span>
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full ${TIER_COLOURS[user.tier]}`}
                      />
                    </div>
                    <span className="font-obviously text-right text-sm text-black/60">
                      {user.points.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Game leaderboards */}
      <section className="bg-bone px-6 pb-20">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-4 font-obviously-wide text-lg font-bold">
            by game
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {MOCK_GAME_LEADERBOARDS.map((game) => (
              <div
                key={game.slug}
                className="rounded-lg bg-white p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-2xl">{game.emoji}</span>
                  <h3 className="font-obviously-wide text-base font-bold">
                    {game.name}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {game.topPlayers.map((player, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-obviously-narrow text-xs font-black ${
                            i === 0
                              ? "text-yellow-500"
                              : i === 1
                                ? "text-gray-400"
                                : "text-amber-600"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="font-obviously text-xs font-medium text-black/80">
                          {player.name}
                        </span>
                      </div>
                      <span className="font-obviously-narrow text-xs font-black text-black/40">
                        {player.score}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/seekers/leaderboard/${game.slug}`}
                  className="mt-5 block rounded-full border border-black/20 px-4 py-2 text-center font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
                >
                  full leaderboard
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
