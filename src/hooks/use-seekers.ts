"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { getDashboard } from "@/lib/xano";
import type { XanoDashboard } from "@/lib/xano";
import type { SeekersUser, ActivityItem } from "@/types/seekers";

const TIER_ORDER: Array<SeekersUser["tier"]> = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "black",
];
const TIER_THRESHOLDS: Record<string, number> = {
  bronze: 0,
  silver: 250,
  gold: 750,
  platinum: 2500,
  black: 5000,
};

function tierProgress(
  tier: SeekersUser["tier"],
  statusPoints: number
): SeekersUser["tierProgress"] {
  const idx = TIER_ORDER.indexOf(tier);
  const currentThreshold = TIER_THRESHOLDS[tier] ?? 0;
  const nextTier = TIER_ORDER[idx + 1] ?? null;
  const nextThreshold = nextTier ? (TIER_THRESHOLDS[nextTier] ?? 0) : 0;
  const pointsToNext = nextTier
    ? Math.max(0, nextThreshold - statusPoints)
    : 0;
  const percentComplete =
    nextTier && nextThreshold > currentThreshold
      ? Math.min(
          100,
          Math.round(
            ((statusPoints - currentThreshold) /
              (nextThreshold - currentThreshold)) *
              100
          )
        )
      : 100;
  return {
    current: tier,
    next: nextTier,
    pointsToNext,
    percentComplete,
  };
}

function mapDashboardToSeekers(
  email: string,
  name: string,
  id: string,
  d: XanoDashboard
): SeekersUser {
  const tier = (d.tier ?? "bronze") as SeekersUser["tier"];
  const statusPoints = d.status_points_this_period ?? 0;
  const yapDollars = d.yap_dollars ?? 0;
  const currentStreak = d.current_streak ?? 0;
  return {
    id,
    name,
    email,
    tier,
    statusPoints,
    yapDollars,
    currentStreak,
    longestStreak: currentStreak,
    gamesPlayed: 0,
    articlesRead: 0,
    joinedDate: "",
    tierProgress: tierProgress(tier, statusPoints),
  };
}

function mapRecentActivity(
  recent_activity: XanoDashboard["recent_activity"]
): ActivityItem[] {
  if (!Array.isArray(recent_activity)) return [];
  return recent_activity.map((a, i) => ({
    id: `act-${i}-${a.created_at ?? ""}`,
    type: "game_complete" as const,
    description: (a.source ?? "").replace(/_/g, " "),
    pointsEarned: a.amount ?? 0,
    timestamp: a.created_at ?? new Date().toISOString(),
  }));
}

interface UseSeekersReturn {
  user: SeekersUser | null;
  activity: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSeekers(): UseSeekersReturn {
  const { user: authUser, isLoggedIn } = useAuth();
  const [user, setUser] = useState<SeekersUser | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeekers = async () => {
    if (!isLoggedIn || !authUser?.email) {
      setUser(null);
      setActivity([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboard(authUser.email);
      setUser(
        mapDashboardToSeekers(
          authUser.email,
          authUser.name,
          authUser.id,
          data
        )
      );
      setActivity(mapRecentActivity(data.recent_activity));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
      setUser(null);
      setActivity([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeekers();
  }, [isLoggedIn, authUser?.id, authUser?.email]);

  return {
    user,
    activity,
    isLoading,
    error,
    refetch: fetchSeekers,
  };
}
