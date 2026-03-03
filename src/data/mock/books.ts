import type { Book } from "@/types/cms";
import { MOCK_TEAM } from "./team";

export const MOCK_BOOKS: Book[] = [
  {
    id: "book-contagious",
    name: "contagious",
    slug: "contagious",
    author: "Jonah Berger",
    description:
      "Why things catch on. Berger breaks down the six principles that make ideas and products go viral. Required reading for anyone who wants to understand why some content spreads and some dies.",
    coverUrl: "https://placehold.co/400x600/FF0000/FAF6E7?text=contagious",
    buyUrl: "https://www.jonahberger.com/contagious",
    recommendedBy: MOCK_TEAM[0],
    excerpt:
      "Word of mouth is more effective than advertising. But why do some things get talked about and others don't? Contagious uncovers the science behind social transmission.",
  },
  {
    id: "book-storybrand",
    name: "building a storybrand",
    slug: "building-a-storybrand",
    author: "Donald Miller",
    description:
      "Clarify your message so customers listen. Miller's framework turns your brand into a story where the customer is the hero. We use it with clients to fix muddy positioning and weak messaging.",
    coverUrl: "https://placehold.co/400x600/FF0000/FAF6E7?text=storybrand",
    buyUrl: "https://storybrand.com",
    recommendedBy: MOCK_TEAM[1],
    excerpt:
      "If you confuse, you lose. Building a StoryBrand is a system for making your message clear, compelling and customer-centric. No fluff.",
  },
];
