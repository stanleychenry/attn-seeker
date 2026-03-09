import Link from "next/link";
import Image from "next/image";
import { getPodcasts } from "@/lib/cms";
import { Heading, Caption, Section, Container } from "@/components/ui";

export const metadata = {
  title: "podcasts | attn:seeker",
  description: "listen to podcasts from the attention seeker.",
};

/** Cache the page and revalidate from Webflow every 5 minutes. */
export const revalidate = 300;

export default async function PodcastsPage() {
  let podcasts: Awaited<ReturnType<typeof getPodcasts>> = [];
  try {
    podcasts = await getPodcasts();
  } catch (error) {
    console.error("Failed to fetch podcasts:", error);
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* 1. Hero */}
      <Section
        background="black"
        padding="none"
        className="py-16 md:py-24 !bg-transparent"
      >
        <Container width="standard">
          <Caption className="block text-red">listen</Caption>
          <Heading level={1} className="mt-4 text-bone">
            podcasts
          </Heading>
        </Container>
      </Section>

      {/* 2. Podcast grid */}
      <Section
        background="black"
        padding="none"
        className="py-8 md:py-16 !bg-transparent"
      >
        <Container width="wide">
          {podcasts.length === 0 ? (
            <p className="font-obviously text-bone/60">no podcasts available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {podcasts.map((podcast) => {
                const coverUrl =
                  (podcast as { coverImage?: string }).coverImage ??
                  (podcast as { thumbnailUrl?: string }).thumbnailUrl ??
                  (podcast as { coverUrl?: string }).coverUrl;
                const spotifyLink =
                  (podcast as { spotifyLink?: string }).spotifyLink ??
                  (podcast as { spotifyUrl?: string }).spotifyUrl;
                const shortDesc =
                  (podcast as { shortDescription?: string }).shortDescription ??
                  (podcast as { description?: string }).description ??
                  podcast.description ??
                  "";
                const category = (podcast as { category?: string }).category;
                const status = (podcast as { status?: string }).status;

                return (
                  <div
                    key={podcast.id}
                    className="overflow-hidden rounded-lg bg-[#222222] p-5"
                  >
                    <Link
                      href={`/podcasts/${podcast.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-black/30">
                        {coverUrl && (
                          <Image
                            src={coverUrl}
                            alt={podcast.name}
                            fill
                            className="object-cover transition-all duration-300 group-hover:brightness-110"
                          />
                        )}
                      </div>
                    </Link>

                    <div className="mt-4">
                      <Link href={`/podcasts/${podcast.slug}`}>
                        <h2 className="font-obviously-wide text-xl font-bold text-bone transition-colors hover:text-red">
                          {podcast.name}
                        </h2>
                      </Link>
                      {shortDesc && (
                        <p className="mt-2 line-clamp-3 font-obviously text-sm text-bone/80">
                          {shortDesc}
                        </p>
                      )}
                      <p className="mt-2 font-obviously text-xs text-bone/55">
                        {category ?? ""}
                        {category && status ? " · " : ""}
                        {status ?? ""}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        {spotifyLink && (
                          <a
                            href={spotifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-bone/30 px-4 py-2 font-obviously text-xs font-medium text-bone transition-colors hover:border-bone/60"
                          >
                            listen on spotify
                          </a>
                        )}
                        <Link
                          href={`/podcasts/${podcast.slug}`}
                          className="rounded-full border border-bone/30 px-4 py-2 font-obviously text-xs font-medium text-bone transition-colors hover:border-bone/60"
                        >
                          all episodes
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
