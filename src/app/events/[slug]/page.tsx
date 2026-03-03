import Link from "next/link";
import Image from "next/image";
import {
  getEventBySlug,
  getUpcomingEvents,
  getEventSeries,
  getTeamById,
} from "@/lib/cms";
import type { EventSeries as EventSeriesType, Team } from "@/types/cms";
import { notFound } from "next/navigation";
import { Heading, Section, Container, Caption } from "@/components/ui";

type PageParams = { params: { slug: string } };

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const event = await getEventBySlug(params.slug);
    if (!event) return { title: "event not found | attn:seeker" };
    const shortDesc =
      (event as { shortDescription?: string }).shortDescription ??
      event.description ??
      "";
    return {
      title: `${event.name} | attn:seeker`,
      description: shortDesc,
    };
  } catch {
    return { title: "event not found | attn:seeker" };
  }
}

export default async function EventDetailPage({ params }: PageParams) {
  let event: Awaited<ReturnType<typeof getEventBySlug>> = null;
  let series: EventSeriesType | null = null;
  let speakers: (Team | null)[] = [];
  let otherEvents: Awaited<ReturnType<typeof getUpcomingEvents>> = [];
  try {
    event = await getEventBySlug(params.slug);
    if (!event) notFound();
    const seriesId = (event as { eventSeries?: string }).eventSeries;
    const speakerIds = (event as { speakersHosts?: string[] }).speakersHosts ?? [];
    const [allSeries, resolvedSpeakers, upcoming] = await Promise.all([
      getEventSeries(),
      speakerIds.length > 0
        ? Promise.all(speakerIds.map((id) => getTeamById(id)))
        : Promise.resolve([]),
      getUpcomingEvents(),
    ]);
    series = seriesId
      ? allSeries.find((s) => s.id === seriesId) ?? null
      : null;
    speakers = resolvedSpeakers;
    otherEvents = upcoming
      .filter((e) => e.slug !== event!.slug)
      .slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    notFound();
  }

  const eventDate = new Date(
    (event as { date?: string }).date ??
      (event as { startDate?: string }).startDate ??
      event.date
  );
  const now = new Date();
  const status =
    (event as { status?: string }).status ??
    (eventDate > now ? "upcoming" : "past");

  const heroUrl =
    (event as { heroImage?: string }).heroImage ?? event.thumbnailUrl;
  const ticketUrl =
    (event as { ticketUrl?: string }).ticketUrl ?? event.ticketUrl;
  const priceDisplay = (event as { priceDisplay?: string }).priceDisplay;
  const recordingUrl = (event as { recordingUrl?: string }).recordingUrl;
  const description =
    (event as { description?: string }).description ??
    (event as { body?: string }).body;
  const descriptionIsHtml =
    typeof description === "string" && description?.includes("<");
  const schedule =
    (event as { schedule?: string }).schedule ??
    (event as { agenda?: string }).agenda;
  const scheduleIsHtml =
    typeof schedule === "string" && schedule?.includes("<");
  const gallery = (event as { gallery?: string[] }).gallery;
  const hasGallery = Array.isArray(gallery) && gallery.length > 0;

  const speakerList = speakers.filter((s): s is Team => s != null);

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          {heroUrl && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden bg-black/5">
              <Image
                src={heroUrl}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-2">
            {status && (
              <span
                className={`rounded-full px-3 py-1 font-obviously text-xs font-medium ${
                  status === "upcoming"
                    ? "bg-red text-bone"
                    : status === "waitlist"
                      ? "bg-red/10 text-red"
                      : status === "sold-out"
                        ? "bg-black/10 text-black/40"
                        : "bg-black/5 text-black/40"
                }`}
              >
                {status === "sold-out" ? "sold out" : status}
              </span>
            )}
            {(event as { tier?: string }).tier && (
              <span className="rounded-full bg-black/5 px-3 py-1 font-obviously text-xs text-black/55">
                {(event as { tier?: string }).tier}
              </span>
            )}
          </div>
          <Heading level={1}>{event.name}</Heading>
          <p className="mt-3 font-obviously text-base font-medium text-black">
            {eventDate.toLocaleDateString("en-NZ", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {(event as { time?: string }).time
              ? ` · ${(event as { time?: string }).time}`
              : ""}
            {(event as { timezone?: string }).timezone
              ? ` ${(event as { timezone?: string }).timezone}`
              : ""}
          </p>
          <p className="mt-2 font-obviously text-sm text-black/55">
            {(event as { isOnline?: boolean }).isOnline
              ? "online"
              : `${(event as { venue?: string }).venue ?? event.venue ?? ""}${(event as { venue?: string }).venue || event.venue
                  ? (event as { location?: string }).location ?? event.location
                    ? ", "
                    : ""
                  : ""}${(event as { location?: string }).location ?? event.location ?? ""}`}
          </p>
          {(event as { addressMap?: string }).addressMap &&
            !(event as { isOnline?: boolean }).isOnline && (
              <a
                href={(event as { addressMap?: string }).addressMap}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-obviously text-xs text-red transition-colors hover:text-red/80"
              >
                view on map →
              </a>
            )}
        </Container>
      </Section>

      {/* 2. Event info */}
      <Section background="bone" padding="none" className="py-8 md:py-16">
        <Container width="content">
          <div className="mb-8">
            {(status === "upcoming" || status === "waitlist") && (
              <a
                href={ticketUrl ?? "#"}
                target={ticketUrl ? "_blank" : undefined}
                rel={ticketUrl ? "noopener noreferrer" : undefined}
                className="inline-block rounded-full bg-red px-6 py-3 font-obviously text-sm font-medium text-bone transition-colors hover:bg-red/90"
              >
                get tickets{priceDisplay ? ` · ${priceDisplay}` : ""}
              </a>
            )}
            {status === "sold-out" && (
              <span className="inline-block cursor-not-allowed rounded-full bg-black/10 px-6 py-3 font-obviously text-sm font-medium text-black/40">
                sold out
              </span>
            )}
            {status === "past" && recordingUrl && (
              <a
                href={recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-black/20 px-6 py-3 font-obviously text-sm font-medium text-black/60 transition-colors hover:border-black/40"
              >
                watch recording
              </a>
            )}
          </div>
          {description &&
            (descriptionIsHtml ? (
              <div
                className="prose prose-sm max-w-none font-tiempos-text prose-headings:font-obviously-wide prose-headings:font-semibold prose-a:text-red prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-red prose-blockquote:font-tiempos-headline prose-blockquote:not-italic prose-li:marker:text-red"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="font-tiempos-text text-base leading-relaxed text-black/80">
                {description}
              </p>
            ))}
        </Container>
      </Section>

      {/* 3. Schedule/agenda */}
      {schedule && (
        <Section
          background="bone"
          padding="none"
          className="border-t border-black/10 py-8"
        >
          <Container width="content">
            <Heading level={2} className="mb-4">
              schedule
            </Heading>
            {scheduleIsHtml ? (
              <div
                className="prose prose-sm max-w-none font-tiempos-text prose-headings:font-obviously-wide prose-headings:font-semibold prose-a:text-red prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-red prose-blockquote:font-tiempos-headline prose-blockquote:not-italic prose-li:marker:text-red"
                dangerouslySetInnerHTML={{ __html: schedule }}
              />
            ) : (
              <p className="font-tiempos-text text-base leading-relaxed text-black/80">
                {schedule}
              </p>
            )}
          </Container>
        </Section>
      )}

      {/* 4. Speakers/hosts */}
      {speakerList.length > 0 && (
        <Section
          background="bone"
          padding="none"
          className="border-t border-black/10 py-8 md:py-16"
        >
          <Container width="content">
            <Caption className="mb-4 block text-red">speakers</Caption>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {speakerList.map((speaker) => (
                <Link
                  key={speaker.id}
                  href={`/agency/team/${speaker.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                    {(speaker as { photoUrl?: string }).photoUrl && (
                      <Image
                        src={(speaker as { photoUrl?: string }).photoUrl ?? ""}
                        alt={(speaker as { name?: string }).name ?? speaker.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <h3 className="mt-2 font-obviously-wide text-sm font-semibold transition-colors group-hover:text-red">
                    {(speaker as { name?: string }).name ?? speaker.name}
                  </h3>
                  <p className="font-obviously text-xs text-black/55">
                    {(speaker as { role?: string }).role ?? speaker.role}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 5. Gallery */}
      {hasGallery && gallery && (
        <Section
          background="bone"
          padding="none"
          className="border-t border-black/10 py-8 md:py-16"
        >
          <Container width="standard">
            <Caption className="mb-4 block text-red">gallery</Caption>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {gallery.map((img: string, i: number) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden bg-black/5"
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 6. Series link */}
      {series && (
        <Section
          background="bone"
          padding="none"
          className="border-t border-black/10 py-8"
        >
          <Container width="content">
            <p className="font-tiempos-text text-sm text-black/60">
              part of{" "}
              <Link
                href={`/events/series/${series.slug}`}
                className="text-red transition-colors hover:text-red/80"
              >
                {series.name}
              </Link>
            </p>
            <Link
              href={`/events/series/${series.slug}`}
              className="mt-3 inline-block rounded-full border border-black/20 px-4 py-2 font-obviously text-xs font-medium text-black/60 transition-colors hover:border-black/40"
            >
              see all events in this series
            </Link>
          </Container>
        </Section>
      )}

      {/* 7. Other events */}
      {otherEvents.length > 0 && (
        <Section
          background="bone"
          padding="none"
          className="border-t border-black/10 py-8 md:py-16"
        >
          <Container width="standard">
            <Heading level={2} className="mb-6">
              more events
            </Heading>
            <div className="divide-y divide-black/10">
              {otherEvents.map((e) => {
                const eDate = new Date(
                  (e as { date?: string }).date ??
                    (e as { startDate?: string }).startDate ??
                    e.date
                );
                const eStatus =
                  (e as { status?: string }).status ??
                  (eDate > now ? "upcoming" : "past");
                const eTicketUrl =
                  (e as { ticketUrl?: string }).ticketUrl ?? e.ticketUrl;
                const eTime = (e as { time?: string }).time;
                return (
                  <div
                    key={e.id}
                    className="flex gap-6 py-6 first:pt-0"
                  >
                    <div className="w-[60px] shrink-0 text-center">
                      <p className="font-obviously-narrow text-[40px] font-black leading-none text-red">
                        {String(eDate.getDate()).padStart(2, "0")}
                      </p>
                      <p className="mt-1 font-obviously text-xs text-black/55">
                        {eDate.toLocaleDateString("en-NZ", { month: "short" })}{" "}
                        {eDate.getFullYear()}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-obviously-wide text-base font-semibold">
                        {eTicketUrl ? (
                          <a
                            href={eTicketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-red"
                          >
                            {e.name}
                          </a>
                        ) : (
                          <Link
                            href={`/events/${e.slug}`}
                            className="transition-colors hover:text-red"
                          >
                            {e.name}
                          </Link>
                        )}
                      </h3>
                      <p className="mt-1 font-obviously text-xs text-black/55">
                        {(e as { venue?: string }).venue ?? e.venue ?? ""}
                        {(e as { venue?: string }).venue ?? e.venue
                          ? eTime
                            ? " · "
                            : ""
                          : ""}
                        {eTime ?? ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center">
                      {(eStatus === "upcoming" || eStatus === "waitlist") &&
                        (eTicketUrl ? (
                          <a
                            href={eTicketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap rounded-full bg-red px-4 py-2 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
                          >
                            get tickets
                          </a>
                        ) : (
                          <Link
                            href={`/events/${e.slug}`}
                            className="whitespace-nowrap rounded-full bg-red px-4 py-2 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
                          >
                            get tickets
                          </Link>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
