export const SITE_NAME = "attn:seeker";
export const SITE_URL = "https://theattentionseeker.com";
export const NEWSLETTER_NAME = "your attention please";
export const BEEHIIV_PUB_ID = "pub_abc781a5-9b9c-401f-b757-d8e4c544a87f";

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "home", href: "/" },
  { label: "agency", href: "/agency" },
  { label: "learn", href: "/learn" },
  { label: "shows", href: "/shows" },
  { label: "podcasts", href: "/podcasts" },
  { label: "events", href: "/events" },
  { label: "about", href: "/about" },
  { label: "join the seekers", href: "/join-the-seekers" },
];

export const SOCIAL_LINKS: { platform: string; url: string }[] = [
  { platform: "LinkedIn", url: "https://linkedin.com/company/theattnseeker" },
  { platform: "TikTok", url: "https://tiktok.com/@theattnseeker" },
  { platform: "Instagram", url: "https://instagram.com/theattnseeker" },
  { platform: "YouTube", url: "https://youtube.com/@theattnseeker" },
];

export const TIER_COLORS: Record<string, string> = {
  Bronze: "#CD7F32",
  Silver: "#C0C0C0",
  Gold: "#FFD700",
  Platinum: "#E5E4E2",
  Black: "#000000",
};

export const STATS = {
  followerCount: "1.4m+",
  viewCount: "1.2b views/year",
  countries: "5",
  paidAds: "0",
} as const;
