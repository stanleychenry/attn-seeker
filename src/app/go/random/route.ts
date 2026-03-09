import { type NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || request.nextUrl.origin;

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

    const path = urls.length > 0 ? urls[Math.floor(Math.random() * urls.length)] ?? "/" : "/";
    const destination = new URL(path, origin);

    return NextResponse.redirect(destination);
  } catch {
    return NextResponse.redirect(new URL("/", origin));
  }
}
