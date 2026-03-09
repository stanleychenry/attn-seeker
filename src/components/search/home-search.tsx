"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchResult } from "@/types/search";

function typeLabel(type: string): string {
  if (type === "case-study") return "case study";
  if (type === "show-episode") return "show episode";
  if (type === "podcast-episode") return "podcast episode";
  if (type === "show") return "show";
  if (type === "podcast") return "podcast";
  if (type === "topic") return "topic";
  return type;
}

const FALLBACK_SUGGESTIONS = [
  { label: "contact", url: "/agency/contact", desc: "Get in touch with the team" },
  { label: "services", url: "/agency/services", desc: "How we can help" },
  { label: "events", url: "/events", desc: "Upcoming events" },
  { label: "podcasts", url: "/podcasts", desc: "Listen to our podcasts" },
  { label: "shows", url: "/shows", desc: "Watch our shows" },
  { label: "articles & learn", url: "/learn", desc: "Articles and topics" },
];

const CARD_HEIGHT = "h-14";
const DEBOUNCE_MS = 300;

function HitCard({
  hit,
  onNavigate,
}: {
  hit: SearchResult;
  onNavigate: (url: string) => void;
}) {
  const safeUrl = hit.url && hit.url !== "#" ? hit.url : "/";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(safeUrl);
  };

  if (hit.url === "/agency/contact" || hit.type === "page") {
    return (
      <Link
        href={safeUrl}
        onClick={handleClick}
        className={`group flex ${CARD_HEIGHT} w-full items-center gap-3 overflow-hidden border-b border-black/10 bg-white px-4 transition-colors last:border-b-0 hover:bg-black/[0.03] hover:border-red/20`}
      >
        <div className="min-w-0 flex-1">
          <span className="font-obviously text-[10px] font-semibold uppercase tracking-wide text-red">
            {hit.url === "/agency/contact" ? "contact" : typeLabel(hit.type)}
          </span>
          <h3 className="font-obviously-wide truncate text-sm font-semibold text-black">
            {hit.title}
          </h3>
          <p className="font-obviously text-[11px] text-black/50 truncate">
            {hit.reason ?? hit.description}
          </p>
        </div>
        <ChevronRight size={18} className="text-black/20 shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      href={safeUrl}
      onClick={handleClick}
      className={`group flex ${CARD_HEIGHT} w-full items-center gap-3 overflow-hidden border-b border-black/10 bg-white px-4 transition-colors last:border-b-0 hover:bg-black/[0.03] hover:border-red/20`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-black/5">
        {hit.thumbnailUrl ? (
          <Image
            src={hit.thumbnailUrl}
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
          {typeLabel(hit.type)}
        </span>
        <h3 className="font-obviously-wide truncate text-sm font-semibold text-black">
          {hit.title}
        </h3>
        {(hit.description || hit.reason) && (
          <p className="font-obviously text-[11px] text-black/50 truncate">
            {hit.reason ?? hit.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback(
    (url: string) => {
      setQuery("");
      router.push(url);
    },
    [router]
  );

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    setIsSearching(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const controller = new AbortController();
        abortRef.current = controller;
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim() }),
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("[HomeSearch] error:", err);
          setResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    if (!query.trim()) return;
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const showFallback = hasQuery && !isSearching && results.length === 0;
  const total = results.length;

  return (
    <div ref={containerRef} className="relative w-full max-w-[600px]">
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. help with TikTok, case studies, who is Stanley..."
            className="ml-3 flex-1 bg-transparent font-tiempos-text text-lg text-black outline-none placeholder:text-black/55 focus:outline-none"
            aria-label="Search"
            autoComplete="off"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 p-1 text-black/30 hover:text-black"
              aria-label="Clear search"
            >
              <X size={18} strokeWidth={2} />
            </button>
          )}
        </div>
        {isSearching && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-obviously text-[13px] text-black/40">
            searching...
          </span>
        )}
      </div>

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
                {showFallback ? (
                  <p className="font-obviously text-[13px] text-black/50">
                    suggested for you
                  </p>
                ) : total === 1 ? (
                  <p className="font-obviously text-[13px] text-black/50">
                    1 result
                  </p>
                ) : (
                  <p className="font-obviously text-[13px] text-black/50">
                    {total.toLocaleString()} results
                  </p>
                )}
              </div>
              {results.length > 0 ? (
                <ul className="list-none p-0">
                  {results.map((hit, i) => (
                    <li key={`${hit.type}-${hit.url}-${i}`}>
                      <HitCard hit={hit} onNavigate={handleNavigate} />
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigate(item.url);
                          }}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
