import type { Event, EventSeries } from "@/types/cms";
import { MOCK_TEAM } from "./team";

export const MOCK_EVENT_SERIES: EventSeries[] = [
  {
    id: "series-attention-live",
    name: "attention live",
    slug: "attention-live",
    description:
      "Our flagship conference. A day of keynotes, workshops and real talk on attention, content and community. For brands and creators who want to do it right.",
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=attention+live",
    eventCount: 2,
  },
  {
    id: "series-creator-club",
    name: "creator club",
    slug: "creator-club",
    description:
      "Monthly meetups for creators and community builders. Informal, practical, no sales pitch. Just people who care about the craft.",
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=creator+club",
    eventCount: 2,
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "event-live-2025",
    name: "attention live 2025",
    slug: "attention-live-2025",
    description:
      "A full day on the future of attention. Keynotes from brands and creators who've done it. Workshops on strategy, content and community. No corporate vibes.",
    shortDescription:
      "A full day on the future of attention. Keynotes, workshops, no corporate vibes.",
    date: "2025-06-12",
    endDate: "2025-06-12",
    location: "Auckland",
    venue: "The Civic",
    ticketUrl: "https://humanitix.com/attention-live-2025",
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=attention+live+2025",
    series: MOCK_EVENT_SERIES[0],
    isPast: false,
    speakers: [MOCK_TEAM[0], MOCK_TEAM[1], MOCK_TEAM[2]],
  },
  {
    id: "event-live-2024",
    name: "attention live 2024",
    slug: "attention-live-2024",
    description:
      "Our first attention live. We ran it in November 2024. Sold out. The feedback was clear: more of this.",
    shortDescription: "Our first attention live. Sold out. More of this.",
    date: "2024-11-08",
    endDate: "2024-11-08",
    location: "Auckland",
    venue: "Shed 10",
    ticketUrl: "",
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=attention+live+2024",
    series: MOCK_EVENT_SERIES[0],
    isPast: true,
    speakers: [MOCK_TEAM[0], MOCK_TEAM[1]],
    recordingUrl: "https://youtube.com/playlist?list=attention-live-2024",
  },
  {
    id: "event-creator-club-feb",
    name: "creator club february",
    slug: "creator-club-february",
    description:
      "February meetup. Topic: what we learned from 100 podcast episodes. Bring your questions and your drinks.",
    shortDescription: "February meetup. What we learned from 100 podcast episodes.",
    date: "2025-02-20",
    endDate: "2025-02-20",
    location: "Auckland",
    venue: "The back room, Ponsonby",
    ticketUrl: "https://humanitix.com/creator-club-feb",
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=creator+club",
    series: MOCK_EVENT_SERIES[1],
    isPast: true,
    speakers: [MOCK_TEAM[0], MOCK_TEAM[4]],
  },
  {
    id: "event-workshop-april",
    name: "content workshop april",
    slug: "content-workshop-april",
    description:
      "Hands-on workshop on content strategy and production. Bring your brand or side project. We'll work through it together.",
    shortDescription: "Hands-on workshop on content strategy and production.",
    date: "2025-04-15",
    endDate: "2025-04-15",
    location: "Auckland",
    venue: "attn:seeker studio",
    ticketUrl: "https://humanitix.com/content-workshop-april",
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=content+workshop",
    series: MOCK_EVENT_SERIES[1],
    isPast: false,
    speakers: [MOCK_TEAM[0]],
    tier: "paid",
  },
];
