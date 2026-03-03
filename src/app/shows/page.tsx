import Link from "next/link";
import Image from "next/image";
import { getShows } from "@/lib/cms";
import { Heading, Body, Caption, Section, Container } from "@/components/ui";

export const metadata = {
  title: "shows | attn:seeker",
  description:
    "watch original shows from the attention seeker. content that practises what it preaches.",
};

export default async function ShowsPage() {
  let shows: Awaited<ReturnType<typeof getShows>> = [];
  try {
    shows = await getShows();
  } catch (error) {
    console.error("Failed to fetch shows:", error);
  }

  const featuredShow =
    shows.find((s) => (s as { featured?: boolean }).featured) ?? shows[0];
  const allShows = shows;
  const firstShow = shows[0];
  const subscribeUrl =
    (firstShow as { subscribeUrl?: string })?.subscribeUrl ??
    firstShow?.platformUrl ??
    "https://youtube.com";

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* 1. Hero */}
      <Section
        background="black"
        padding="none"
        className="py-16 md:py-24 !bg-transparent"
      >
        <Container width="standard">
          <Caption className="block text-red">watch</Caption>
          <Heading
            level={1}
            className="mt-4 text-bone"
          >
            shows
          </Heading>
          <Body
            size="large"
            className="mt-4 text-[#F5F1E8]/55"
          >
            content that practises what it preaches
          </Body>
        </Container>
      </Section>

      {/* 2. Featured show */}
      {featuredShow && (
        <Section
          background="black"
          padding="none"
          className="py-8 md:py-12 !bg-transparent"
        >
          <Container width="wide">
            <Link
              href={`/shows/${featuredShow.slug}`}
              className="group relative block"
            >
              <div className="relative aspect-video max-h-[400px] w-full overflow-hidden bg-black/30">
                {((featuredShow as { posterImage?: string }).posterImage ||
                  (featuredShow as { coverImage?: string }).coverImage ||
                  featuredShow.thumbnailUrl) ? (
                  <Image
                    src={
                      (featuredShow as { posterImage?: string }).posterImage ??
                      (featuredShow as { coverImage?: string }).coverImage ??
                      featuredShow.thumbnailUrl ??
                      ""
                    }
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : null}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent p-6 md:p-10">
                <h2 className="font-obviously-wide text-2xl font-bold lowercase text-bone md:text-3xl">
                  {featuredShow.name}
                </h2>
                <p className="mt-2 max-w-[500px] font-obviously text-sm text-bone/80">
                  {(featuredShow as { shortDescription?: string })
                    .shortDescription ??
                    (featuredShow as { description?: string }).description ??
                    featuredShow.description ??
                    ""}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  {(featuredShow as { status?: string }).status && (
                    <span className="rounded-full bg-red px-3 py-1 font-obviously text-xs font-medium text-bone">
                      {(featuredShow as { status?: string }).status}
                    </span>
                  )}
                  <span className="rounded-full border border-bone/30 px-4 py-1.5 font-obviously text-xs font-medium text-bone transition-colors group-hover:border-bone/60">
                    watch now
                  </span>
                </div>
              </div>
            </Link>
          </Container>
        </Section>
      )}

      {/* 3. All shows grid */}
      <Section
        background="black"
        padding="none"
        className="py-8 md:py-16 !bg-transparent"
      >
        <Container width="wide">
          {allShows.length === 0 ? (
            <p className="font-obviously text-bone/60">no shows available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allShows.map((show) => {
                const imageUrl =
                  (show as { posterImage?: string }).posterImage ??
                  (show as { coverImage?: string }).coverImage ??
                  show.thumbnailUrl;
                const category = (show as { category?: string }).category;
                const status = (show as { status?: string }).status;
                return (
                  <Link
                    key={show.id}
                    href={`/shows/${show.slug}`}
                    className="group block overflow-hidden rounded-lg bg-[#222222]"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black/30">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt=""
                          fill
                          className="object-cover transition-all duration-300 group-hover:brightness-110"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-obviously-wide text-base font-semibold lowercase text-bone">
                        {show.name}
                      </h3>
                      <p className="mt-1 font-obviously text-xs text-bone/55">
                        {category ?? ""}
                        {category && status ? " · " : ""}
                        {status ?? ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      {/* 4. Subscribe CTA */}
      <Section
        background="black"
        padding="none"
        className="py-16 md:py-24 !bg-transparent"
      >
        <Container width="standard" className="text-center">
          <Heading level={2} className="text-bone">
            never miss an episode
          </Heading>
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full border border-bone/30 px-6 py-2.5 font-obviously text-sm font-medium text-bone transition-colors hover:border-bone/60"
          >
            subscribe on youtube
          </a>
        </Container>
      </Section>
    </div>
  );
}
