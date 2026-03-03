import type { CaseStudy } from "@/types/cms";

export const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-one-nz",
    name: "one nz",
    slug: "one-nz",
    client: "One NZ",
    industry: "Telecommunications",
    headline: "from 40k to 140k followers and a sentiment flip. no paid spend.",
    challenge:
      "One NZ came to us with a reputation problem. Social was seen as a complaint channel, not a place to build trust. They had 40k followers and low engagement. They wanted to grow organically and shift perception without leaning on paid.",
    solution:
      "We built an organic strategy around real stories: network upgrades, community initiatives, and people behind the brand. We focused on TikTok and Instagram where their audience already was. Content was honest, often unpolished, and built for conversation. Community management became a priority so every comment and DM got a real response.",
    results:
      "In 18 months we grew followers from 40k to 140k. Sentiment in comments and DMs flipped from predominantly negative to positive. Brand search and share of voice improved. All of it on organic. No paid ads.",
    stats: [
      { value: "140k", label: "followers" },
      { value: "2.5x", label: "engagement rate" },
      { value: "0", label: "paid spend" },
    ],
    testimonial: {
      quote:
        "attn:seeker didn't just grow our numbers. They helped us change how people feel about us. The team gets the balance between brand and real.",
      author: "marketing director, one nz",
      role: "Telecommunications",
    },
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=one+nz",
    featured: true,
  },
  {
    id: "case-pizza-hut",
    name: "pizza hut",
    slug: "pizza-hut",
    client: "Pizza Hut",
    industry: "QSR",
    headline: "15x follower growth in 12 months. qsr that actually gets social.",
    challenge:
      "Pizza Hut's social was underinvested. Small following, generic content, and no clear link to sales or brand love. They wanted to compete with brands that had been winning on social for years.",
    solution:
      "We created a content strategy built around occasions, product drops and local relevance. We leaned into short-form video and UGC so the feed felt fresh and real. We tied content to promotions and store-level activity so social drove footfall. Community management focused on speed and personality so replies felt human.",
    results:
      "Follower growth hit 15x in 12 months. Engagement rates beat category benchmarks. We linked social activity to store traffic and repeat visits. The brand now has a social presence that matches its ambition.",
    stats: [
      { value: "15x", label: "follower growth" },
      { value: "4.2%", label: "avg engagement rate" },
      { value: "12", label: "months" },
    ],
    testimonial: {
      quote:
        "We needed to level up fast. attn:seeker gave us a strategy we could execute and content that actually performed. No fluff.",
      author: "head of brand, pizza hut",
      role: "QSR",
    },
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=pizza+hut",
    featured: true,
  },
  {
    id: "case-hairification",
    name: "hairification",
    slug: "hairification",
    client: "Hairification",
    industry: "Beauty",
    headline: "78 million views in one month. one campaign that broke the algorithm.",
    challenge:
      "Hairification had a great product but a tiny social footprint. They needed to get in front of a massive audience fast. Budget was limited. They needed organic to do the heavy lifting.",
    solution:
      "We built a campaign around a single hook: the transformation. We paired it with a sound and format that was trending. We briefed creators, seeded the brand, and let the content run. We didn't try to control every frame. We optimized for shareability and let the algorithm do the rest.",
    results:
      "One campaign. 78 million views in a month. Followers went from 8k to 340k. Sales spiked. The brand became known for that campaign. We proved that with the right idea and the right format, organic can still break through.",
    stats: [
      { value: "78m", label: "views in one month" },
      { value: "340k", label: "followers" },
      { value: "1", label: "campaign" },
    ],
    testimonial: {
      quote:
        "We didn't believe those numbers at first. attn:seeker understood what would travel and built the whole thing around that. Game changer.",
      author: "founder, hairification",
      role: "Beauty",
    },
    thumbnailUrl: "https://placehold.co/800x450/FF0000/FAF6E7?text=hairification",
    featured: true,
  },
];
