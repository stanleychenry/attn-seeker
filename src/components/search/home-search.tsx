"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { Search, X, ChevronRight } from "lucide-react";
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
import { GLOBAL_INDEX_NAME } from "@/lib/algolia-sync";

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || "";

const searchClient = liteClient(APP_ID, API_KEY);

const CONTACT_PHRASES = [
  "contact",
  "get in touch",
  "talk to",
  "speak to",
  "reach out",
  "email you",
  "call you",
  "hire you",
  "work with you",
  "contact us",
  "contact you",
];

function isContactIntent(query: string): boolean {
  const lower = query.toLowerCase().trim();
  return CONTACT_PHRASES.some((p) => lower.includes(p));
}

function contentTypeLabel(type: string): string {
  if (type === "case-study") return "case study";
  if (type === "show-episode") return "show episode";
  if (type === "podcast-episode") return "podcast episode";
  if (type === "show") return "show";
  if (type === "podcast") return "podcast";
  if (type === "topic") return "topic";
  return type;
}

/** When Algolia returns 0 hits, show these so we never show only "no results". */
const FALLBACK_SUGGESTIONS = [
  { label: "contact", url: "/agency/contact", desc: "Get in touch with the team" },
  { label: "services", url: "/agency/services", desc: "How we can help" },
  { label: "events", url: "/events", desc: "Upcoming events" },
  { label: "podcasts", url: "/podcasts", desc: "Listen to our podcasts" },
  { label: "shows", url: "/shows", desc: "Watch our shows" },
  { label: "articles & learn", url: "/learn", desc: "Articles and topics" },
];

const CARD_HEIGHT = "h-14";

function HeroSearchBox() {
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
          placeholder="e.g. help with TikTok, case studies, contact..."
          className="ml-3 flex-1 bg-transparent font-tiempos-text text-lg text-black outline-none placeholder:text-black/55 focus:outline-none"
          aria-label="Search"
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

function GlobalHit({ hit }: { hit: Record<string, unknown> }) {
  const contentType = (hit.contentType as string) ?? "page";
  const title = (hit.title as string) ?? "";
  const description = (hit.description as string) ?? "";
  const url = (hit.url as string) ?? "#";
  const thumbnailUrl = hit.thumbnailUrl as string | undefined;
  const meta = hit.meta as string | undefined;
  const highlightTitle = (hit._highlightResult as { title?: { value?: string } } | undefined)?.title?.value;

  return (
    <Link
      href={url}
      className={`group flex ${CARD_HEIGHT} w-full items-center gap-3 overflow-hidden border-b border-black/10 bg-white px-4 transition-colors last:border-b-0 hover:bg-black/[0.03] hover:border-red/20`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-black/5">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ChevronRight size={18} className="text-black/20" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-obviously text-[10px] font-semibold uppercase tracking-wide text-red">
          {contentTypeLabel(contentType)}
        </span>
        <h3
          className="font-obviously-wide truncate text-sm font-semibold text-black [&_mark]:rounded [&_mark]:bg-amber-100 [&_mark]:text-inherit"
          dangerouslySetInnerHTML={{
            __html: (highlightTitle ?? title) || "Untitled",
          }}
        />
        {(description || meta) && (
          <p className="font-obviously text-[11px] text-black/50 truncate">
            {meta || description}
          </p>
        )}
      </div>
    </Link>
  );
}

function SearchHitsWithContact() {
  const { hits } = useHits();
  const { indexUiState } = useInstantSearch();
  const query = (indexUiState?.query ?? "").trim();
  const showContact = query.length >= 2 && isContactIntent(query);

  const withContact = showContact
    ? [{ objectID: "contact", contentType: "page", title: "Contact", description: "Get in touch with the team", url: "/agency/contact" } as Record<string, unknown>, ...hits]
    : hits;

  const contactOnly = withContact.filter((h) => h.url === "/agency/contact");
  const teamHits = withContact.filter((h) => (h.contentType as string) === "team");
  const otherHits = withContact.filter(
    (h) => h.url !== "/agency/contact" && (h.contentType as string) !== "team"
  );
  const teamSorted = [...teamHits].sort(
    (a, b) => ((a.sortOrder as number) ?? 999) - ((b.sortOrder as number) ?? 999)
  );
  const displayHits = [...contactOnly, ...teamSorted, ...otherHits];

  const showFallback = displayHits.length === 0;

  return (
    <>
      {displayHits.length > 0 ? (
        <ul className="list-none p-0">
          {displayHits.map((hit) => (
            <li key={(hit as { objectID: string }).objectID}>
              {hit.url === "/agency/contact" ? (
                <Link
                  href="/agency/contact"
                  className={`group flex ${CARD_HEIGHT} w-full items-center gap-3 overflow-hidden border-b border-black/10 bg-white px-4 transition-colors last:border-b-0 hover:bg-black/[0.03] hover:border-red/20`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-obviously text-[10px] font-semibold uppercase tracking-wide text-red">
                      contact
                    </span>
                    <h3 className="font-obviously-wide truncate text-sm font-semibold text-black">
                      Contact
                    </h3>
                    <p className="font-obviously text-[11px] text-black/50">
                      Get in touch with the team
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-black/20 shrink-0" />
                </Link>
              ) : (
                <GlobalHit hit={hit as Record<string, unknown>} />
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {showFallback ? (
        <div className="border-t border-black/10">
          <p className="px-4 py-2 font-obviously text-[11px] uppercase tracking-wide text-black/40">
            you might be interested in
          </p>
          <ul className="list-none p-0">
            {FALLBACK_SUGGESTIONS.map((item) => (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className={`group flex ${CARD_HEIGHT} w-full items-center gap-3 overflow-hidden border-b border-black/10 bg-white px-4 transition-colors last:border-b-0 hover:bg-black/[0.03] hover:border-red/20`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-obviously text-[10px] font-semibold uppercase tracking-wide text-red">
                      {item.label}
                    </span>
                    <h3 className="font-obviously-wide truncate text-sm font-semibold text-black">
                      {item.label}
                    </h3>
                    <p className="font-obviously text-[11px] text-black/50 truncate">
                      {item.desc}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-black/20 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

function SearchStats() {
  const { nbHits } = useStats();
  const { indexUiState } = useInstantSearch();
  const query = (indexUiState?.query ?? "").trim();
  const showContact = query.length >= 2 && isContactIntent(query);
  const total = nbHits + (showContact ? 1 : 0);
  const showFallback = total === 0;

  if (showFallback) return <p className="font-obviously text-[13px] text-black/50">suggested for you</p>;
  if (total === 1) return <p className="font-obviously text-[13px] text-black/50">1 result</p>;
  return (
    <p className="font-obviously text-[13px] text-black/50">
      {total.toLocaleString()} results
    </p>
  );
}

function HomeSearchDropdown() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const hasQuery = Boolean((indexUiState?.query ?? "").trim());

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
      <HeroSearchBox />
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
              <SearchHitsWithContact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HomeSearch() {
  if (!APP_ID || !API_KEY) {
    return (
      <div className="w-full max-w-[600px] rounded-lg border border-black/10 bg-white px-6 py-4 font-tiempos-text text-black/60">
        Search is not configured. Add NEXT_PUBLIC_ALGOLIA_APP_ID and
        NEXT_PUBLIC_ALGOLIA_SEARCH_KEY, then sync the index via POST
        /api/admin/sync-search.
      </div>
    );
  }

  return (
    <InstantSearch searchClient={searchClient} indexName={GLOBAL_INDEX_NAME}>
      <Configure hitsPerPage={20} />
      <HomeSearchDropdown />
    </InstantSearch>
  );
}
