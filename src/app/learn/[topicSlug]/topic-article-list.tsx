"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";

const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type ArticleItem = {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string;
  coverImage?: string;
  author?: { name?: string } | string;
  publishedDate?: string;
  publishDate?: string;
  readingTime?: number;
};

type TopicArticleListProps = {
  articles: ArticleItem[];
  topicName: string;
};

export function TopicArticleList({ articles, topicName }: TopicArticleListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visible = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  if (articles.length === 0) return null;

  return (
    <>
      <div className="mt-6 divide-y divide-black/10">
        {visible.map((article) => {
          const thumb =
            (article as { coverImage?: string }).coverImage ??
            article.thumbnailUrl;
          const readingTime =
            (article as { readingTime?: number }).readingTime ??
            article.readingTime;
          return (
            <Link
              key={article.id}
              href={`/yap-articles/${article.slug}`}
              className="group flex items-start gap-4 py-5"
            >
              <div className="min-w-0 flex-1">
                <span className="font-obviously text-xs text-red">
                  {topicName}
                </span>
                <h4 className="mt-1 font-obviously-wide font-semibold text-base text-black transition-colors group-hover:text-red">
                  {article.name}
                </h4>
                <p className="mt-1 font-obviously text-xs text-black/40">
                  {(article.author as { name?: string } | undefined)?.name ??
                    "attn:seeker"}{" "}
                  ·{" "}
                  {formatDate(
                    article.publishedDate ??
                      (article as { publishDate?: string }).publishDate
                  )}{" "}
                  · {readingTime ?? "—"} min read
                </p>
              </div>
              <div className="relative h-[80px] w-[120px] shrink-0 overflow-hidden bg-black/5">
                {thumb ? (
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            type="button"
            onClick={() =>
              setVisibleCount((n) => Math.min(n + LOAD_MORE_COUNT, articles.length))
            }
          >
            load more
          </Button>
        </div>
      )}
    </>
  );
}
