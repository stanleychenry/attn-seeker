import type { Job } from "@/types/cms";

export const MOCK_JOBS: Job[] = [
  {
    id: "job-content-creator",
    name: "content creator",
    slug: "content-creator",
    department: "Creative",
    location: "Auckland",
    type: "Full-Time",
    description:
      "We're looking for a content creator who can turn strategy into scroll-stopping content. You'll work across short-form video, static and copy for our clients and our own channels. You need to understand hooks, retention and what actually performs. You'll work with our creative director and strategists to concept, produce and sometimes star in the content. We want someone who can move fast, take feedback and keep the bar high.",
    requirements: [
      "2+ years creating content for social (brand or agency)",
      "Strong portfolio of short-form video and static content",
      "Comfortable on camera and in front of the edit",
      "Understanding of TikTok, Reels, LinkedIn and Instagram",
      "Ability to work to tight deadlines and iterate quickly",
    ],
    niceToHave: [
      "Experience with Adobe Premiere, CapCut or similar",
      "Copywriting skills for captions and hooks",
      "Experience in a client-facing or agency environment",
    ],
    publishedDate: "2025-02-01",
    isOpen: true,
  },
  {
    id: "job-community-manager",
    name: "community manager",
    slug: "community-manager",
    department: "Community Management",
    location: "Auckland",
    type: "Full-Time",
    description:
      "We need a community manager who can hold the line between brand voice and real conversation. You'll manage comments, DMs and community spaces for our clients. You'll need to be fast, empathetic and able to escalate when it matters. You'll work with our community lead to set tone, build playbooks and report on what's happening in the trenches. We want someone who actually likes people and doesn't hide behind templates.",
    requirements: [
      "1+ years in community management or social customer service",
      "Experience with social listening and community tools",
      "Clear written communication and attention to detail",
      "Ability to stay calm under pressure and handle difficult conversations",
      "Comfortable with multiple brands and voices",
    ],
    niceToHave: [
      "Experience with Sprout, Hootsuite, or similar",
      "Crisis or sentiment management experience",
      "Experience in B2B or regulated industries",
    ],
    publishedDate: "2025-01-28",
    isOpen: true,
  },
  {
    id: "job-social-strategist",
    name: "social strategist",
    slug: "social-strategist",
    department: "Strategy",
    location: "Auckland",
    type: "Full-Time",
    description:
      "We're hiring a social strategist to own the strategy output for a mix of clients. You'll run discovery, build content strategies, define metrics and make sure every recommendation is grounded in what actually works. You'll work with our head of strategy and client leads. You need to be able to turn data and insight into clear, actionable plans. No deck theatre. We want strategies that get executed.",
    requirements: [
      "3+ years in social strategy, brand strategy or digital strategy",
      "Experience building content strategies and measurement frameworks",
      "Strong analytical skills and comfort with data",
      "Ability to present and defend recommendations to clients",
      "Experience in an agency or client-side marketing team",
    ],
    niceToHave: [
      "Experience with organic-only or low-paid social",
      "Familiarity with platform analytics and third-party tools",
      "Experience running workshops or training",
    ],
    publishedDate: "2025-01-15",
    isOpen: true,
  },
];
