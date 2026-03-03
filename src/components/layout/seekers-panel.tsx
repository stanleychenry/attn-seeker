"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSeekers } from "@/hooks/use-seekers";
import { TIER_COLORS } from "@/lib/constants";
import type { Tier } from "@/types/seekers";
import { Button, Divider } from "@/components/ui";
import { Caption } from "@/components/ui/caption";

function tierToColor(tier: Tier): string {
  const key = tier.charAt(0).toUpperCase() + tier.slice(1);
  return TIER_COLORS[key] ?? "#000000";
}

function tierLabel(tier: Tier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function relativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export function SeekersPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { logout } = useAuth();
  const { user: seekersUser, activity } = useSeekers();

  if (!open) return null;

  const user = seekersUser;
  if (!user) return null;

  const tierColor = tierToColor(user.tier);
  const recentActivity = activity.slice(0, 3);

  return (
    <div
      className="absolute right-0 top-full z-50 mt-2 w-[320px] rounded-card border border-black/10 bg-white p-6 shadow-lg"
      role="dialog"
      aria-label="Seekers profile"
    >
      <p className="font-obviously-wide font-semibold text-[18px] lowercase text-black">
        {user.name}
      </p>
      <div className="mt-2">
        <span
          className="inline-block rounded-pill px-3 py-1 font-obviously text-[13px] lowercase text-bone"
          style={{ backgroundColor: tierColor }}
        >
          {tierLabel(user.tier)}
        </span>
      </div>

      <Divider className="my-4" />

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="font-obviously font-black text-lg text-black">
            {user.statusPoints}
          </p>
          <Caption>status points</Caption>
        </div>
        <div>
          <p className="font-obviously font-black text-lg text-black">
            {user.yapDollars}
          </p>
          <Caption>yap dollars</Caption>
        </div>
        <div>
          <p className="font-obviously font-black text-lg text-black">
            {user.currentStreak}
          </p>
          <Caption>streak</Caption>
        </div>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${user.tierProgress.percentComplete}%`,
            backgroundColor: tierColor,
          }}
        />
      </div>
      <Caption className="mt-1 block text-center">
        {user.tierProgress.percentComplete}% to next tier
      </Caption>

      <Divider className="my-4" />

      <nav className="flex flex-col gap-2 font-obviously text-[14px] lowercase">
        <Link href="/seekers/dashboard" className="text-black hover:text-red" onClick={onClose}>
          dashboard
        </Link>
        <Link href="/seekers/store" className="text-black hover:text-red" onClick={onClose}>
          rewards store
        </Link>
        <Link href="/seekers/game" className="text-black hover:text-red" onClick={onClose}>
          play today&apos;s games
        </Link>
        <Link href="/seekers/leaderboard" className="text-black hover:text-red" onClick={onClose}>
          leaderboard
        </Link>
      </nav>

      <Divider className="my-4" />

      <p className="font-obviously font-medium text-[13px] lowercase text-black/55 mb-2">
        recent activity
      </p>
      <ul className="space-y-1">
        {recentActivity.map((item) => (
          <li key={item.id}>
            <Caption className="block">
              {item.description}
              <span className="ml-1 text-black/40">{relativeTime(item.timestamp)}</span>
            </Caption>
          </li>
        ))}
      </ul>

      <Divider className="my-4" />

      <Button
        variant="ghost"
        size="small"
        className="w-full"
        onClick={() => {
          logout();
          onClose();
        }}
      >
        log out
      </Button>
    </div>
  );
}
