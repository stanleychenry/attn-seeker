"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Radio, Building2, Calendar, Shuffle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickPill {
  label: string;
  icon: LucideIcon;
  href: string;
}

const DEFAULT_PILLS: QuickPill[] = [
  { label: "newsletter", icon: Mail, href: "/learn" },
  { label: "podcasts", icon: Radio, href: "/podcasts" },
  { label: "agency", icon: Building2, href: "/agency" },
  { label: "events", icon: Calendar, href: "/events" },
];

export interface QuickPillsProps {
  className?: string;
  pills?: QuickPill[];
}

export function QuickPills({ className, pills = DEFAULT_PILLS }: QuickPillsProps) {
  const router = useRouter();
  const pillClass =
    "flex items-center gap-1.5 px-3 py-1.5 border border-bone/30 rounded-lg text-bone font-obviously font-medium text-[13px] lowercase hover:bg-bone/10 hover:border-bone/50 transition-colors cursor-pointer";

  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center justify-center gap-2",
        className
      )}
      role="list"
    >
      {pills.map((pill) => {
        const Icon = pill.icon;
        return (
          <Link
            key={pill.label}
            href={pill.href}
            className={pillClass}
            role="listitem"
          >
            <Icon size={16} strokeWidth={1.5} className="flex-shrink-0" aria-hidden />
            {pill.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => router.push(`/go/random?_=${Date.now()}`)}
        className={pillClass}
        role="listitem"
      >
        <Shuffle size={16} strokeWidth={1.5} className="flex-shrink-0" aria-hidden />
        surprise me
      </button>
    </div>
  );
}
