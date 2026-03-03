"use client";

import { useRef, useEffect, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSeekers } from "@/hooks/use-seekers";
import { TIER_COLORS } from "@/lib/constants";
import type { Tier } from "@/types/seekers";
import { LoginDialog } from "./login-dialog";
import { SeekersPanel } from "./seekers-panel";

function tierToColor(tier: Tier): string {
  const key = tier.charAt(0).toUpperCase() + tier.slice(1);
  return TIER_COLORS[key] ?? "#000000";
}

export function ProfileCircle({
  variant = "dark",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const { user, isLoggedIn } = useAuth();
  const { user: seekersUser } = useSeekers();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const isLight = variant === "light";
  const borderClass = isLight ? "border-bone" : "border-black/30";
  const iconClass = isLight ? "text-bone" : "text-black/50";

  if (isLoggedIn && (user ?? seekersUser)) {
    const displayUser = seekersUser ?? {
      name: user!.name,
      tier: "bronze" as Tier,
    };
    const initial = (displayUser.name ?? "?").charAt(0).toUpperCase();
    const bgColor = tierToColor(displayUser.tier);

    return (
      <div className={cn("relative", className)} ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-0 transition-colors"
          style={{ backgroundColor: bgColor }}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="font-obviously font-medium text-sm lowercase text-bone">
            {initial}
          </span>
        </button>
        {isLoggedIn && isOpen && (
          <SeekersPanel open={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 bg-transparent",
          borderClass
        )}
        aria-expanded={isOpen}
        aria-label="Log in"
      >
        <User className={cn("h-4 w-4", iconClass)} strokeWidth={2} />
      </button>
      {!isLoggedIn && isOpen && (
        <LoginDialog open={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
