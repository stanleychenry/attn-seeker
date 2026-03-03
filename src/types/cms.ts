/**
 * CMS collection types aligned with docs/cms-structure.md
 */

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  isPillar: boolean;
  parentTopic?: Topic | string;
  articleCount?: number;
  icon?: string;
  metaTitle?: string;
  metaDescription?: string;
  shortDescription?: string;
  featuredImage?: string;
  sortOrder?: number;
  editorsPicks?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedIn?: string;
  isFounder: boolean;
  order: number;
}

/** Webflow CMS team entity (flat refs, image URLs) */
export interface Team {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio?: string;
  headshot: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  sortOrder: number;
  featured: boolean;
}

export interface YAPArticle {
  id: string;
  name: string;
  slug: string;
  publishedDate: string;
  summary: string;
  body: string;
  primaryTopic: Topic | string;
  secondaryTopics: Topic[] | string[];
  audience: string;
  funnelStage: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  readingTime: number;
  featured: boolean;
  editorsChoice: boolean;
  author?: TeamMember | string;
  thumbnailUrl?: string;
  lastUpdated?: string;
  ogTitle?: string;
  ogDescription?: string;
  /** CMS fields */
  coverImage?: string;
  category?: string;
  contentType?: string;
  metaTitle?: string;
  metaDescription?: string;
  originalUrl?: string;
  publishDate?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  body: string;
  keyBenefits: string[] | string;
  process: { step: string; description: string }[] | string;
  icon?: string;
  order: number;
  headline?: string;
  description?: string;
  coverImage?: string;
  featured?: boolean;
  sortOrder?: number;
}

export interface CaseStudy {
  id: string;
  name: string;
  slug: string;
  client: string;
  industry: string;
  headline: string;
  challenge: string;
  solution: string;
  results: string;
  stats: { value: string; label: string }[];
  testimonial?: { quote: string; author: string; role: string };
  thumbnailUrl: string;
  featured: boolean;
  /** CMS: image URL */
  clientLogo?: string;
  coverImage?: string;
  challengeImage?: string;
  solutionImage?: string;
  resultsImage?: string;
  keyStat?: string;
  keyStatLabel?: string;
  testimonialAuthor?: string;
  featuredOrder?: number;
  region?: string;
}

export interface Show {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  platform: string;
  platformUrl: string;
  episodeCount: number;
  featured: boolean;
  poster?: string;
  shortDescription?: string;
  youtubePlaylistId?: string;
  category?: string;
  status?: string;
  playlistUrl?: string;
  subscribeUrl?: string;
}

export interface ShowEpisode {
  id: string;
  name: string;
  slug: string;
  show: Show | string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  publishedDate: string;
  duration: string;
  episodeNumber: number;
  transcript?: string;
  shortDescription?: string;
  youtubeVideoId?: string;
  publishDate?: string;
  thumbnail?: string;
  featured?: boolean;
}

export interface Podcast {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  spotifyUrl: string;
  appleUrl?: string;
  episodeCount: number;
  coverImage?: string;
  shortDescription?: string;
  spotifyLink?: string;
  spotifyShowId?: string;
  category?: string;
  status?: string;
  featured?: boolean;
}

export interface PodcastEpisode {
  id: string;
  name: string;
  slug: string;
  podcast: Podcast | string;
  description: string;
  spotifyEmbedUrl: string;
  publishedDate: string;
  duration: string;
  episodeNumber: number;
  transcript?: string;
  publishDate?: string;
  spotifyEmbed?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  featured?: boolean;
}

export interface EventSeries {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  eventCount: number;
  shortDescription?: string;
  heroImage?: string;
  bodyText?: string;
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  venue: string;
  ticketUrl: string;
  thumbnailUrl: string;
  series?: EventSeries;
  isPast: boolean;
  speakers: TeamMember[];
  shortDescription?: string;
  recordingUrl?: string;
  time?: string;
  tier?: string;
  status?: string;
  confirmationEmail?: string;
  eventSeries?: string;
  eventTier?: string;
  startDateTime?: string;
  endDateTime?: string;
  timezoneLabel?: string;
  addressMap?: string;
  heroImage?: string;
  shortSummary?: string;
  eventDescription?: string;
  scheduleAgenda?: string;
  speakersHosts?: string[];
  capacity?: number;
  ticketsRemaining?: number;
  showOnListings?: boolean;
  isOnline?: boolean;
  priceDisplay?: string;
  humanitixEventId?: string;
  humanitixTicketUrl?: string;
}

export interface Book {
  id: string;
  name: string;
  slug: string;
  author: string;
  description: string;
  coverUrl: string;
  buyUrl: string;
  recommendedBy: TeamMember;
  excerpt?: string;
  subtitle?: string;
  status?: string;
  coverImage?: string;
  releaseDate?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
  pressKitUrl?: string;
  authors?: string[];
  publisher?: string;
  isbn?: string;
}

export interface Job {
  id: string;
  name: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[] | string;
  niceToHave: string[];
  publishedDate: string;
  isOpen: boolean;
  customQuestion1?: string;
  customQuestion2?: string;
  customQuestion3?: string;
  customQuestion4?: string;
  customQuestion5?: string;
  employmentType?: string;
  applyLink?: string;
  closingDate?: string;
  open?: boolean;
}
