import LeaderboardsClient from "./leaderboards-client";

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

      {/* Live game leaderboards */}
      <section className="bg-bone px-6 pb-20">
        <div className="mx-auto max-w-[900px]">
          <LeaderboardsClient />
        </div>
      </section>
    </>
  );
}
