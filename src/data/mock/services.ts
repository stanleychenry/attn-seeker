import type { Service } from "@/types/cms";

const ICON = "https://placehold.co/64x64/FF0000/FAF6E7?text=icon";

export const MOCK_SERVICES: Service[] = [
  {
    id: "service-organic-strategy",
    name: "organic social strategy",
    slug: "organic-social-strategy",
    shortDescription:
      "A strategy that earns attention instead of buying it. We build the plan, the pillars and the metrics so your organic work actually pays off.",
    body: "<p>Full service page content would live here. We'd pull from the CMS rich text.</p>",
    keyBenefits: [
      "A clear content strategy tied to business goals, not vanity metrics",
      "Content pillars and themes that your team can actually execute",
      "Measurement framework so you know what's working",
      "Roadmap for the next 6 to 12 months with clear milestones",
    ],
    process: [
      {
        step: "discovery",
        description:
          "We dig into your brand, audience, competitors and current performance. No cookie-cutter templates.",
      },
      {
        step: "strategy",
        description:
          "We define goals, content pillars, channel mix and a measurement plan. You get a document you can actually use.",
      },
      {
        step: "playbook",
        description:
          "Tactics, formats and a content calendar structure. Enough direction to move, enough flexibility to adapt.",
      },
      {
        step: "handover",
        description:
          "We present, train your team and leave you with everything you need to run it. Optional ongoing support.",
      },
    ],
    icon: ICON,
    order: 0,
  },
  {
    id: "service-content-creation",
    name: "content creation",
    slug: "content-creation",
    shortDescription:
      "We make the content. Short-form video, static, copy and concepts. All built for organic performance and your brand.",
    body: "<p>Full service page content would live here.</p>",
    keyBenefits: [
      "Content that's built for the feed, not repurposed from somewhere else",
      "Hooks and formats that actually stop the scroll",
      "Consistent quality without burning out your team",
      "From concept to publish, we handle the pipeline",
    ],
    process: [
      {
        step: "brief",
        description:
          "We align on goals, audience and brand. You share references, we share what we think will work.",
      },
      {
        step: "concept",
        description:
          "We pitch concepts and formats. You approve direction before we go to production.",
      },
      {
        step: "produce",
        description:
          "We shoot, edit and write. You get rounds of feedback at agreed checkpoints.",
      },
      {
        step: "deliver",
        description:
          "Assets ready for your channels. Optional: we publish and optimise based on performance.",
      },
    ],
    icon: ICON,
    order: 1,
  },
  {
    id: "service-community-management",
    name: "community management",
    slug: "community-management",
    shortDescription:
      "We show up in the replies, the DMs and the comments. Building real relationships so your community feels seen.",
    body: "<p>Full service page content would live here.</p>",
    keyBenefits: [
      "A voice that matches your brand and doesn't sound like a bot",
      "Faster response times and real conversations, not templates",
      "Insights from the front line fed back into strategy",
      "Crisis and sentiment handling when things get messy",
    ],
    process: [
      {
        step: "voice guide",
        description:
          "We document how you sound, what you stand for and what's off limits. So every reply feels on brand.",
      },
      {
        step: "playbooks",
        description:
          "Response frameworks for FAQs, complaints, praise and edge cases. Your team (or ours) knows what to do.",
      },
      {
        step: "daily management",
        description:
          "We monitor, reply and escalate. You get a feed of what matters and weekly summaries.",
      },
      {
        step: "reporting",
        description:
          "Volume, sentiment, themes and opportunities. So community insight feeds back into strategy.",
      },
    ],
    icon: ICON,
    order: 2,
  },
  {
    id: "service-social-media-management",
    name: "social media management",
    slug: "social-media-management",
    shortDescription:
      "Strategy, content and community in one place. We run your social so you can focus on the rest of the business.",
    body: "<p>Full service page content would live here.</p>",
    keyBenefits: [
      "One team that owns strategy, content and community",
      "No more handoffs between agencies or internal silos",
      "Consistent quality and a single point of contact",
      "Performance that ties back to business goals",
    ],
    process: [
      {
        step: "onboard",
        description:
          "We audit what you have, align on goals and set up workflows. You get a dedicated team and a clear plan.",
      },
      {
        step: "plan",
        description:
          "Content calendar, themes and key moments. We plan ahead so nothing drops through the cracks.",
      },
      {
        step: "create and publish",
        description:
          "We create, schedule and publish. You review and approve at the pace we agree.",
      },
      {
        step: "optimise",
        description:
          "We watch performance, adjust the mix and report. Monthly reviews so you always know where you stand.",
      },
    ],
    icon: ICON,
    order: 3,
  },
];
