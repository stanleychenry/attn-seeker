"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/use-search";

const HERO_PLACEHOLDERS = [
  "e.g. how do I grow on TikTok?",
  "e.g. I need help managing my brand's socials",
  "e.g. what social media services do you offer?",
  "e.g. show me case studies for food brands",
  "e.g. what's the best LinkedIn posting strategy?",
  "e.g. are there any upcoming events in Auckland?",
];
const COMPACT_PLACEHOLDER = "search...";

function typeLabel(type: string): string {
  return type === "case-study" ? "case study" : type;
}

export interface SearchBarProps {
  variant: "hero" | "compact";
  /** When true (e.g. nav on /shows), use bone shadow so hard-edge is visible on dark bg */
  darkNav?: boolean;
  onFocus?: () => void;
  className?: string;
}

export function SearchBar({ variant, darkNav, onFocus, className }: SearchBarProps) {
  const { query, setQuery, results, isSearching } = useSearch();
  const [placeholder, setPlaceholder] = useState(
    variant === "hero" ? HERO_PLACEHOLDERS[0]! : COMPACT_PLACEHOLDER
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const isHero = variant === "hero";

  useEffect(() => {
    if (isHero) {
      setPlaceholder(
        HERO_PLACEHOLDERS[Math.floor(Math.random() * HERO_PLACEHOLDERS.length)] ??
          HERO_PLACEHOLDERS[0]!
      );
    } else {
      setPlaceholder(COMPACT_PLACEHOLDER);
    }
  }, [isHero]);

  function handleFocus() {
    onFocus?.();
  }

  const showDropdown = query.length >= 2;

  return (
    <div
      className={cn(
        "relative w-full",
        isHero ? "max-w-[600px]" : "max-w-[400px]",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center bg-white transition-all duration-100 ease-in-out",
          isHero
            ? "h-14 rounded-lg px-6 shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none"
            : [
                "h-10 rounded-full px-3 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
                darkNav
                  ? "shadow-[4px_4px_0px_0px_#F5F1E8]"
                  : "shadow-[4px_4px_0px_0px_#000000]",
              ]
        )}
      >
        <Search
          size={isHero ? 20 : 18}
          className="text-black/30 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn(
            "flex-1 ml-3 bg-transparent outline-none font-tiempos-text text-black placeholder:text-black/55 focus:outline-none",
            isHero ? "text-lg" : "text-sm"
          )}
          aria-label="Search"
          autoComplete="off"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-black/30 hover:text-black shrink-0 p-1"
            aria-label="Clear search"
          >
            <X size={isHero ? 18 : 16} strokeWidth={2} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-black/5 overflow-y-auto z-50",
            isHero ? "rounded-xl max-h-[400px]" : "rounded-lg max-h-[320px]"
          )}
        >
          {isSearching ? (
            <div className={cn("text-center", isHero ? "px-6 py-4" : "px-4 py-3")}>
              <span className="font-obviously font-medium text-[13px] text-black/40">
                thinking...
              </span>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((result, i) => (
                <Link
                  key={`${result.type}-${result.url}-${i}`}
                  href={result.url}
                  className={cn(
                    "flex items-start gap-3 transition-colors border-b border-black/5 last:border-b-0 hover:bg-black/[0.03]",
                    isHero ? "px-5 py-3" : "px-4 py-2"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-obviously font-medium text-[11px] text-black/40 uppercase shrink-0">
                        {typeLabel(result.type)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "font-obviously font-medium text-black truncate",
                        isHero ? "text-[15px]" : "text-[14px]"
                      )}
                    >
                      {result.title}
                    </p>
                    {result.reason && (
                      <p className="font-tiempos-text text-[13px] text-black/50 mt-0.5 truncate">
                        {result.reason}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-black/20 mt-1 shrink-0" />
                </Link>
              ))}
              <div
                className={cn(
                  "text-center border-t border-black/5",
                  isHero ? "px-5 py-2" : "px-4 py-1.5"
                )}
              >
                <span className="font-obviously font-normal text-[11px] text-black/30">
                  powered by ai
                </span>
              </div>
            </>
          ) : (
            <div className={cn("text-center", isHero ? "px-6 py-4" : "px-4 py-3")}>
              <span className="font-obviously font-medium text-[13px] text-black/40">
                no results found
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
