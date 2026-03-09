"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Radio, Building2, Calendar, MessageCircle, Shuffle, type LucideIcon } from "lucide-react";
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
  { label: "contact us", icon: MessageCircle, href: "/agency/contact" },
];

export interface QuickPillsProps {
  className?: string;
  pills?: QuickPill[];
}

export function QuickPills({ className, pills = DEFAULT_PILLS }: QuickPillsProps) {
  const router = useRouter();
  const prefetchedPathRef = useRef<string | null>(null);
  const pillClass =
    "flex items-center gap-1.5 px-3 py-1.5 border border-bone/30 rounded-lg text-bone font-obviously font-medium text-[13px] lowercase hover:bg-bone/10 hover:border-bone/50 transition-colors cursor-pointer";

  const fetchAndStoreRandomPath = () => {
    fetch("/go/random?json=1")
      .then((res) => res.json() as Promise<{ path: string }>)
      .then(({ path }) => {
        if (path && path !== "/") {
          prefetchedPathRef.current = path;
          router.prefetch(path);
        } else {
          prefetchedPathRef.current = null;
        }
      })
      .catch(() => {
        prefetchedPathRef.current = null;
      });
  };

  useEffect(() => {
    const schedule = () => {
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(() => fetchAndStoreRandomPath(), { timeout: 2000 });
      } else {
        setTimeout(() => fetchAndStoreRandomPath(), 1500);
      }
    };
    schedule();
  }, [router]);

  const handleSurpriseClick = () => {
    if (prefetchedPathRef.current) {
      const path = prefetchedPathRef.current;
      prefetchedPathRef.current = null;
      router.push(path);
      fetchAndStoreRandomPath();
      return;
    }
    fetch("/go/random?json=1")
      .then((res) => res.json() as Promise<{ path: string }>)
      .then(({ path }) => {
        const toNavigate = path && path !== "/" ? path : "/";
        router.push(toNavigate);
        fetchAndStoreRandomPath();
      })
      .catch(() => router.push(`/go/random?_=${Date.now()}`));
  };

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
        onClick={handleSurpriseClick}
        className={pillClass}
        role="listitem"
      >
        <Shuffle size={16} strokeWidth={1.5} className="flex-shrink-0" aria-hidden />
        surprise me
      </button>
    </div>
  );
}
