import Link from "next/link";
import Image from "next/image";
import {
  getShowBySlug,
  getShowEpisodeBySlug,
  getEpisodesByShow,
  getShowEpisodes,
  getShows,
} from "@/lib/cms";
import { notFound } from "next/navigation";
import { Heading, Body, Section, Container } from "@/components/ui";
import { TranscriptSection } from "@/components/ui";

type PageParams = { params: { slug: string; episodeSlug: string } };

export async function generateStaticParams() {
  try {
    const [episodes, shows] = await Promise.all([
      getShowEpisodes(),
      getShows(),
    ]);
    const showIdToSlug = Object.fromEntries(
      shows.map((s) => [s.id, s.slug])
    );
    return episodes
      .map((ep) => {
        const showId =
          typeof ep.show === "string" ? ep.show : (ep.show as { id?: string })?.id;
        const showSlug = showId ? showIdToSlug[showId] : undefined;
        return showSlug
          ? { slug: showSlug, episodeSlug: ep.slug }
          : null;
      })
      .filter((p): p is { slug: string; episodeSlug: string } => p != null);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const episode = await getShowEpisodeBySlug(params.slug, params.episodeSlug);
    const show = await getShowBySlug(params.slug);
    if (!episode) return { title: "episode not found | attn:seeker" };
    const episodeTitle =
      (episode as { title?: string }).title ?? episode.name;
    return {
      title: `${episodeTitle} | ${show?.name ?? "shows"} | attn:seeker`,
      description:
        (episode as { shortDescription?: string }).shortDescription ?? "",
    };
  } catch {
    return { title: "episode not found | attn:seeker" };
  }
}

export default async function EpisodeDetailPage({ params }: PageParams) {
  let episode: Awaited<ReturnType<typeof getShowEpisodeBySlug>> = null;
  let show: Awaited<ReturnType<typeof getShowBySlug>> = null;
  let otherEpisodes: Awaited<ReturnType<typeof getEpisodesByShow>> = [];
  try {
    episode = await getShowEpisodeBySlug(params.slug, params.episodeSlug);
    if (!episode) notFound();
    const showId =
      typeof episode.show === "string"
        ? episode.show
        : (episode.show as { id?: string })?.id;
    if (!showId) notFound();
    [show, otherEpisodes] = await Promise.all([
      getShowBySlug(params.slug),
      getEpisodesByShow(showId).then((list) =>
        list.filter((ep) => ep.slug !== episode!.slug)
      ),
    ]);
  } catch (error) {
    console.error("Failed to fetch episode:", error);
    notFound();
  }
  if (!show) notFound();

  const youtubeVideoId = (episode as { youtubeVideoId?: string }).youtubeVideoId;
  const thumbnailUrl =
    (episode as { thumbnailUrl?: string }).thumbnailUrl ?? episode.thumbnailUrl;
  const episodeNumber = (episode as { episodeNumber?: number }).episodeNumber;
  const episodeTitle = (episode as { title?: string }).title ?? episode.name;
  const publishDate =
    (episode as { publishDate?: string }).publishDate ?? episode.publishedDate;
  const shortDescription =
    (episode as { shortDescription?: string }).shortDescription ??
    episode.description ??
    "";
  const transcript = (episode as { transcript?: string }).transcript;

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
      {/* 1. Video player */}
      <Section
        background="black"
        padding="none"
        className="py-8 md:py-16 !bg-transparent"
      >
        <Container width="standard">
          {youtubeVideoId ? (
            <div className="aspect-video w-full overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title={episodeTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="relative flex aspect-video w-full items-center justify-center bg-black/30">
              {thumbnailUrl && (
                <Image
                  src={thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover opacity-50"
                />
              )}
              <p className="relative font-obviously text-sm text-bone/55">
                video coming soon
              </p>
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
            href={`/shows/${show.slug}`}
            className="font-obviously text-xs uppercase tracking-wide text-red transition-colors hover:text-red/80"
          >
            {show.name}
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
          {shortDescription && (
            <Body className="mt-4 text-bone/80">{shortDescription}</Body>
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
                  href={`/shows/${show.slug}/${ep.slug}`}
                  className="group w-[200px] shrink-0"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black/30">
                    {(ep as { thumbnailUrl?: string }).thumbnailUrl && (
                      <Image
                        src={(ep as { thumbnailUrl?: string }).thumbnailUrl ?? ""}
                        alt=""
                        fill
                        className="object-cover transition-all duration-300 group-hover:brightness-110"
                      />
                    )}
                  </div>
                  {(ep as { episodeNumber?: number }).episodeNumber != null && (
                    <p className="mt-2 font-obviously-narrow text-sm font-black text-red">
                      {String((ep as { episodeNumber?: number }).episodeNumber).padStart(2, "0")}
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
