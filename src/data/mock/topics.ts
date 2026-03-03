import type { Topic } from "@/types/cms";

const pillars: Topic[] = [
  {
    id: "topic-social-media-strategy",
    name: "social media strategy",
    slug: "social-media-strategy",
    description:
      "How to plan, execute and measure organic social so it actually moves the needle. No fluff, no vanity metrics. Strategy that earns attention and converts.",
    isPillar: true,
    articleCount: 24,
  },
  {
    id: "topic-content-creation",
    name: "content creation",
    slug: "content-creation",
    description:
      "The craft of making content that stops the scroll and holds attention. Hooks, formats, and creative systems that work across platforms without burning out your team.",
    isPillar: true,
    articleCount: 18,
  },
  {
    id: "topic-community-building",
    name: "community building",
    slug: "community-building",
    description:
      "Turning followers into a community that shows up, engages and advocates. Tactics for retention, UGC, and building a brand people actually care about.",
    isPillar: true,
    articleCount: 14,
  },
  {
    id: "topic-platform-growth",
    name: "platform growth",
    slug: "platform-growth",
    description:
      "Growing followers and reach the right way. Algorithm basics, content mix, and growth loops that don't rely on paid. What works on TikTok, Instagram, LinkedIn and beyond.",
    isPillar: true,
    articleCount: 20,
  },
  {
    id: "topic-brand-storytelling",
    name: "brand storytelling",
    slug: "brand-storytelling",
    description:
      "Finding and telling your brand story so it lands. Voice, narrative and consistency across every touchpoint. Storytelling that builds trust and recall.",
    isPillar: true,
    articleCount: 12,
  },
  {
    id: "topic-creator-economy",
    name: "creator economy",
    slug: "creator-economy",
    description:
      "How brands and creators work together in 2025. Influencer strategy, creator partnerships, and building in public. The rules have changed.",
    isPillar: true,
    articleCount: 10,
  },
];

const subTopics: Topic[] = [
  {
    id: "topic-organic-strategy",
    name: "organic strategy",
    slug: "organic-strategy",
    description:
      "Building a social strategy that doesn't depend on ad spend. Goals, content pillars, and measurement that prove organic works.",
    isPillar: false,
    parentTopic: pillars[0],
    articleCount: 8,
  },
  {
    id: "topic-content-calendars",
    name: "content calendars",
    slug: "content-calendars",
    description:
      "Planning content without killing creativity. Systems for ideation, batching and staying consistent across channels.",
    isPillar: false,
    parentTopic: pillars[0],
    articleCount: 6,
  },
  {
    id: "topic-short-form-video",
    name: "short-form video",
    slug: "short-form-video",
    description:
      "TikTok, Reels and Shorts. What makes a hook work, how to structure for retention, and when to go viral vs evergreen.",
    isPillar: false,
    parentTopic: pillars[1],
    articleCount: 10,
  },
  {
    id: "topic-copywriting",
    name: "copywriting",
    slug: "copywriting",
    description:
      "Words that convert. Captions, CTAs and hooks that get people to stop, read and act. No corporate jargon.",
    isPillar: false,
    parentTopic: pillars[1],
    articleCount: 8,
  },
  {
    id: "topic-engagement-tactics",
    name: "engagement tactics",
    slug: "engagement-tactics",
    description:
      "Turning comments and DMs into relationships. How to show up in the replies, build trust and turn engagement into community.",
    isPillar: false,
    parentTopic: pillars[2],
    articleCount: 6,
  },
  {
    id: "topic-ugc",
    name: "ugc and creator content",
    slug: "ugc",
    description:
      "User-generated and creator content that scales. Briefing creators, rights, and weaving community content into your feed.",
    isPillar: false,
    parentTopic: pillars[2],
    articleCount: 8,
  },
  {
    id: "topic-algorithm",
    name: "algorithm and reach",
    slug: "algorithm-reach",
    description:
      "How the feeds actually work. What gets shown, what gets buried, and how to play the game without gaming the system.",
    isPillar: false,
    parentTopic: pillars[3],
    articleCount: 12,
  },
  {
    id: "topic-follower-growth",
    name: "follower growth",
    slug: "follower-growth",
    description:
      "Growing followers without buying them. Content that attracts the right people and growth tactics that stick.",
    isPillar: false,
    parentTopic: pillars[3],
    articleCount: 8,
  },
  {
    id: "topic-brand-voice",
    name: "brand voice",
    slug: "brand-voice",
    description:
      "Finding and keeping a consistent voice. Tone, vocabulary and the line between brand and bland.",
    isPillar: false,
    parentTopic: pillars[4],
    articleCount: 6,
  },
  {
    id: "topic-storytelling-formats",
    name: "storytelling formats",
    slug: "storytelling-formats",
    description:
      "Stories, carousels, long-form. Picking the right format for the message and the platform.",
    isPillar: false,
    parentTopic: pillars[4],
    articleCount: 6,
  },
  {
    id: "topic-influencer-partnerships",
    name: "influencer partnerships",
    slug: "influencer-partnerships",
    description:
      "Working with creators who actually move the needle. Briefing, contracts and measuring what matters.",
    isPillar: false,
    parentTopic: pillars[5],
    articleCount: 5,
  },
  {
    id: "topic-building-in-public",
    name: "building in public",
    slug: "building-in-public",
    description:
      "How founders and brands use content to build in public. Transparency, consistency and the audience that grows with you.",
    isPillar: false,
    parentTopic: pillars[5],
    articleCount: 5,
  },
];

export const MOCK_TOPICS: Topic[] = [...pillars, ...subTopics];
