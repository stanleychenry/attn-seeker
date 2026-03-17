const MOCK_GAME_LEADERBOARDS = [
  {
    slug: "shikaku",
    name: "shikaku",
    emoji: "🟥",
    scoreLabel: "time",
    players: [
      { name: "jessica t.", score: "0:42" },
      { name: "marcus w.", score: "0:58" },
      { name: "liam k.", score: "1:12" },
      { name: "sophie m.", score: "1:19" },
      { name: "hannah r.", score: "1:27" },
      { name: "daniel c.", score: "1:34" },
      { name: "olivia p.", score: "1:41" },
      { name: "noah b.", score: "1:55" },
      { name: "emma l.", score: "2:03" },
      { name: "james h.", score: "2:11" },
      { name: "charlotte d.", score: "2:20" },
      { name: "stanley h.", score: "2:28" },
      { name: "mia f.", score: "2:35" },
      { name: "ethan g.", score: "2:44" },
      { name: "isabella w.", score: "2:52" },
      { name: "jack r.", score: "3:01" },
      { name: "ava n.", score: "3:14" },
      { name: "lucas t.", score: "3:28" },
      { name: "grace s.", score: "3:45" },
      { name: "ben m.", score: "4:02" },
    ],
  },
  {
    slug: "akari",
    name: "akari",
    emoji: "💡",
    scoreLabel: "time",
    players: [
      { name: "hannah r.", score: "1:05" },
      { name: "sophie m.", score: "1:23" },
      { name: "jessica t.", score: "1:31" },
      { name: "marcus w.", score: "1:48" },
      { name: "liam k.", score: "1:57" },
      { name: "noah b.", score: "2:04" },
      { name: "emma l.", score: "2:13" },
      { name: "daniel c.", score: "2:22" },
      { name: "olivia p.", score: "2:31" },
      { name: "charlotte d.", score: "2:40" },
      { name: "james h.", score: "2:51" },
      { name: "mia f.", score: "3:02" },
      { name: "ethan g.", score: "3:14" },
      { name: "isabella w.", score: "3:27" },
      { name: "stanley h.", score: "3:38" },
      { name: "jack r.", score: "3:52" },
      { name: "ava n.", score: "4:05" },
      { name: "lucas t.", score: "4:19" },
      { name: "grace s.", score: "4:33" },
      { name: "ben m.", score: "4:50" },
    ],
  },
  {
    slug: "mastermind",
    name: "mastermind",
    emoji: "🧠",
    scoreLabel: "guesses",
    players: [
      { name: "daniel c.", score: "3 guesses" },
      { name: "olivia p.", score: "4 guesses" },
      { name: "marcus w.", score: "4 guesses" },
      { name: "jessica t.", score: "4 guesses" },
      { name: "hannah r.", score: "5 guesses" },
      { name: "liam k.", score: "5 guesses" },
      { name: "sophie m.", score: "5 guesses" },
      { name: "noah b.", score: "5 guesses" },
      { name: "emma l.", score: "6 guesses" },
      { name: "james h.", score: "6 guesses" },
      { name: "charlotte d.", score: "6 guesses" },
      { name: "stanley h.", score: "6 guesses" },
      { name: "mia f.", score: "7 guesses" },
      { name: "ethan g.", score: "7 guesses" },
      { name: "isabella w.", score: "7 guesses" },
      { name: "jack r.", score: "7 guesses" },
      { name: "ava n.", score: "8 guesses" },
      { name: "lucas t.", score: "8 guesses" },
      { name: "grace s.", score: "8 guesses" },
      { name: "ben m.", score: "9 guesses" },
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
      {/* Header */}
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

      {/* Game leaderboards */}
      <section className="bg-bone px-6 pb-20">
        <div className="mx-auto max-w-[900px] space-y-10">
          {MOCK_GAME_LEADERBOARDS.map((game) => (
            <div key={game.slug}>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">{game.emoji}</span>
                <h2 className="font-obviously-wide text-lg font-bold">
                  {game.name}
                </h2>
              </div>

              <div className="overflow-hidden rounded-lg bg-white">
                {/* Desktop header */}
                <div className="hidden grid-cols-[60px_1fr_140px] border-b border-black/5 px-6 py-3 md:grid">
                  <span className="font-obviously text-xs font-medium text-black/40">
                    rank
                  </span>
                  <span className="font-obviously text-xs font-medium text-black/40">
                    name
                  </span>
                  <span className="font-obviously text-right text-xs font-medium text-black/40">
                    {game.scoreLabel}
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
                    {game.scoreLabel}
                  </span>
                </div>

                {/* Rows */}
                {game.players.map((player, index) => {
                  const isLast = index === game.players.length - 1;
                  return (
                    <div key={index}>
                      {/* Desktop row */}
                      <div
                        className={`hidden grid-cols-[60px_1fr_140px] items-center px-6 py-3 md:grid ${!isLast ? "border-b border-black/5" : ""}`}
                      >
                        <span
                          className={`font-obviously-narrow text-sm font-black ${
                            index < 3 ? "text-red" : "text-black/40"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-obviously text-sm font-medium text-black/80">
                          {player.name}
                        </span>
                        <span className="font-obviously text-right text-sm text-black/60">
                          {player.score}
                        </span>
                      </div>

                      {/* Mobile row */}
                      <div
                        className={`grid grid-cols-[40px_1fr_100px] items-center px-4 py-3 md:hidden ${!isLast ? "border-b border-black/5" : ""}`}
                      >
                        <span
                          className={`font-obviously-narrow text-sm font-black ${
                            index < 3 ? "text-red" : "text-black/40"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-obviously text-sm font-medium text-black/80">
                          {player.name}
                        </span>
                        <span className="font-obviously text-right text-sm text-black/60">
                          {player.score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
