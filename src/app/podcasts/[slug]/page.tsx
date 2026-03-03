import Image from "next/image";
import { getPodcastBySlug, getEpisodesByPodcast } from "@/lib/cms";
import { notFound } from "next/navigation";
import { Section, Container } from "@/components/ui";
import { PodcastEpisodesList } from "./podcast-episodes-list";

type PageParams = { params: { slug: string } };

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const podcast = await getPodcastBySlug(params.slug);
    if (!podcast) return { title: "podcast not found | attn:seeker" };
    const desc =
      (podcast as { description?: string }).description ??
      (podcast as { shortDescription?: string }).shortDescription ??
      podcast.description ??
      "";
    return {
      title: `${podcast.name} | attn:seeker`,
      description: desc,
    };
  } catch {
    return { title: "podcast not found | attn:seeker" };
  }
}

export default async function PodcastDetailPage({ params }: PageParams) {
  let podcast: Awaited<ReturnType<typeof getPodcastBySlug>> = null;
  let podcastEpisodes: Awaited<ReturnType<typeof getEpisodesByPodcast>> = [];
  try {
    podcast = await getPodcastBySlug(params.slug);
    if (!podcast) notFound();
    podcastEpisodes = await getEpisodesByPodcast(podcast.id);
  } catch (error) {
    console.error("Failed to fetch podcast:", error);
    notFound();
  }

  const sortedEpisodes = [...podcastEpisodes].sort((a, b) => {
    const aNum = (a as { episodeNumber?: number }).episodeNumber ?? 0;
    const bNum = (b as { episodeNumber?: number }).episodeNumber ?? 0;
    return bNum - aNum;
  });

  const coverUrl =
    (podcast as { coverImage?: string }).coverImage ??
    (podcast as { coverUrl?: string }).coverUrl ??
    (podcast as { thumbnailUrl?: string }).thumbnailUrl;
  const description =
    (podcast as { description?: string }).description ??
    (podcast as { shortDescription?: string }).shortDescription ??
    podcast.description ??
    "";
  const spotifyLink =
    (podcast as { spotifyLink?: string }).spotifyLink ??
    (podcast as { spotifyUrl?: string }).spotifyUrl;
  const appleLink =
    (podcast as { appleLink?: string }).appleLink ??
    (podcast as { appleUrl?: string }).appleUrl;

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* 1. Podcast header */}
      <Section
        background="black"
        padding="none"
        className="py-16 md:py-24 !bg-transparent"
      >
        <Container width="standard">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-full shrink-0 md:w-[300px]">
              <div className="relative aspect-square w-full overflow-hidden bg-black/30">
                {coverUrl && (
                  <Image
                    src={coverUrl}
                    alt={podcast.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="font-obviously-wide text-3xl font-bold text-bone md:text-4xl">
                {podcast.name}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                {(podcast as { category?: string }).category && (
                  <span className="rounded-full bg-bone/10 px-3 py-1 font-obviously text-xs text-bone/55">
                    {(podcast as { category?: string }).category}
                  </span>
                )}
                {(podcast as { status?: string }).status && (
                  <span className="rounded-full bg-red px-3 py-1 font-obviously text-xs font-medium text-bone">
                    {(podcast as { status?: string }).status}
                  </span>
                )}
              </div>
              {description && (
                <p className="mt-4 max-w-[500px] font-obviously text-sm text-bone/80">
                  {description}
                </p>
              )}
              <div className="mt-6 flex items-center gap-3">
                {spotifyLink && (
                  <a
                    href={spotifyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-bone/30 px-5 py-2 font-obviously text-sm font-medium text-bone transition-colors hover:border-bone/60"
                  >
                    listen on spotify
                  </a>
                )}
                {appleLink && (
                  <a
                    href={appleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-bone/30 px-5 py-2 font-obviously text-sm font-medium text-bone transition-colors hover:border-bone/60"
                  >
                    subscribe
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Episodes list */}
      {sortedEpisodes.length === 0 && process.env.NODE_ENV === "development" && (
        <Section
          background="black"
          padding="none"
          className="py-8 md:py-16 !bg-transparent"
        >
          <Container width="standard">
            <p className="font-obviously text-sm font-medium text-red">episodes</p>
            <p className="mt-2 font-obviously text-sm text-bone/70">
              No episodes found for this podcast. To debug: open{" "}
              <a
                href={`/api/debug/podcast-episodes?slug=${encodeURIComponent(podcast.slug)}`}
                className="text-red underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                /api/debug/podcast-episodes?slug={podcast.slug}
              </a>{" "}
              in your browser to see podcast ID, episode refs, and ref ID counts.
            </p>
          </Container>
        </Section>
      )}
      {sortedEpisodes.length > 0 && (
        <Section
          background="black"
          padding="none"
          className="py-8 md:py-16 !bg-transparent"
        >
          <Container width="standard">
            <p className="mb-6 font-obviously text-sm font-medium text-red">
              episodes
            </p>
            <PodcastEpisodesList episodes={sortedEpisodes} podcastSlug={podcast.slug} />
          </Container>
        </Section>
      )}
    </div>
  );
}
