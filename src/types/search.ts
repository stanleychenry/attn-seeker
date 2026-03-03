/**
 * Search result types (Algolia / unified search)
 */

export interface SearchResult {
  type:
    | "service"
    | "case-study"
    | "article"
    | "topic"
    | "show"
    | "podcast"
    | "event"
    | "team"
    | "page";
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  metadata?: Record<string, string>;
  relevance?: number;
  reason?: string;
}
