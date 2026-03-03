"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Episode = {
  id: string;
  name: string;
  slug: string;
  publishedDate?: string;
  duration?: string;
};

type Props = {
  episodes: Episode[];
  podcastSlug: string;
};

export function PodcastEpisodesList({ episodes, podcastSlug }: Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visible = episodes.slice(0, visibleCount);
  const hasMore = visibleCount < episodes.length;

  const loadMore = () => {
    setVisibleCount((n) => Math.min(n + LOAD_MORE_COUNT, episodes.length));
  };

  return (
    <>
      <div className="divide-y divide-bone/10">
        {visible.map((ep) => {
          const epAny = ep as Record<string, unknown>;
          const thumbUrl = (epAny.thumbnailUrl ?? epAny.coverImage) as string | undefined;
          const epNum = epAny.episodeNumber as number | undefined;
          const title = (epAny.title ?? ep.name) as string;
          const shortDesc = epAny.shortDescription as string | undefined;
          const publishDate = (epAny.publishDate ?? ep.publishedDate) as string | undefined;
          const duration = (epAny.duration ?? ep.duration) as string | undefined;
          const hasEmbed = epAny.spotifyEmbed ?? epAny.spotifyEmbedUrl;

          return (
            <Link
              key={ep.id}
              href={`/podcasts/${podcastSlug}/${ep.slug}`}
              className="group flex gap-4 py-4 first:pt-0"
            >
              <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden bg-black/30">
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center gap-2">
                  {epNum != null && (
                    <span className="font-obviously-narrow text-lg font-black leading-none text-red">
                      {String(epNum).padStart(2, "0")}
                    </span>
                  )}
                  <h3 className="truncate font-obviously-wide text-base font-semibold text-bone transition-colors group-hover:text-red">
                    {title}
                  </h3>
                </div>
                {shortDesc && (
                  <p className="mt-1 line-clamp-2 font-obviously text-sm text-bone/55">
                    {shortDesc}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {publishDate && (
                    <span className="font-obviously text-xs text-bone/55">
                      {formatDate(publishDate)}
                    </span>
                  )}
                  {duration && (
                    <>
                      <span className="text-bone/30">·</span>
                      <span className="font-obviously text-xs text-bone/55">
                        {duration}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {Boolean(hasEmbed) && (
                <div className="hidden w-[80px] shrink-0 md:block">
                  <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#1DB954]/10">
                    <svg
                      className="h-5 w-5 text-[#1DB954]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          className="mt-6 rounded-full border border-bone/30 px-5 py-2 font-obviously text-sm font-medium text-bone transition-colors hover:border-bone/60"
        >
          load more
        </button>
      )}
    </>
  );
}
