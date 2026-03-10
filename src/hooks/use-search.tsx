"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { liteClient } from "algoliasearch/lite";
import { GLOBAL_INDEX_NAME } from "@/lib/algolia-sync";
import type { SearchResult } from "@/types/search";

const DEBOUNCE_MS = 200;

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

const CONTACT_RESULT: SearchResult = {
  type: "page",
  title: "Contact",
  description: "Get in touch with the team",
  url: "/agency/contact",
  reason: "Get in touch with the team",
};

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const client = useMemo(() => {
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
    const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? "";
    if (!appId || !apiKey) return null;
    return liteClient(appId, apiKey);
  }, []);

  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();

      if (!q || q.trim().length < 2) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      debounceRef.current = setTimeout(async () => {
        if (!client) {
          setIsSearching(false);
          return;
        }

        const controller = new AbortController();
        abortRef.current = controller;

        try {
          const response = await client.search({
            requests: [
              {
                indexName: GLOBAL_INDEX_NAME,
                query: q.trim(),
                hitsPerPage: 10,
                attributesToRetrieve: [
                  "objectID",
                  "contentType",
                  "title",
                  "description",
                  "url",
                  "thumbnailUrl",
                ],
              },
            ],
          });

          if (controller.signal.aborted) return;

          const hits =
            (response as { results?: { hits?: Record<string, unknown>[] }[] })
              .results?.[0]?.hits ?? [];

          const mapped: SearchResult[] = hits.map((hit) => ({
            type: (hit.contentType as SearchResult["type"]) ?? "article",
            title: (hit.title as string) ?? "",
            description: (hit.description as string) ?? "",
            url: (hit.url as string) ?? "/",
            thumbnailUrl: hit.thumbnailUrl as string | undefined,
          }));

          const lower = q.toLowerCase().trim();
          const withContact = CONTACT_PHRASES.some((p) => lower.includes(p))
            ? [CONTACT_RESULT, ...mapped]
            : mapped;

          setResults(withContact);
        } catch (err: unknown) {
          if (controller.signal.aborted) return;
          if (err instanceof Error && err.name !== "AbortError") {
            console.error("[useSearch] error:", err);
          }
          setResults([]);
        } finally {
          if (!controller.signal.aborted) setIsSearching(false);
        }
      }, DEBOUNCE_MS);
    },
    [client]
  );

  const value: SearchContextValue = {
    query,
    setQuery,
    results,
    isSearching,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (ctx == null) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return ctx;
}
