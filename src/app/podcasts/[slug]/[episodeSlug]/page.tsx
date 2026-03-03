import Link from "next/link";
import Image from "next/image";
import {
  getPodcastBySlug,
  getPodcastEpisodeBySlug,
  getEpisodesByPodcast,
  getPodcastEpisodes,
  getPodcasts,
} from "@/lib/cms";
import { notFound } from "next/navigation";
import { Heading, Body, Section, Container, TranscriptSection } from "@/components/ui";

type PageParams = { params: { slug: string; episodeSlug: string } };

export async function generateStaticParams() {
  try {
    const [episodes, podcasts] = await Promise.all([
      getPodcastEpisodes(),
      getPodcasts(),
    ]);
    const podcastIdToSlug = Object.fromEntries(
      podcasts.map((p) => [p.id, p.slug])
    );
    return episodes
      .map((ep) => {
        const podcastId =
          typeof ep.podcast === "string"
            ? ep.podcast
            : (ep.podcast as { id?: string })?.id;
        const podcastSlug = podcastId ? podcastIdToSlug[podcastId] : undefined;
        return podcastSlug
          ? { slug: podcastSlug, episodeSlug: ep.slug }
          : null;
      })
      .filter((p): p is { slug: string; episodeSlug: string } => p != null);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const episode = await getPodcastEpisodeBySlug(params.slug, params.episodeSlug);
    const podcast = await getPodcastBySlug(params.slug);
    if (!episode) return { title: "episode not found | attn:seeker" };
    const episodeTitle =
      (episode as { title?: string }).title ?? episode.name;
    return {
      title: `${episodeTitle} | ${podcast?.name ?? "podcasts"} | attn:seeker`,
      description:
        (episode as { shortDescription?: string }).shortDescription ??
        episode.description ??
        "",
    };
  } catch {
    return { title: "episode not found | attn:seeker" };
  }
}

export default async function PodcastEpisodePage({ params }: PageParams) {
  let episode: Awaited<ReturnType<typeof getPodcastEpisodeBySlug>> = null;
  let podcast: Awaited<ReturnType<typeof getPodcastBySlug>> = null;
  let otherEpisodes: Awaited<ReturnType<typeof getEpisodesByPodcast>> = [];
  try {
    episode = await getPodcastEpisodeBySlug(params.slug, params.episodeSlug);
    if (!episode) notFound();
    const podcastId =
      typeof episode.podcast === "string"
        ? episode.podcast
        : (episode.podcast as { id?: string })?.id;
    if (!podcastId) notFound();
    [podcast, otherEpisodes] = await Promise.all([
      getPodcastBySlug(params.slug),
      getEpisodesByPodcast(podcastId).then((list) =>
        list.filter((ep) => ep.slug !== episode!.slug)
      ),
    ]);
  } catch (error) {
    console.error("Failed to fetch podcast episode:", error);
    notFound();
  }
  if (!podcast) notFound();

  const spotifyEmbed =
    (episode as { spotifyEmbed?: string }).spotifyEmbed ??
    (episode as { spotifyEmbedUrl?: string }).spotifyEmbedUrl;
  const embedUrl =
    typeof spotifyEmbed === "string" && !spotifyEmbed.startsWith("<")
      ? spotifyEmbed.includes("?")
        ? `${spotifyEmbed}&theme=0`
        : `${spotifyEmbed}?theme=0`
      : null;
  const embedHtml =
    typeof spotifyEmbed === "string" && spotifyEmbed.startsWith("<")
      ? spotifyEmbed
      : null;

  const episodeNumber = (episode as { episodeNumber?: number }).episodeNumber;
  const episodeTitle = (episode as { title?: string }).title ?? episode.name;
  const publishDate =
    (episode as { publishDate?: string }).publishDate ?? episode.publishedDate;
  const description =
    (episode as { shortDescription?: string }).shortDescription ??
    episode.description ??
    "";
  const descriptionIsHtml = description.includes("<");
  const transcript = (episode as { transcript?: string }).transcript;
  const spotifyLink =
    (podcast as { spotifyLink?: string }).spotifyLink ??
    (podcast as { spotifyUrl?: string }).spotifyUrl;

  const sortedOther = [...otherEpisodes].sort((a, b) => {
    const aNum = (a as { episodeNumber?: number }).episodeNumber ?? 0;
    const bNum = (b as { episodeNumber?: number }).episodeNumber ?? 0;
    return bNum - aNum;
  });

  function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* 1. Player */}
      <Section
        background="black"
        padding="none"
        className="py-8 md:py-16 !bg-transparent"
      >
        <Container width="standard">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="232"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
              title={episodeTitle}
            />
          ) : embedHtml ? (
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: embedHtml }}
            />
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-[#222222] py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]">
                <svg
                  className="ml-1 h-7 w-7 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="font-obviously text-sm text-bone/55">
                available on spotify
              </p>
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
            </div>
          )}
        </Container>
      </Section>

      {/* 2. Episode info */}
      <Section
        background="black"
        padding="none"
        className="py-4 md:py-8 !bg-transparent"
      >
        <Container width="standard">
          <Link
            href={`/podcasts/${podcast.slug}`}
            className="font-obviously text-xs uppercase tracking-wide text-red transition-colors hover:text-red/80"
          >
            {podcast.name}
          </Link>
          {episodeNumber != null && (
            <p className="mt-2 font-obviously-narrow text-[28px] font-black leading-none text-red">
              episode {String(episodeNumber).padStart(2, "0")}
            </p>
          )}
          <Heading level={1} className="mt-2 text-bone">
            {episodeTitle}
          </Heading>
          {publishDate && (
            <p className="mt-3 font-obviously text-xs text-bone/55">
              {formatDate(publishDate)}
            </p>
          )}
          {description && (
            descriptionIsHtml ? (
              <div
                className="prose prose-sm mt-4 max-w-none font-tiempos-text text-bone/80 prose-headings:font-obviously-wide prose-headings:text-bone prose-a:text-red prose-a:no-underline hover:prose-a:underline prose-strong:text-bone prose-blockquote:border-l-red prose-blockquote:text-bone/70 prose-li:marker:text-red"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <Body className="mt-4 text-bone/80">{description}</Body>
            )
          )}
        </Container>
      </Section>

      {/* 3. Transcript */}
      {transcript && transcript.trim() !== "" && (
        <Section
          background="black"
          padding="none"
          className="py-4 md:py-8 !bg-transparent"
        >
          <Container width="content">
            <TranscriptSection transcript={transcript} />
          </Container>
        </Section>
      )}

      {/* 4. More episodes */}
      {sortedOther.length > 0 && (
        <Section
          background="black"
          padding="none"
          className="py-8 md:py-16 !bg-transparent"
        >
          <Container width="wide">
            <p className="mb-4 font-obviously text-sm font-medium text-red">
              more episodes
            </p>
            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
              {sortedOther.slice(0, 10).map((ep) => (
                <Link
                  key={ep.slug}
                  href={`/podcasts/${podcast.slug}/${ep.slug}`}
                  className="group w-[160px] shrink-0"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-black/30">
                    {((ep as { thumbnailUrl?: string }).thumbnailUrl ??
                      (ep as { coverImage?: string }).coverImage) ? (
                      <Image
                        src={
                          (ep as { thumbnailUrl?: string }).thumbnailUrl ??
                          (ep as { coverImage?: string }).coverImage ??
                          ""
                        }
                        alt=""
                        fill
                        className="object-cover transition-all duration-300 group-hover:brightness-110"
                      />
                    ) : null}
                  </div>
                  {(ep as { episodeNumber?: number }).episodeNumber != null && (
                    <p className="mt-2 font-obviously-narrow text-sm font-black text-red">
                      {String(
                        (ep as { episodeNumber?: number }).episodeNumber
                      ).padStart(2, "0")}
                    </p>
                  )}
                  <p className="mt-1 line-clamp-2 font-obviously-wide text-sm font-semibold text-bone transition-colors group-hover:text-red">
                    {(ep as { title?: string }).title ?? ep.name}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
}
