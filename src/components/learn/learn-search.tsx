"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  InstantSearch,
  useSearchBox,
  useHits,
  useStats,
  useInstantSearch,
  Configure,
} from "react-instantsearch";
import { liteClient } from "algoliasearch/lite";

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "IN9YQA8T86";
const API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? "5bdded9a269637027ce5f8a477d3a3b5";
const INDEX_NAME = "yap_articles";

const searchClient = liteClient(APP_ID, API_KEY);

const CARD_HEIGHT = "h-14"; // same as search bar (56px)

function HeroStyleSearchBox() {
  const { query, refine, clear, isSearchStalled } = useSearchBox();

  return (
    <div className="relative flex w-full max-w-[600px]">
      <div className="relative flex h-14 w-full items-center rounded-lg bg-white px-6 shadow-[6px_6px_0px_0px_#000000] transition-all duration-100 ease-in-out hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none">
        <Search
          size={20}
          className="shrink-0 text-black/30"
          strokeWidth={2}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => refine(e.target.value)}
          placeholder="search articles, topics, or ideas..."
          className="ml-3 flex-1 bg-transparent font-tiempos-text text-lg text-black outline-none placeholder:text-black/55 focus:outline-none"
          aria-label="Search articles"
          autoComplete="off"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => clear()}
            className="shrink-0 p-1 text-black/30 hover:text-black"
            aria-label="Clear search"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </div>
      {isSearchStalled && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-obviously text-[13px] text-black/40">
          searching...
        </span>
      )}
    </div>
  );
}

function SearchStats() {
  const { nbHits } = useStats();

  if (nbHits === 0) return <p className="font-obviously text-[13px] text-black/50">no results found</p>;
  if (nbHits === 1) return <p className="font-obviously text-[13px] text-black/50">1 article found</p>;
  return (
    <p className="font-obviously text-[13px] text-black/50">
      {nbHits.toLocaleString()} articles found
    </p>
  );
}

/** One row: same height as search bar, full width, thumbnail left + title/topic right */
function ArticleHit({ hit }: { hit: Record<string, unknown> }) {
  const title = (hit._highlightResult as { title?: { value?: string } } | undefined)?.title?.value ?? (hit.title as string) ?? "";
  const topic = (hit.topic_name as string) ?? "";
  const slug = (hit.slug as string) ?? "";
  const thumbnail = (hit.thumbnail_url as string) ?? "";
  const readingTime = hit.reading_time ? `${hit.reading_time} min read` : "";

  return (
    <Link
      href={`/yap-articles/${slug}`}
      className={`group flex ${CARD_HEIGHT} w-full items-center gap-3 overflow-hidden border-b border-black/10 bg-white px-4 transition-colors last:border-b-0 hover:bg-black/[0.03] hover:border-red/20`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-black/5">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-4 w-4 text-black/20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {topic ? (
          <span className="font-obviously text-[10px] font-semibold uppercase tracking-wide text-red">
            {topic}
          </span>
        ) : null}
        <h3
          className="font-obviously-wide truncate text-sm font-semibold text-black [&_mark]:rounded [&_mark]:bg-amber-100 [&_mark]:text-inherit"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {readingTime ? (
          <p className="font-obviously text-[11px] text-black/50">{readingTime}</p>
        ) : null}
      </div>
    </Link>
  );
}

function SearchHits() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="py-6 text-center font-tiempos-text text-[14px] text-black/50">
        no articles found for that search. try different keywords.
      </div>
    );
  }

  return (
    <ul className="list-none p-0">
      {hits.map((hit) => (
        <li key={(hit as { objectID: string }).objectID}>
          <ArticleHit hit={hit as unknown as Record<string, unknown>} />
        </li>
      ))}
    </ul>
  );
}

function LearnSearchDropdown() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const hasQuery = Boolean(indexUiState?.query?.trim());

  useEffect(() => {
    if (!hasQuery) return;

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIndexUiState((prev) => ({ ...prev, query: "" }));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [hasQuery, setIndexUiState]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[600px]">
      <HeroStyleSearchBox />

      <AnimatePresence>
        {hasQuery && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-0 overflow-hidden rounded-b-lg border border-t-0 border-black/10 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.08)]"
          >
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="border-b border-black/10 px-4 py-2">
                <SearchStats />
              </div>
              <SearchHits />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LearnSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName={INDEX_NAME}>
      <Configure hitsPerPage={20} />
      <LearnSearchDropdown />
    </InstantSearch>
  );
}
