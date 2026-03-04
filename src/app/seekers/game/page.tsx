import Link from "next/link";
import { Heading, Section, Container } from "@/components/ui";
import GameCardsClient from "./game-cards-client";

const MOCK_USER_STREAK = 12;

const MOCK_LEADERBOARD_TODAY = [
  { rank: 1, name: "olivia t.", score: 45 },
  { rank: 2, name: "james w.", score: 42 },
  { rank: 3, name: "stanley h.", score: 38 },
  { rank: 4, name: "aroha m.", score: 35 },
  { rank: 5, name: "liam c.", score: 30 },
];

export const metadata = {
  title: "daily games | attn:seeker",
  description: "play daily puzzles and earn status points.",
};

const RANK_COLOR: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

export default function SeekersGamePage() {
  return (
    <>
      {/* 1. Header */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-obviously text-sm font-medium text-red">
            daily games
          </p>
          <Heading level={1} className="mt-4">
            play today&apos;s puzzles
          </Heading>
          <p className="mt-3 font-obviously text-sm font-medium text-red">
            🔥 {MOCK_USER_STREAK} day streak
          </p>
        </Container>
      </Section>

      {/* 2. Game selection */}
      <Section background="bone" padding="none" className="py-8 md:py-16">
        <Container width="standard">
          <GameCardsClient />
        </Container>
      </Section>

      {/* 3. How points work */}
      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-8 md:py-12"
      >
        <Container width="standard">
          <p className="mx-auto max-w-[500px] text-center font-obviously text-xs leading-relaxed text-black/40">
            complete a puzzle to earn 2 status points. play all three for a
            daily bonus. maintain your streak for multipliers.
          </p>
        </Container>
      </Section>

      {/* 4. Leaderboard preview */}
      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-8 md:py-16"
      >
        <Container width="standard">
          <h3 className="mb-6 font-obviously-wide text-xl font-bold">
            today&apos;s top players
          </h3>
          <div className="divide-y divide-black/5 rounded-lg bg-white">
            {MOCK_LEADERBOARD_TODAY.map((player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 font-obviously-narrow text-lg font-black ${
                      RANK_COLOR[player.rank] ?? "text-black/30"
                    }`}
                  >
                    {player.rank}
                  </span>
                  <span className="font-tiempos-text text-sm text-black/80">
                    {player.name}
                  </span>
                </div>
                <span className="font-obviously-narrow text-sm font-black text-black/60">
                  {player.score} pts
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/seekers/leaderboard"
              className="inline-block rounded-full border border-black/20 px-5 py-2.5 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
            >
              view full leaderboard
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
