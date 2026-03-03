import Link from "next/link";
import Image from "next/image";
import {
  getEventSeriesBySlug,
  getEventsBySeries,
} from "@/lib/cms";
import { notFound } from "next/navigation";
import { Heading, Section, Container } from "@/components/ui";

type PageParams = { params: { slug: string } };

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const series = await getEventSeriesBySlug(params.slug);
    if (!series) return { title: "series not found | attn:seeker" };
    const shortDesc =
      (series as { shortDescription?: string }).shortDescription ??
      series.description ??
      "";
    return {
      title: `${series.name} | events | attn:seeker`,
      description: shortDesc,
    };
  } catch {
    return { title: "series not found | attn:seeker" };
  }
}

export default async function EventSeriesPage({ params }: PageParams) {
  let series: Awaited<ReturnType<typeof getEventSeriesBySlug>> = null;
  let seriesEvents: Awaited<ReturnType<typeof getEventsBySeries>> = [];
  try {
    series = await getEventSeriesBySlug(params.slug);
    if (!series) notFound();
    seriesEvents = await getEventsBySeries(series.id);
  } catch (error) {
    console.error("Failed to fetch event series:", error);
    notFound();
  }

  const now = new Date();
  const withStatus = seriesEvents.map((e) => {
    const eventDate = new Date(
      (e as { date?: string }).date ??
        (e as { startDate?: string }).startDate ??
        e.date
    );
    const derivedStatus =
      (e as { status?: string }).status ??
      (eventDate > now ? "upcoming" : "past");
    return { ...e, derivedStatus };
  });
  const sorted = withStatus.sort((a, b) => {
    const aUpcoming =
      a.derivedStatus === "upcoming" || a.derivedStatus === "waitlist";
    const bUpcoming =
      b.derivedStatus === "upcoming" || b.derivedStatus === "waitlist";
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;
    const dateA = new Date(
      (a as { date?: string }).date ??
        (a as { startDate?: string }).startDate ??
        a.date
    ).getTime();
    const dateB = new Date(
      (b as { date?: string }).date ??
        (b as { startDate?: string }).startDate ??
        b.date
    ).getTime();
    if (aUpcoming) return dateA - dateB;
    return dateB - dateA;
  });

  const heroUrl =
    (series as { heroImage?: string }).heroImage ?? series.thumbnailUrl;
  const shortDesc =
    (series as { shortDescription?: string }).shortDescription ??
    series.description;
  const bodyContent =
    (series as { body?: string }).body ??
    (series as { description?: string }).description ??
    series.description;
  const bodyIsHtml =
    typeof bodyContent === "string" && bodyContent?.includes("<");

  return (
    <>
      {/* 1. Series header */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          {heroUrl && (
            <div className="relative mb-8 aspect-[3/1] w-full overflow-hidden bg-black/5">
              <Image
                src={heroUrl}
                alt={series.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <Link
            href="/events"
            className="font-obviously text-xs uppercase tracking-wider text-red transition-colors hover:text-red/80"
          >
            ← events
          </Link>
          <Heading level={1} className="mt-4">
            {series.name}
          </Heading>
          {shortDesc && (
            <p className="mt-3 max-w-[600px] font-tiempos-text text-lg text-black/70">
              {shortDesc}
            </p>
          )}
          {bodyContent &&
            (bodyIsHtml ? (
              <div
                className="prose prose-sm mt-6 max-w-none font-tiempos-text prose-headings:font-obviously-wide prose-headings:font-semibold prose-a:text-red prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-red prose-blockquote:font-tiempos-headline prose-blockquote:not-italic prose-li:marker:text-red"
                dangerouslySetInnerHTML={{ __html: bodyContent }}
              />
            ) : (
              <p className="mt-6 font-tiempos-text text-base leading-relaxed text-black/80">
                {bodyContent}
              </p>
            ))}
        </Container>
      </Section>

      {/* 2. Events in this series */}
      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-8 md:py-16"
      >
        <Container width="standard">
          <p className="mb-6 font-obviously text-xs uppercase tracking-wider text-red">
            {seriesEvents.length} event{seriesEvents.length !== 1 ? "s" : ""}
          </p>
          {sorted.length === 0 ? (
            <p className="py-12 text-center font-tiempos-text text-black/40">
              no events in this series yet.
            </p>
          ) : (
            <div className="divide-y divide-black/10">
              {sorted.map((event) => {
                const eventDate = new Date(
                  (event as { date?: string }).date ??
                    (event as { startDate?: string }).startDate ??
                    event.date
                );
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString("en-NZ", {
                  month: "short",
                });
                const year = eventDate.getFullYear();
                const time =
                  (event as { time?: string }).time ??
                  eventDate.toLocaleTimeString("en-NZ", {
                    hour: "numeric",
                    minute: "2-digit",
                  });
                const status = event.derivedStatus;
                const ticketUrl =
                  (event as { ticketUrl?: string }).ticketUrl ?? event.ticketUrl;
                const recordingUrl =
                  (event as { recordingUrl?: string }).recordingUrl;

                return (
                  <div
                    key={event.id}
                    className="flex gap-6 py-6 first:pt-0"
                  >
                    <div className="w-[60px] shrink-0 text-center">
                      <p className="font-obviously-narrow text-[40px] font-black leading-none text-red">
                        {String(day).padStart(2, "0")}
                      </p>
                      <p className="mt-1 font-obviously text-xs text-black/55">
                        {month} {year}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-obviously-wide text-base font-semibold">
                        {ticketUrl ? (
                          <a
                            href={ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-red"
                          >
                            {event.name}
                          </a>
                        ) : (
                          <Link
                            href={`/events/${event.slug}`}
                            className="transition-colors hover:text-red"
                          >
                            {event.name}
                          </Link>
                        )}
                      </h3>
                      <p className="mt-1 font-obviously text-xs text-black/55">
                        {(event as { venue?: string }).venue ??
                          event.venue ??
                          ((event as { isOnline?: boolean }).isOnline
                            ? "online"
                            : "")}
                        {((event as { venue?: string }).venue ?? event.venue) &&
                        time
                          ? " · "
                          : ""}
                        {time}
                      </p>
                      {(event as { shortDescription?: string })
                        .shortDescription && (
                        <p className="mt-2 line-clamp-2 font-tiempos-text text-sm text-black/60">
                          {
                            (event as { shortDescription?: string })
                              .shortDescription
                          }
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        {(event as { tier?: string }).tier && (
                          <span className="rounded-full bg-black/5 px-2.5 py-0.5 font-obviously text-[10px] text-black/55">
                            {(event as { tier?: string }).tier}
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
                      {(status === "upcoming" || status === "waitlist") &&
                        (ticketUrl ? (
                          <a
                            href={ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap rounded-full bg-red px-4 py-2 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
                          >
                            get tickets
                          </a>
                        ) : (
                          <Link
                            href={`/events/${event.slug}`}
                            className="whitespace-nowrap rounded-full bg-red px-4 py-2 font-obviously text-xs font-medium text-bone transition-colors hover:bg-red/90"
                          >
                            get tickets
                          </Link>
                        ))}
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
        </Container>
      </Section>
    </>
  );
}
