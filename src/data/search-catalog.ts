import { MOCK_SERVICES } from "./mock/services";
import { MOCK_CASE_STUDIES } from "./mock/case-studies";
import { MOCK_ARTICLES } from "./mock/articles";
import { MOCK_TOPICS } from "./mock/topics";
import { MOCK_SHOWS } from "./mock/shows";
import { MOCK_PODCASTS } from "./mock/podcasts";
import { MOCK_EVENTS } from "./mock/events";

export interface CatalogItem {
  type:
    | "service"
    | "case-study"
    | "article"
    | "topic"
    | "show"
    | "podcast"
    | "event";
  title: string;
  description: string;
  slug: string;
  url: string;
  metadata?: Record<string, string>;
}

export function buildCatalog(): CatalogItem[] {
  const catalog: CatalogItem[] = [];

  MOCK_SERVICES.forEach((s) => {
    const keyBenefits = s.keyBenefits;
    const keyBenefitsStr = Array.isArray(keyBenefits)
      ? keyBenefits.join(". ")
      : (keyBenefits ?? "");
    const keyBenefitsMeta = Array.isArray(keyBenefits)
      ? keyBenefits.join(", ")
      : (keyBenefits ?? "");
    catalog.push({
      type: "service",
      title: s.name,
      description: (s.shortDescription ?? "") + " " + keyBenefitsStr,
      slug: s.slug,
      url: `/agency/services/${s.slug}`,
      metadata: {
        benefits: keyBenefitsMeta,
      },
    });
  });

  MOCK_CASE_STUDIES.forEach((cs) => {
    catalog.push({
      type: "case-study",
      title: cs.name,
      description: `${cs.client} - ${cs.industry}. ${cs.challenge}`,
      slug: cs.slug,
      url: `/agency/work/${cs.slug}`,
      metadata: {
        client: cs.client,
        stats: cs.stats.map((st) => `${st.value} ${st.label}`).join(", "),
      },
    });
  });

  MOCK_TOPICS.filter((t) => t.isPillar).forEach((t) => {
    catalog.push({
      type: "topic",
      title: t.name,
      description: t.description,
      slug: t.slug,
      url: `/learn/${t.slug}`,
    });
  });

  MOCK_ARTICLES.forEach((a) => {
    catalog.push({
      type: "article",
      title: a.name,
      description: a.summary,
      slug: a.slug,
      url: `/yap-articles/${a.slug}`,
      metadata: { readingTime: `${a.readingTime} min` },
    });
  });

  MOCK_SHOWS.forEach((s) => {
    catalog.push({
      type: "show",
      title: s.name,
      description: s.description,
      slug: s.slug,
      url: `/shows/${s.slug}`,
    });
  });

  MOCK_PODCASTS.forEach((p) => {
    catalog.push({
      type: "podcast",
      title: p.name,
      description: p.description,
      slug: p.slug,
      url: `/podcasts/${p.slug}`,
    });
  });

  MOCK_EVENTS.forEach((e) => {
    catalog.push({
      type: "event",
      title: e.name,
      description: e.description,
      slug: e.slug,
      url: `/events/${e.slug}`,
      metadata: { date: e.date, location: e.location },
    });
  });

  return catalog;
}
