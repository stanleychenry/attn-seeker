import Link from "next/link";
import { Heading, Body, Caption, Section, Container } from "@/components/ui";

export const metadata = {
  title: "join the seekers | attn:seeker",
  description:
    "a community for the ambitious. learn, play, earn, connect.",
};

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "subscribe",
    description:
      "sign up for free and start receiving the daily newsletter in your inbox.",
  },
  {
    number: "02",
    title: "engage",
    description:
      "read articles, play daily puzzle games, attend events, and climb the leaderboard.",
  },
  {
    number: "03",
    title: "earn",
    description:
      "collect status points and yap dollars. spend them in the quarterly rewards store.",
  },
];

const TIERS = [
  {
    name: "bronze",
    threshold: "0 pts",
    perks: [
      "daily newsletter",
      "daily puzzle games",
      "leaderboard access",
    ],
  },
  {
    name: "silver",
    threshold: "500 pts",
    perks: [
      "everything in bronze",
      "rewards store access",
      "monthly bonus games",
    ],
  },
  {
    name: "gold",
    threshold: "2,000 pts",
    perks: [
      "everything in silver",
      "event early access",
      "exclusive content",
    ],
  },
  {
    name: "platinum",
    threshold: "5,000 pts",
    perks: [
      "everything in gold",
      "priority event tickets",
      "quarterly merch drop",
    ],
  },
  {
    name: "black",
    threshold: "10,000 pts",
    perks: [
      "everything in platinum",
      "1:1 strategy session",
      "founding seeker status",
    ],
  },
];

const GAMES = [
  {
    name: "shikaku",
    description:
      "divide the grid into rectangles. each rectangle contains exactly one number matching its area.",
    icon: "▦",
  },
  {
    name: "akari",
    description:
      "place light bulbs to illuminate every cell. no two bulbs can see each other.",
    icon: "💡",
  },
  {
    name: "mastermind",
    description:
      "crack the hidden colour code in as few guesses as possible.",
    icon: "🎯",
  },
];

export default function JoinTheSeekersPage() {
  return (
    <>
      {/* 1. Hero */}
      <Section
        background="red"
        padding="none"
        className="py-24 text-center md:py-32"
      >
        <Container width="standard" className="mx-auto max-w-[700px]">
          <p className="font-obviously-wide text-[64px] font-bold leading-none text-bone">
            a:
          </p>
          <Heading level={1} className="mt-6 text-bone">
            for the seekers
          </Heading>
          <Body
            size="large"
            className="mx-auto mt-4 max-w-[500px] text-bone/80"
          >
            a community for the ambitious. learn, play, earn, connect.
          </Body>
          <Link
            href="/seekers/signup"
            className="mt-8 inline-block rounded-full bg-black px-8 py-3.5 font-obviously text-sm font-medium text-bone transition-colors hover:bg-black/80"
          >
            join for free
          </Link>
        </Container>
      </Section>

      {/* 2. What is it */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="content" className="max-w-[800px]">
          <Caption className="block text-red">what you get</Caption>
          <Heading level={2} className="mt-4">
            more than a newsletter
          </Heading>
          <div className="mt-6 space-y-4 font-tiempos-text text-base leading-relaxed text-black/70">
            <p>
              the seekers is your daily advantage. every weekday, you get a
              newsletter packed with insights on organic social, content
              strategy, and brand building from the team that&apos;s done it for
              real.
            </p>
            <p>
              but it&apos;s not just reading. play daily puzzle games to earn
              points, climb the leaderboard, unlock rewards, and access
              exclusive events. the more you engage, the more you earn.
            </p>
            <p>
              it&apos;s free to join. your attention is the only investment.
            </p>
          </div>
        </Container>
      </Section>

      {/* 3. How it works */}
      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-16 md:py-24"
      >
        <Container width="standard" className="max-w-[900px]">
          <Caption className="mb-8 block text-red">how it works</Caption>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.number} className="relative">
                <p className="font-obviously-narrow text-[48px] font-black leading-none text-red">
                  {step.number}
                </p>
                <h3 className="mt-3 font-obviously-wide text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 font-tiempos-text text-sm leading-relaxed text-black/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Tier system */}
      <Section
        background="black"
        padding="none"
        className="py-16 md:py-24"
      >
        <Container width="full" className="max-w-[1100px]">
          <Caption className="mb-4 block text-red">tiers</Caption>
          <Heading level={2} className="text-bone">
            your tier, your status
          </Heading>
          <p className="mt-2 font-tiempos-text text-base text-bone/60">
            earn status points to level up. higher tiers unlock better rewards.
          </p>
          <div className="mt-10 flex gap-4 overflow-x-auto pb-4 md:grid md:max-w-none md:grid-cols-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="w-[200px] shrink-0 rounded-lg bg-[#222] p-5 md:w-auto"
              >
                <h3 className="font-obviously-wide text-base font-bold text-bone">
                  {tier.name}
                </h3>
                <p className="mt-1 font-obviously text-xs text-bone/55">
                  {tier.threshold}
                </p>
                <ul className="mt-4 space-y-2">
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      className="font-tiempos-text text-xs leading-relaxed text-bone/60"
                    >
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. The daily games */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard" className="max-w-[900px]">
          <Caption className="block text-red">play</Caption>
          <Heading level={2} className="mt-4">
            play every day
          </Heading>
          <p className="mt-4 font-tiempos-text text-base text-black/70">
            three puzzle games drop daily. solve them to earn status points,
            build your streak, and climb the leaderboard.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {GAMES.map((game) => (
              <div
                key={game.name}
                className="rounded-lg border border-black/10 p-6"
              >
                <div className="mb-3 text-3xl">{game.icon}</div>
                <h3 className="font-obviously-wide text-base font-semibold">
                  {game.name}
                </h3>
                <p className="mt-2 font-tiempos-text text-sm leading-relaxed text-black/60">
                  {game.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Rewards store */}
      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-16 md:py-24"
      >
        <Container width="content" className="max-w-[800px]">
          <Caption className="block text-red">earn</Caption>
          <Heading level={2} className="mt-4">
            spend your yap dollars
          </Heading>
          <div className="mt-4 space-y-4 font-tiempos-text text-base leading-relaxed text-black/70">
            <p>
              every quarter, the rewards store opens. spend the yap dollars
              you&apos;ve earned on exclusive merch, event tickets, strategy
              sessions, and more.
            </p>
            <p>
              your tier determines what&apos;s available to you. the higher your
              tier, the better the rewards.
            </p>
          </div>
        </Container>
      </Section>

      {/* 7. CTA */}
      <Section
        background="red"
        padding="none"
        className="py-16 text-center md:py-24"
      >
        <Container width="standard" className="mx-auto max-w-[600px]">
          <Heading level={2} className="text-bone">
            ready to seek?
          </Heading>
          <Link
            href="/seekers/signup"
            className="mt-8 inline-block rounded-full bg-black px-8 py-3.5 font-obviously text-sm font-medium text-bone transition-colors hover:bg-black/80"
          >
            create your account
          </Link>
        </Container>
      </Section>
    </>
  );
}
