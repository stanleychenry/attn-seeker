import type { Podcast, PodcastEpisode } from "@/types/cms";

export const MOCK_PODCASTS: Podcast[] = [
  {
    id: "podcast-yap",
    name: "your attention please",
    slug: "your-attention-please",
    description:
      "The YAP podcast. Weekly takes on attention, content and culture. Same voice as the newsletter, longer form. Stanley and guests on what's working, what's not, and what's next.",
    coverUrl: "https://placehold.co/1400x1400/FF0000/FAF6E7?text=yap+podcast",
    spotifyUrl: "https://open.spotify.com/show/yap",
    appleUrl: "https://podcasts.apple.com/podcast/your-attention-please",
    episodeCount: 4,
  },
  {
    id: "podcast-stansplaining",
    name: "stansplaining",
    slug: "stansplaining",
    description:
      "Stanley Henry in conversation. Restaurant setting, no script. Real talk on brand, content and why most marketing advice is noise.",
    coverUrl:
      "https://placehold.co/1400x1400/FF0000/FAF6E7?text=stansplaining",
    spotifyUrl: "https://open.spotify.com/show/stansplaining",
    appleUrl: "https://podcasts.apple.com/podcast/stansplaining",
    episodeCount: 100,
  },
];

export const MOCK_PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "pod-ep-1",
    name: "why we're done with viral",
    slug: "why-were-done-with-viral",
    podcast: MOCK_PODCASTS[0],
    description:
      "Going viral is a terrible strategy. We break down why chasing the algorithm burns teams out and what to do instead.",
    spotifyEmbedUrl: "https://open.spotify.com/embed/episode/yap1",
    publishedDate: "2025-02-12",
    duration: "42:18",
    episodeNumber: 1,
  },
  {
    id: "pod-ep-2",
    name: "the one nz playbook",
    slug: "the-one-nz-playbook",
    podcast: MOCK_PODCASTS[0],
    description:
      "How we took a telco from 40k to 140k followers with zero paid. The strategy, the content and the community moves that made it work.",
    spotifyEmbedUrl: "https://open.spotify.com/embed/episode/yap2",
    publishedDate: "2025-02-05",
    duration: "38:44",
    episodeNumber: 2,
  },
  {
    id: "pod-ep-3",
    name: "linkedin without the cringe",
    slug: "linkedin-without-the-cringe",
    podcast: MOCK_PODCASTS[0],
    description:
      "LinkedIn doesn't have to be thought leadership cosplay. How to show up, add value and still sound like a human.",
    spotifyEmbedUrl: "https://open.spotify.com/embed/episode/yap3",
    publishedDate: "2025-01-29",
    duration: "35:22",
    episodeNumber: 3,
  },
  {
    id: "pod-ep-4",
    name: "what creators get wrong about brands",
    slug: "what-creators-get-wrong-about-brands",
    podcast: MOCK_PODCASTS[0],
    description:
      "Brand partnerships from the other side. What we wish creators knew before they pitch, and what brands need to do better.",
    spotifyEmbedUrl: "https://open.spotify.com/embed/episode/yap4",
    publishedDate: "2025-01-22",
    duration: "41:05",
    episodeNumber: 4,
  },
];
