"use client";

import { cn } from "@/lib/utils";

export interface StatProps {
  value: string;
  label: string;
  className?: string;
}

export function Stat({ value, label, className }: StatProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-0 text-center",
        className
      )}
    >
      <span className="font-obviously font-black text-stat md:text-stat-mobile">
        {value}
      </span>
      <span className="font-obviously font-normal text-caption text-black/55">
        {label}
      </span>
    </div>
  );
}
