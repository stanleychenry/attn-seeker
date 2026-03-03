import Link from "next/link";
import Image from "next/image";
import { getShowBySlug, getEpisodesByShow } from "@/lib/cms";
import { notFound } from "next/navigation";
import { Heading, Body, Section, Container } from "@/components/ui";

type PageParams = { params: { slug: string } };

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const show = await getShowBySlug(params.slug);
    if (!show) return { title: "show not found | attn:seeker" };
    const shortDesc =
      (show as { shortDescription?: string }).shortDescription ??
      (show as { description?: string }).description ??
      show.description ??
      "";
    return {
      title: `${show.name} | attn:seeker`,
      description: shortDesc,
    };
  } catch {
    return { title: "show not found | attn:seeker" };
  }
}

function formatEpisodeDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ShowDetailPage({ params }: PageParams) {
  let show: Awaited<ReturnType<typeof getShowBySlug>> = null;
  let showEpisodes: Awaited<ReturnType<typeof getEpisodesByShow>> = [];
  try {
    show = await getShowBySlug(params.slug);
    if (!show) notFound();
    showEpisodes = await getEpisodesByShow(show.id);
  } catch (error) {
    console.error("Failed to fetch show:", error);
    notFound();
  }

  const sortedEpisodes = [...showEpisodes].sort((a, b) => {
    const aNum = (a as { episodeNumber?: number }).episodeNumber ?? 0;
    const bNum = (b as { episodeNumber?: number }).episodeNumber ?? 0;
    return bNum - aNum;
  });
  const displayedEpisodes = sortedEpisodes.slice(0, 10);
  const hasMoreEpisodes = sortedEpisodes.length > 10;

  const posterUrl =
    (show as { posterImage?: string }).posterImage ??
    (show as { coverImage?: string }).coverImage ??
    show.thumbnailUrl;
  const shortDesc =
    (show as { shortDescription?: string }).shortDescription ??
    (show as { description?: string }).description ??
    show.description ??
    "";
  const subscribeUrl =
    (show as { subscribeUrl?: string }).subscribeUrl ??
    show.platformUrl ??
    "#";
  const playlistUrl =
    (show as { playlistUrl?: string }).playlistUrl ?? show.platformUrl ?? "#";

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* 1. Show header */}
      <Section
        background="black"
        padding="none"
        className="py-16 md:py-24 !bg-transparent"
      >
        <Container width="standard">
          {posterUrl ? (
            <div className="relative max-h-[300px] w-full overflow-hidden">
              <Image
                src={posterUrl}
                alt={show.name}
                width={1200}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="mt-6">
            <Heading level={1} className="text-bone">
              {show.name}
            </Heading>
            <div className="mt-3 flex items-center gap-3">
              {(show as { category?: string }).category && (
                <span className="rounded-full bg-bone/10 px-3 py-1 font-obviously text-xs text-bone/55">
                  {(show as { category?: string }).category}
                </span>
              )}
              {(show as { status?: string }).status && (
                <span className="rounded-full bg-red px-3 py-1 font-obviously text-xs font-medium text-bone">
                  {(show as { status?: string }).status}
                </span>
              )}
            </div>
            {shortDesc && (
              <Body className="mt-4 text-bone/80">{shortDesc}</Body>
            )}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-bone/30 px-5 py-2 font-obviously text-sm font-medium text-bone transition-colors hover:border-bone/60"
              >
                subscribe on youtube
              </a>
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-bone/30 px-5 py-2 font-obviously text-sm font-medium text-bone transition-colors hover:border-bone/60"
              >
                view playlist
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Episodes list */}
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
            <div className="divide-y divide-bone/10">
              {displayedEpisodes.map((ep) => {
                const epSlug = (ep as { slug?: string }).slug ?? ep.slug;
                const thumbUrl = (ep as { thumbnailUrl?: string }).thumbnailUrl;
                const epNum = (ep as { episodeNumber?: number }).episodeNumber;
                const title = (ep as { title?: string }).title ?? ep.name;
                const shortDescription = (ep as { shortDescription?: string })
                  .shortDescription;
                const publishDate =
                  (ep as { publishDate?: string }).publishDate ??
                  ep.publishedDate;
                return (
                  <Link
                    key={ep.id}
                    href={`/shows/${show.slug}/${epSlug}`}
                    className="group flex gap-4 py-4 first:pt-0"
                  >
                    <div className="relative aspect-video w-[200px] shrink-0 overflow-hidden bg-black/30">
                      {thumbUrl ? (
                        <Image
                          src={thumbUrl}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60">
                          <svg
                            className="ml-0.5 h-4 w-4 text-bone"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-col justify-center">
                      {epNum != null && (
                        <span className="font-obviously-narrow font-black leading-none text-red text-[24px]">
                          {String(epNum).padStart(2, "0")}
                        </span>
                      )}
                      <h4 className="mt-1 font-obviously-wide text-base font-semibold text-bone transition-colors group-hover:text-red">
                        {title}
                      </h4>
                      {shortDescription && (
                        <p className="mt-1 line-clamp-2 font-obviously text-sm text-bone/55">
                          {shortDescription}
                        </p>
                      )}
                      {publishDate && (
                        <p className="mt-2 font-obviously text-xs text-bone/55">
                          {formatEpisodeDate(publishDate)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            {hasMoreEpisodes && (
              <button
                type="button"
                className="mt-6 rounded-full border border-bone/30 px-5 py-2 font-obviously text-sm font-medium text-bone transition-colors hover:border-bone/60"
              >
                load more
              </button>
            )}
          </Container>
        </Section>
      )}
    </div>
  );
}
