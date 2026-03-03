"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Event, EventSeries } from "@/types/cms";
import { Heading, Body, Section, Container } from "@/components/ui";

const now = new Date();

type FilterTab = "upcoming" | "past";

type EventsPageClientProps = {
  events: Event[];
  eventSeriesList: EventSeries[];
  fetchError?: string | null;
};

export function EventsPageClient({ events: initialEvents, eventSeriesList, fetchError }: EventsPageClientProps) {
  const [filter, setFilter] = useState<FilterTab>("upcoming");

  const allEvents = initialEvents.map((event) => {
    const dateRaw =
      (event as { date?: string }).date ??
      (event as { startDate?: string }).startDate ??
      (event as { startDateTime?: string }).startDateTime ??
      event.date;
    const eventDate = dateRaw ? new Date(dateRaw) : new Date(0);
    const isValidDate = !Number.isNaN(eventDate.getTime());
    const derivedStatus =
      (event as { status?: string }).status?.toLowerCase?.() ??
      (isValidDate ? (eventDate > now ? "upcoming" : "past") : "upcoming");
    return { ...event, derivedStatus, eventDate: isValidDate ? eventDate : null };
  });

  const getEventTime = (e: (typeof allEvents)[0]) => {
    const raw =
      (e as { date?: string }).date ??
      (e as { startDate?: string }).startDate ??
      (e as { startDateTime?: string }).startDateTime ??
      e.date;
    const t = raw ? new Date(raw).getTime() : 0;
    return Number.isNaN(t) ? 0 : t;
  };

  const filteredEvents = allEvents
    .filter((e) => {
      if (filter === "upcoming")
        return e.derivedStatus === "upcoming" || e.derivedStatus === "waitlist";
      return e.derivedStatus === "past" || e.derivedStatus === "sold-out";
    })
    .sort((a, b) => {
      const timeA = getEventTime(a);
      const timeB = getEventTime(b);
      return filter === "upcoming" ? timeA - timeB : timeB - timeA;
    });

  const seriesWithUpcoming = (eventSeriesList ?? []).filter((series) =>
    allEvents.some(
      (e) =>
        ((e as { seriesId?: string }).seriesId === series.id ||
          (e as { series?: { id?: string } }).series === series.id ||
          (e as { series?: { id?: string } }).series?.id === series.id ||
          (e as { eventSeries?: string }).eventSeries === series.id) &&
        (e.derivedStatus === "upcoming" || e.derivedStatus === "waitlist")
    )
  );

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-obviously text-sm font-medium text-red">events</p>
          <Heading level={1} className="mt-4">
            what's on
          </Heading>
          <Body size="large" className="mt-4 text-black/80">
            workshops, talks, and gatherings for people who want to learn.
          </Body>
        </Container>
      </Section>

      {/* 2. Fetch error (e.g. CMS / API key) */}
      {fetchError && (
        <Section background="bone" padding="none" className="pb-4">
          <Container width="standard">
            <p className="rounded-lg border border-red/30 bg-red/5 px-4 py-3 font-obviously text-sm text-red">
              Could not load events from the CMS. ({fetchError}) Check that WEBFLOW_API_KEY is set and has CMS access.
            </p>
          </Container>
        </Section>
      )}

      {/* 3. Filter tabs + 4. Series highlights + 5. Events list */}
      <Section background="bone" padding="none" className="pb-8 md:pb-16">
        <Container width="standard">
          <div className="mb-8 flex items-center gap-2">
            {(["upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-full px-4 py-1.5 font-obviously text-sm transition-colors ${
                  filter === tab
                    ? "bg-red text-bone"
                    : "bg-black/5 text-black/60 hover:bg-black/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 3. Event series highlights (upcoming only) */}
          {filter === "upcoming" && seriesWithUpcoming.length > 0 && (
            <div className="divide-y divide-black/10">
              {seriesWithUpcoming.map((series) => {
                const seriesEventCount = allEvents.filter(
                  (e) =>
                    ((e as { seriesId?: string }).seriesId === series.id ||
                      (e as { series?: { id?: string } }).series === series.id ||
                      (e as { series?: { id?: string } }).series?.id === series.id ||
                      (e as { eventSeries?: string }).eventSeries === series.id) &&
                    (e.derivedStatus === "upcoming" || e.derivedStatus === "waitlist")
                ).length;
                const heroUrl =
                  (series as { heroImage?: string }).heroImage ?? series.thumbnailUrl;
                const shortDesc =
                  (series as { shortDescription?: string }).shortDescription ??
                  series.description ??
                  "";
                return (
                  <Link
                    href={`/events/series/${series.slug}`}
                    key={series.id}
                    className="group block py-6 first:pt-0"
                  >
                    {heroUrl && (
                      <div className="relative mb-4 aspect-[3/1] w-full overflow-hidden bg-black/5">
                        <Image
                          src={heroUrl}
                          alt={series.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}
                    <h2 className="font-obviously-wide text-xl font-bold transition-colors group-hover:text-red">
                      {series.name}
                    </h2>
                    {shortDesc && (
                      <div
                        className="mt-1 font-tiempos-text text-sm text-black/60 [&_p]:mb-1 [&_p:last-child]:mb-0 [&_p:first-child]:mt-0 [&_strong]:font-semibold"
                        dangerouslySetInnerHTML={{ __html: shortDesc }}
                      />
                    )}
                    <p className="mt-2 font-obviously text-xs text-red">
                      {seriesEventCount} upcoming event
                      {seriesEventCount !== 1 ? "s" : ""}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}

          {/* 4. Events list */}
          <div className={filter === "upcoming" && seriesWithUpcoming.length > 0 ? "mt-12 pt-8 border-t border-black/10" : ""}>
            {filteredEvents.length === 0 ? (
              <p className="py-12 text-center font-tiempos-text text-black/40">
                no {filter} events right now. check back soon.
              </p>
            ) : (
              <div className="divide-y divide-black/10">
                {filteredEvents.map((event) => {
                  const resolvedDate = (event as { eventDate?: Date | null }).eventDate;
                  const eventDate =
                    resolvedDate && !Number.isNaN(resolvedDate.getTime())
                      ? resolvedDate
                      : new Date(
                          (event as { date?: string }).date ??
                            (event as { startDateTime?: string }).startDateTime ??
                            event.date ??
                            ""
                        );
                  const isValid = !Number.isNaN(eventDate.getTime());
                  const day = isValid ? eventDate.getDate() : 0;
                  const month = isValid
                    ? eventDate.toLocaleDateString("en-NZ", { month: "short" })
                    : "—";
                  const year = isValid ? eventDate.getFullYear() : "—";
                  const time =
                    (event as { time?: string }).time ??
                    (isValid
                      ? eventDate.toLocaleTimeString("en-NZ", {
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "");
                  const status = event.derivedStatus;
                  const shortDesc =
                    (event as { shortDescription?: string }).shortDescription ??
                    event.description;
                  const tier = (event as { tier?: string }).tier;
                  const ticketUrl =
                    (event as { ticketUrl?: string }).ticketUrl ?? event.ticketUrl;
                  const recordingUrl = (event as { recordingUrl?: string }).recordingUrl;
                  const eventHref = ticketUrl || `/events/${event.slug}`;
                  const isExternalTicket = Boolean(ticketUrl);

                  return (
                    <div
                      key={event.id}
                      className="flex gap-6 py-6 first:pt-0"
                    >
                      <div className="w-[60px] shrink-0 text-center">
                        <p className="font-obviously-narrow text-[40px] font-black leading-none text-red">
                          {isValid ? String(day).padStart(2, "0") : "—"}
                        </p>
                        <p className="mt-1 font-obviously text-xs text-black/55">
                          {month} {year}
                        </p>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-obviously-wide text-base font-semibold">
                          {isExternalTicket ? (
                            <a
                              href={eventHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-colors hover:text-red"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(eventHref, "_blank", "noopener,noreferrer");
                              }}
                            >
                              {event.name}
                            </a>
                          ) : (
                            <Link
                              href={eventHref}
                              className="transition-colors hover:text-red"
                            >
                              {event.name}
                            </Link>
                          )}
                        </h3>
                        <p className="mt-1 font-obviously text-xs text-black/55">
                          {event.venue ?? ((event as { isOnline?: boolean }).isOnline ? "online" : "")}
                          {event.venue && time ? " · " : ""}
                          {time}
                        </p>
                        {shortDesc && (
                          <div
                            className="mt-2 line-clamp-2 font-tiempos-text text-sm text-black/60 [&_p]:mb-1 [&_p:last-child]:mb-0 [&_p:first-child]:mt-0 [&_strong]:font-semibold"
                            dangerouslySetInnerHTML={{ __html: shortDesc }}
                          />
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          {tier && (
                            <span className="rounded-full bg-black/5 px-2.5 py-0.5 font-obviously text-[10px] text-black/55">
                              {tier}
                            </span>
                          )}
                          {status && status !== "upcoming" && (
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-obviously text-[10px] font-medium ${
                                status === "sold-out"
                                  ? "bg-black/10 text-black/40"
                                  : status === "waitlist"
                                    ? "bg-red/10 text-red"
                                    : "bg-black/5 text-black/40"
                              }`}
                            >
                              {status === "sold-out" ? "sold out" : status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center">
                        {(status === "upcoming" || status === "waitlist") && (
                          <a
                            href={ticketUrl || `/events/${event.slug}`}
                            target={ticketUrl ? "_blank" : undefined}
                            rel={ticketUrl ? "noopener noreferrer" : undefined}
                            className="whitespace-nowrap rounded-full bg-red px-4 py-2 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
                            onClick={
                              ticketUrl
                                ? (e) => {
                                    e.preventDefault();
                                    window.open(ticketUrl, "_blank", "noopener,noreferrer");
                                  }
                                : undefined
                            }
                          >
                            get tickets
                          </a>
                        )}
                        {status === "sold-out" && (
                          <span className="cursor-not-allowed whitespace-nowrap rounded-full bg-black/10 px-4 py-2 font-obviously text-xs font-medium text-black/40">
                            sold out
                          </span>
                        )}
                        {status === "past" && recordingUrl && (
                          <a
                            href={recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap rounded-full border border-black/20 px-4 py-2 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(recordingUrl, "_blank", "noopener,noreferrer");
                            }}
                          >
                            watch recording
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 5. Newsletter CTA */}
      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-16 md:py-24"
      >
        <Container width="standard" className="text-center">
          <Heading level={2}>get notified about new events</Heading>
          <div className="mx-auto mt-6 flex max-w-[400px] gap-2">
            <input
              type="email"
              placeholder="your email"
              className="flex-1 rounded-full border border-black/20 bg-white px-4 py-2.5 font-tiempos-text text-sm placeholder:text-black/40 transition-colors focus:border-red focus:outline-none"
            />
            <button
              type="button"
              className="whitespace-nowrap rounded-full bg-red px-5 py-2.5 font-obviously text-sm font-medium text-bone transition-colors hover:bg-red/90"
            >
              subscribe
            </button>
          </div>
        </Container>
      </Section>
    </>
  );
}
