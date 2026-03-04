/**
 * Seekers / loyalty programme types (Xano-backed)
 */

export type Tier = "bronze" | "silver" | "gold" | "platinum" | "black";

export interface SeekersUser {
  id: string;
  name: string;
  email: string;
  tier: Tier;
  statusPoints: number;
  yapDollars: number;
  currentStreak: number;
  longestStreak: number;
  gamesPlayed: number;
  articlesRead: number;
  joinedDate: string;
  avatarUrl?: string;
  tierProgress: {
    current: Tier;
    next: Tier | null;
    pointsToNext: number;
    percentComplete: number;
  };
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceYapDollars: number;
  category: string;
  sponsor?: string;
  quantityRemaining: number;
  featured: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  tier: Tier;
  score: number;
  time?: number;
  avatarUrl?: string;
}

export interface ActivityItem {
  id: string;
  type:
    | "game_complete"
    | "article_read"
    | "streak_bonus"
    | "store_redeem"
    | "email_open"
    | "referral";
  description: string;
  /** Raw source from Xano (e.g. "shikaku", "akari", "mastermind") for matching game type */
  source?: string;
  pointsEarned: number;
  timestamp: string;
}
