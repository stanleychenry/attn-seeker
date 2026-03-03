import { getEvents, getEventSeries } from "@/lib/cms";
import { EventsPageClient } from "./events-page-client";

export const metadata = {
  title: "events | attn:seeker",
  description: "workshops, talks, and gatherings for people who want to learn.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: Awaited<ReturnType<typeof getEvents>> = [];
  let eventSeriesList: Awaited<ReturnType<typeof getEventSeries>> = [];
  let fetchError: string | null = null;
  try {
    [events, eventSeriesList] = await Promise.all([
      getEvents(),
      getEventSeries(),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load events";
    fetchError = message;
    console.error("Failed to fetch events:", error);
  }
  return (
    <EventsPageClient
      events={events}
      eventSeriesList={eventSeriesList}
      fetchError={fetchError}
    />
  );
}
