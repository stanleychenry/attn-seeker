"use client";

import Link from "next/link";
import { Heading, Section, Container } from "@/components/ui";
import { useSeekers } from "@/hooks/use-seekers";
import { MOCK_ARTICLES } from "@/data/mock";

const TIER_THRESHOLDS: Record<
  string,
  { retain: number; next: string | null; nextThreshold: number | null }
> = {
  bronze: { retain: 0, next: "silver", nextThreshold: 250 },
  silver: { retain: 250, next: "gold", nextThreshold: 750 },
  gold: { retain: 750, next: "platinum", nextThreshold: 2500 },
  platinum: { retain: 2500, next: "black", nextThreshold: 5000 },
  black: { retain: 5000, next: null, nextThreshold: null },
};

const TIER_DOT_COLOR: Record<string, string> = {
  bronze: "bg-amber-600",
  silver: "bg-gray-400",
  gold: "bg-yellow-500",
  platinum: "bg-gray-300",
  black: "bg-black",
};

export default function DashboardClient() {
  const { user, activity, isLoading, error, refetch } = useSeekers();

  if (isLoading && !user) {
    return (
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-tiempos-text text-black/60">Loading your dashboard…</p>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-tiempos-text text-red">{error}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-full bg-red px-5 py-2 font-obviously text-xs font-medium text-bone"
          >
            try again
          </button>
        </Container>
      </Section>
    );
  }

  if (!user) {
    return (
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-tiempos-text text-black/60">
            Sign in to see your dashboard.
          </p>
          <Link
            href="/seekers/login"
            className="mt-3 inline-block rounded-full bg-red px-5 py-2 font-obviously text-xs font-medium text-bone"
          >
            log in
          </Link>
        </Container>
      </Section>
    );
  }

  const tierInfo = TIER_THRESHOLDS[user.tier] ?? TIER_THRESHOLDS.bronze;
  const retainProgress =
    tierInfo.retain > 0
      ? Math.min((user.statusPoints / tierInfo.retain) * 100, 100)
      : 100;
  const upgradeProgress =
    tierInfo.nextThreshold != null
      ? Math.min((user.statusPoints / tierInfo.nextThreshold) * 100, 100)
      : 100;

  const firstName = user.name.split(/\s+/)[0] ?? user.name;
  const recommendedArticles = (MOCK_ARTICLES ?? []).slice(0, 3);

  const stats = [
    { label: "yap dollars", value: `$${user.yapDollars}`, color: "text-red" },
    {
      label: "status points",
      value: user.statusPoints.toLocaleString(),
      color: "text-black",
    },
    {
      label: "day streak",
      value: `${user.currentStreak} days`,
      color: "text-black",
    },
    {
      label: "articles read",
      value: String(user.articlesRead),
      color: "text-black",
    },
  ];

  return (
    <>
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Heading level={1}>
            welcome back, {firstName.toLowerCase()}
          </Heading>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                TIER_DOT_COLOR[user.tier] ?? "bg-black"
              }`}
            />
            <span className="font-obviously text-sm font-medium text-black/70">
              {user.tier} tier
            </span>
          </div>
        </Container>
      </Section>

      <Section background="bone" padding="none" className="pt-0">
        <Container width="standard">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-white p-5">
                <p className="font-obviously text-xs text-black/55">
                  {stat.label}
                </p>
                <p
                  className={`mt-2 font-obviously-narrow text-[32px] font-black leading-none ${stat.color}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="bone" padding="none" className="py-8 md:py-12">
        <Container width="standard">
          <div className="space-y-6 rounded-lg bg-white p-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="font-obviously text-xs text-black/55">
                  retain {user.tier} tier
                </p>
                <p className="font-obviously text-xs text-black/55">
                  {user.statusPoints.toLocaleString()} /{" "}
                  {tierInfo.retain.toLocaleString()} pts
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-red transition-all"
                  style={{ width: `${retainProgress}%` }}
                />
              </div>
            </div>

            {tierInfo.next != null && tierInfo.nextThreshold != null && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-obviously text-xs text-black/55">
                    upgrade to {tierInfo.next}
                  </p>
                  <p className="font-obviously text-xs text-black/55">
                    {user.statusPoints.toLocaleString()} /{" "}
                    {tierInfo.nextThreshold.toLocaleString()} pts
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-black transition-all"
                    style={{ width: `${upgradeProgress}%` }}
                  />
                </div>
              </div>
            )}

            {tierInfo.next == null && (
              <p className="font-tiempos-text text-sm text-black/55">
                you&apos;ve reached the highest tier. welcome to the top.
              </p>
            )}
          </div>
        </Container>
      </Section>

      <Section background="bone" padding="none" className="py-8 md:py-12">
        <Container width="standard">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/seekers/game"
              className="rounded-lg bg-white p-6 text-center transition-shadow hover:shadow-sm"
            >
              <p className="mb-2 text-2xl">🎮</p>
              <h3 className="font-obviously-wide text-sm font-semibold">
                play today&apos;s games
              </h3>
              <p className="mt-1 font-tiempos-text text-xs text-black/55">
                earn points with daily puzzles
              </p>
              <span className="mt-4 inline-block rounded-full bg-red px-5 py-2 font-obviously text-xs font-medium text-bone">
                play now
              </span>
            </Link>

            <Link
              href="/seekers/store"
              className="rounded-lg bg-white p-6 text-center transition-shadow hover:shadow-sm"
            >
              <p className="mb-2 text-2xl">🛍️</p>
              <h3 className="font-obviously-wide text-sm font-semibold">
                rewards store
              </h3>
              <p className="mt-1 font-tiempos-text text-xs text-black/55">
                spend your yap dollars
              </p>
              <span className="mt-4 inline-block rounded-full border border-black/20 px-5 py-2 font-obviously text-xs font-medium text-black/60">
                browse rewards
              </span>
            </Link>

            <Link
              href="/seekers/leaderboard"
              className="rounded-lg bg-white p-6 text-center transition-shadow hover:shadow-sm"
            >
              <p className="mb-2 text-2xl">🏆</p>
              <h3 className="font-obviously-wide text-sm font-semibold">
                leaderboard
              </h3>
              <p className="mt-1 font-tiempos-text text-xs text-black/55">
                see where you rank
              </p>
              <span className="mt-4 inline-block rounded-full border border-black/20 px-5 py-2 font-obviously text-xs font-medium text-black/60">
                view rankings
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-8 md:py-16"
      >
        <Container width="standard">
          <Heading level={2} className="mb-6">
            recent activity
          </Heading>
          <div className="divide-y divide-black/5 rounded-lg bg-white">
            {activity.length === 0 ? (
              <div className="px-5 py-8 text-center font-tiempos-text text-sm text-black/40">
                No recent activity yet.
              </div>
            ) : (
              activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="font-tiempos-text text-sm text-black/80">
                      {item.description}
                    </p>
                    <p className="mt-0.5 font-obviously text-[10px] text-black/40">
                      {new Date(item.timestamp).toLocaleDateString("en-NZ", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <span className="ml-4 shrink-0 font-obviously-narrow text-sm font-black text-red">
                    +{item.pointsEarned} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </Container>
      </Section>

      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-8 md:py-16"
      >
        <Container width="standard">
          <Heading level={2} className="mb-6">
            recommended for you
          </Heading>
          {recommendedArticles.length === 0 ? (
            <p className="py-8 text-center font-tiempos-text text-sm text-black/40">
              Articles coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {recommendedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/yap-articles/${article.slug}`}
                  className="group"
                >
                  <h3 className="font-obviously-wide text-sm font-semibold transition-colors group-hover:text-red">
                    {article.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-tiempos-text text-xs text-black/55">
                    {article.summary}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
