import { NextResponse } from "next/server";
import { NAV_LINKS } from "@/lib/constants";
import {
  getYapArticleSlugs,
  getCaseStudySlugs,
  getTopicSlugs,
  getShowSlugs,
  getPodcastSlugs,
  getEventSlugs,
  getEventSeriesSlugs,
  getServiceSlugs,
  getJobSlugs,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "";

  try {
    const [
      articleSlugs,
      caseStudySlugs,
      topicSlugs,
      showSlugs,
      podcastSlugs,
      eventSlugs,
      eventSeriesSlugs,
      serviceSlugs,
      jobSlugs,
    ] = await Promise.all([
      getYapArticleSlugs().catch(() => []),
      getCaseStudySlugs().catch(() => []),
      getTopicSlugs().catch(() => []),
      getShowSlugs().catch(() => []),
      getPodcastSlugs().catch(() => []),
      getEventSlugs().catch(() => []),
      getEventSeriesSlugs().catch(() => []),
      getServiceSlugs().catch(() => []),
      getJobSlugs().catch(() => []),
    ]);

    const mainPages = NAV_LINKS.filter((l) => l.href !== "/").map((l) => l.href);

    const urls: string[] = [
      ...mainPages,
      ...articleSlugs.map((s) => `/yap-articles/${s}`),
      ...caseStudySlugs.map((s) => `/agency/work/${s}`),
      ...topicSlugs.map((s) => `/learn/${s}`),
      ...showSlugs.map((s) => `/shows/${s}`),
      ...podcastSlugs.map((s) => `/podcasts/${s}`),
      ...eventSlugs.map((s) => `/events/${s}`),
      ...eventSeriesSlugs.map((s) => `/events/series/${s}`),
      ...serviceSlugs.map((s) => `/agency/services/${s}`),
      ...jobSlugs.map((s) => `/agency/careers/${s}`),
    ].filter(Boolean);

    if (urls.length === 0) {
      return NextResponse.redirect(new URL("/", base || "http://localhost:3000"));
    }

    const randomUrl = urls[Math.floor(Math.random() * urls.length)] ?? "/";
    const destination = base ? new URL(randomUrl, base) : randomUrl;

    return NextResponse.redirect(destination);
  } catch {
    const fallback = base ? new URL("/", base) : "/";
    return NextResponse.redirect(fallback);
  }
}
